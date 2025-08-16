"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "../../components/SideBar";
import { FaSnowflake } from "react-icons/fa";
import { motion } from "framer-motion";

import {
  Upload,
  Play,
  Pause,
  Brain,
  Grid3X3,
  FileImage,
  Info,
  AlertCircle,
  Loader,
  XCircle,
} from "lucide-react";

const parseDicomFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const arrayBuffer = e.target.result;
        const dataView = new DataView(arrayBuffer);

        let offset = 128;
        let dicmPrefix = "";
        if (dataView.byteLength >= 132) {
          dicmPrefix = String.fromCharCode(
            dataView.getUint8(offset),
            dataView.getUint8(offset + 1),
            dataView.getUint8(offset + 2),
            dataView.getUint8(offset + 3)
          );
        }

        if (dicmPrefix !== "DICM") {
          offset = 0;
        } else {
          offset += 4;
        }

        const dicomData = parseDicomElements(dataView, offset);
        const pixelData = extractPixelData(dataView, dicomData);

        resolve({
          metadata: dicomData,
          pixelData: pixelData,
          isValidDicom: true,
          filename: file.name,
          filesize: file.size,
        });
      } catch (error) {
        reject(
          new Error(`DICOM parsing failed for ${file.name}: ${error.message}`)
        );
      }
    };
    reader.onerror = () =>
      reject(new Error(`File reading failed for ${file.name}`));
    reader.readAsArrayBuffer(file);
  });
};

const parseDicomElements = (dataView, startOffset) => {
  const elements = {};
  let offset = startOffset;
  const fileSize = dataView.byteLength;

  // Common DICOM tags we want to extract
  const importantTags = {
    "0010,0010": "patientName",
    "0010,0020": "patientID",
    "0010,0030": "patientBirthDate",
    "0010,0040": "patientSex",
    "0008,0020": "studyDate",
    "0008,0030": "studyTime",
    "0008,0060": "modality",
    "0008,0070": "manufacturer",
    "0008,0080": "institutionName",
    "0008,1030": "studyDescription",
    "0018,0050": "sliceThickness",
    "0018,0080": "repetitionTime",
    "0018,0081": "echoTime",
    "0018,0087": "magneticFieldStrength",
    "0020,0011": "seriesNumber",
    "0020,0013": "instanceNumber",
    "0020,1041": "sliceLocation",
    "0028,0010": "rows",
    "0028,0011": "columns",
    "0028,0100": "bitsAllocated",
    "0028,0101": "bitsStored",
    "0028,0102": "highBit",
    "0028,0103": "pixelRepresentation",
    "0028,1050": "windowCenter",
    "0028,1051": "windowWidth",
    "0028,1052": "rescaleIntercept",
    "0028,1053": "rescaleSlope",
    "7FE0,0010": "pixelData",
  };

  try {
    while (offset < fileSize - 8) {
      // Read tag (group, element)
      const group = dataView.getUint16(offset, true);
      const element = dataView.getUint16(offset + 2, true);
      const tag = `${group
        .toString(16)
        .padStart(4, "0")
        .toUpperCase()},${element.toString(16).padStart(4, "0").toUpperCase()}`;

      offset += 4;

      // Read VR (Value Representation)
      let vr = "";
      let isExplicitVR = true;

      if (offset + 2 > fileSize) {
        // Prevent reading past end of file for VR
        isExplicitVR = false; // Assume implicit if not enough bytes for VR
      } else {
        try {
          vr = String.fromCharCode(
            dataView.getUint8(offset),
            dataView.getUint8(offset + 1)
          );
          offset += 2;
        } catch (e) {
          isExplicitVR = false;
          // offset -= 2; // No need to decrement here, just means it wasn't explicit VR
        }
      }

      // Read length
      let length;
      if (isExplicitVR && ["OB", "OW", "OF", "SQ", "UT", "UN"].includes(vr)) {
        if (offset + 2 > fileSize)
          throw new Error("Not enough bytes for reserved VR length");
        offset += 2; // Reserved bytes
        if (offset + 4 > fileSize)
          throw new Error("Not enough bytes for explicit VR length");
        length = dataView.getUint32(offset, true);
        offset += 4;
      } else if (isExplicitVR) {
        if (offset + 2 > fileSize)
          throw new Error("Not enough bytes for explicit VR length");
        length = dataView.getUint16(offset, true);
        offset += 2;
      } else {
        // Implicit VR
        if (offset + 4 > fileSize)
          throw new Error("Not enough bytes for implicit VR length");
        length = dataView.getUint32(offset, true);
        offset += 4;
      }

      // Handle undefined length
      if (length === 0xffffffff) {
        // For sequences with undefined length, we need to find the sequence delimitation item.
        // This parser is simplified and will skip over such sequences.
        // For a full DICOM parser, you'd need to recursively parse the sequence items.
        // For now, we'll just break or skip a large chunk if it's pixel data.
        if (tag === "7FE0,0010") {
          // Pixel Data with undefined length
          // This is a common and complex case. For simplicity, we'll skip it for now.
          // A full implementation would parse Basic Offset Table and Encapsulated Pixel Data.
          console.warn(`Skipping undefined length pixel data for tag ${tag}`);
          break; // Stop parsing to prevent infinite loop
        }
        console.warn(`Skipping undefined length sequence for tag ${tag}`);
        break; // Or implement proper sequence parsing
      }

      // Ensure length does not exceed remaining file size
      if (offset + length > fileSize) {
        console.warn(
          `DICOM element ${tag} length (${length}) exceeds remaining file size. Truncating value.`
        );
        length = fileSize - offset; // Adjust length to prevent overflow
        if (length < 0) length = 0; // Ensure length is non-negative
      }

      // Extract value if it's an important tag
      if (importantTags[tag] && offset + length <= fileSize) {
        let value;

        if (tag === "7FE0,0010") {
          // Pixel data - store offset and length
          elements[importantTags[tag]] = { offset, length };
        } else {
          // Text/numeric data
          const bytes = new Uint8Array(dataView.buffer, offset, length);
          value = new TextDecoder("utf-8")
            .decode(bytes)
            .replace(/\0/g, "")
            .trim();
          elements[importantTags[tag]] = value;
        }
      }

      offset += length;

      // Safety check to prevent infinite loops (especially for zero-length elements without undefined length)
      if (length === 0 && isExplicitVR) {
        // Only advance if it's not undefined length and explicit
        // This condition is tricky. A length of 0 is valid.
        // If we always advance by 4, we might skip a valid next tag.
        // Better to rely on the main loop condition `offset < fileSize - 8`.
      }
    }
  } catch (error) {
    console.warn("DICOM parsing error:", error.message);
  }

  return elements;
};

const extractPixelData = (dataView, dicomData) => {
  const pixelDataInfo = dicomData.pixelData;
  if (!pixelDataInfo) return null;

  const rows = parseInt(dicomData.rows) || 512;
  const columns = parseInt(dicomData.columns) || 512;
  const bitsAllocated = parseInt(dicomData.bitsAllocated) || 16;
  const pixelRepresentation = parseInt(dicomData.pixelRepresentation) || 0; // 0 for unsigned, 1 for signed

  const { offset, length } = pixelDataInfo;

  // Ensure offset and length are within bounds
  if (offset < 0 || offset + length > dataView.byteLength) {
    console.error(
      `Pixel data offset (${offset}) or length (${length}) out of bounds (file size: ${dataView.byteLength}).`
    );
    return null;
  }

  const pixelArrayBuffer = dataView.buffer.slice(offset, offset + length);

  let imageData;
  if (bitsAllocated === 16) {
    imageData = new Uint16Array(pixelArrayBuffer);
  } else if (bitsAllocated === 8) {
    imageData = new Uint8Array(pixelArrayBuffer);
  } else {
    console.warn(
      `Unsupported bitsAllocated: ${bitsAllocated}. Defaulting to Uint8Array.`
    );
    imageData = new Uint8Array(pixelArrayBuffer);
  }

  return {
    data: imageData,
    rows,
    columns,
    bitsAllocated,
    pixelRepresentation,
    length: imageData.length,
  };
};

const MRIReader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentSlice, setCurrentSlice] = useState(0);
  const [totalSlices, setTotalSlices] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [dicomData, setDicomData] = useState(null);
  const [dicomFiles, setDicomFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const playIntervalRef = useRef(null);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("User signed out successfully");
      router.push("/");
      setSigningOut(false);
    } catch (error) {
      setSigningOut(false);
      console.error("Error signing out:", error.message);
    }
  };

  const renderDicomImage = useCallback(
    (pixelData, metadata) => {
      const canvas = canvasRef.current;
      if (!canvas || !pixelData || !pixelData.data) {
        console.warn("Canvas or pixel data not available for rendering.");
        return;
      }

      const ctx = canvas.getContext("2d");
      const { data, rows, columns, bitsAllocated, pixelRepresentation } =
        pixelData;

      // Set canvas dimensions to the image dimensions
      canvas.width = columns;
      canvas.height = rows;

      // Create image data
      const imageData = ctx.createImageData(columns, rows);
      const pixels = imageData.data;

      // Get window/level values for proper display
      // Default values if not present or invalid
      const windowCenter =
        parseFloat(metadata.windowCenter) || 1 << (bitsAllocated - 1); // Default to half of max value
      const windowWidth =
        parseFloat(metadata.windowWidth) || (1 << bitsAllocated) - 1; // Default to full range
      const rescaleIntercept = parseFloat(metadata.rescaleIntercept) || 0;
      const rescaleSlope = parseFloat(metadata.rescaleSlope) || 1;

      const windowMin = windowCenter - windowWidth / 2;
      const windowMax = windowCenter + windowWidth / 2;

      for (let i = 0; i < data.length; i++) {
        let pixelValue = data[i];

        // Handle signed pixel data if pixelRepresentation is 1 (2's complement)
        if (pixelRepresentation === 1 && bitsAllocated === 16) {
          // Convert unsigned 16-bit to signed 16-bit
          pixelValue = (pixelValue << 16) >> 16;
        } else if (pixelRepresentation === 1 && bitsAllocated === 8) {
          pixelValue = (pixelValue << 24) >> 24;
        }

        // Apply rescale slope and intercept
        pixelValue = pixelValue * rescaleSlope + rescaleIntercept;

        // Apply window/level
        let displayValue;
        if (pixelValue <= windowMin) {
          displayValue = 0;
        } else if (pixelValue >= windowMax) {
          displayValue = 255;
        } else {
          displayValue = ((pixelValue - windowMin) / windowWidth) * 255;
        }

        // Apply contrast and brightness adjustments (directly to pixel values before putting on canvas)
        // These are multiplicative factors on the 0-255 range.
        // A simple approach is: value' = ((value - 128) * contrast_factor) + 128) * brightness_factor
        // Or, directly scale the displayValue.
        // Let's keep it simple for now, applying directly to displayValue.
        displayValue = displayValue * (contrast / 100) * (brightness / 100);
        displayValue = Math.max(0, Math.min(255, displayValue)); // Clamp to 0-255

        const pixelIndex = i * 4;
        pixels[pixelIndex] = displayValue; // R
        pixels[pixelIndex + 1] = displayValue; // G
        pixels[pixelIndex + 2] = displayValue; // B
        pixels[pixelIndex + 3] = 255; // A
      }

      ctx.putImageData(imageData, 0, 0);
    },
    [contrast, brightness]
  );

  const generateMockMRISlice = useCallback(
    (sliceIndex) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const width = 512;
      const height = 512;

      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      // Ensure totalSlices is not 0 to prevent division by zero
      const sliceRatio = totalSlices > 0 ? sliceIndex / totalSlices : 0.5;

      const brainRadius = 180 - Math.abs(sliceRatio - 0.5) * 60;
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        brainRadius
      );
      gradient.addColorStop(
        0,
        `rgba(200, 200, 200, ${0.8 - sliceRatio * 0.3})`
      );
      gradient.addColorStop(
        0.3,
        `rgba(150, 150, 150, ${0.6 - sliceRatio * 0.2})`
      );
      gradient.addColorStop(
        0.7,
        `rgba(100, 100, 100, ${0.4 - sliceRatio * 0.1})`
      );
      gradient.addColorStop(1, "rgba(50, 50, 50, 0.2)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, brainRadius, 0, Math.PI * 2);
      ctx.fill();

      if (sliceRatio > 0.2 && sliceRatio < 0.8) {
        ctx.fillStyle = `rgba(20, 20, 20, ${
          0.8 - Math.abs(sliceRatio - 0.5) * 0.5
        })`;
        ctx.beginPath();
        ctx.ellipse(centerX - 30, centerY - 20, 25, 15, 0, 0, Math.PI * 2);
        ctx.ellipse(centerX + 30, centerY - 20, 25, 15, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 * i) / 20;
        const radius =
          brainRadius * (0.7 + Math.sin(sliceRatio * Math.PI * 4) * 0.1);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.fillStyle = `rgba(180, 180, 180, ${0.3 + sliceRatio * 0.2})`;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Filters for mock image are applied here, not by re-drawing
      // The main renderDicomImage handles it by manipulating pixel data.
      // For mock, we can apply directly to drawing operations or via CSS.
      // Given the current structure, let's omit ctx.filter = ... ctx.drawImage(canvas,0,0) as it's redundant and problematic.
      // CSS filters on the canvas element (applied in JSX style) would be more appropriate for mock image if pixel manipulation isn't done.
    },
    [totalSlices]
  );

  useEffect(() => {
    if (dicomFiles.length > 0 && dicomFiles[currentSlice]) {
      const currentFile = dicomFiles[currentSlice];
      if (currentFile.pixelData && currentFile.metadata) {
        renderDicomImage(currentFile.pixelData, currentFile.metadata);
      }
    } else {
      generateMockMRISlice(currentSlice);
    }
  }, [currentSlice, renderDicomImage, generateMockMRISlice, dicomFiles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // These are now handled by the parent div's transform style in JSX for visual effect
      // If you want actual drawing context transformation, apply them here with ctx.
      // For now, let's ensure the canvas itself is styled correctly for external CSS transforms
      canvas.style.transform = `scale(${
        zoom / 100
      }) rotate(${rotation}deg) translate(${panPosition.x}px, ${
        panPosition.y
      }px)`;
      // The contrast/brightness from state are handled by pixel manipulation in renderDicomImage,
      // so no need for CSS filter on canvas for those if renderDicomImage is being used.
      // If generateMockMRISlice also needs it, and isn't doing pixel manipulation, you could apply CSS filter here.
      // canvas.style.filter = `contrast(${contrast}%) brightness(${brightness}%)`;
    }
  }, [zoom, rotation, panPosition]);

  const handleFileUpload = async (files) => {
    setIsLoading(true);
    setError(null);
    setLoadingProgress(0);
    setDicomFiles([]);
    setDicomData(null);

    try {
      const fileArray = Array.from(files);
      const parsedFiles = [];
      const errorsOccurred = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setLoadingProgress(Math.round(((i + 1) / fileArray.length) * 100)); // Update progress

        try {
          const result = await parseDicomFile(file);
          parsedFiles.push(result);
        } catch (fileError) {
          console.warn(`Failed to parse ${file.name}:`, fileError.message);
          errorsOccurred.push(file.name);
        }
      }

      if (parsedFiles.length === 0) {
        throw new Error(
          `No valid DICOM files could be parsed. Errors occurred for: ${errorsOccurred.join(
            ", "
          )}`
        );
      }

      // Sort by instance number if available, otherwise by filename
      parsedFiles.sort((a, b) => {
        const instanceA = parseInt(a.metadata.instanceNumber) || 0;
        const instanceB = parseInt(b.metadata.instanceNumber) || 0;
        if (instanceA !== instanceB) {
          return instanceA - instanceB;
        }
        return a.filename.localeCompare(b.filename); // Fallback to filename sort
      });

      setDicomFiles(parsedFiles);
      setTotalSlices(parsedFiles.length);
      setCurrentSlice(0);
      setDicomData(parsedFiles[0]); // Set the first file as current DICOM data
      setError(
        errorsOccurred.length > 0
          ? `Some files failed to parse: ${errorsOccurred.join(", ")}`
          : null
      );
    } catch (err) {
      setError(err.message);
      console.error("DICOM upload error:", err);
    } finally {
      setIsLoading(false);
      setLoadingProgress(100); // Ensure progress is 100% even on error
    }
  };

  const handleSingleFileUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      clearInterval(playIntervalRef.current);
      setIsPlaying(false);
    } else {
      if (totalSlices <= 1) return; // No need to play if only one slice
      playIntervalRef.current = setInterval(() => {
        setCurrentSlice((prev) => (prev + 1) % totalSlices);
      }, 200);
      setIsPlaying(true);
    }
  };

  const handleSliceChange = (value) => {
    const sliceIndex = parseInt(value);
    setCurrentSlice(sliceIndex);

    // Update current DICOM data based on the selected slice
    if (dicomFiles.length > 0 && dicomFiles[sliceIndex]) {
      setDicomData(dicomFiles[sliceIndex]);
    }
  };

  const handleResetDicom = () => {
    clearInterval(playIntervalRef.current); // Stop any ongoing playback
    setIsPlaying(false);
    setDicomFiles([]);
    setDicomData(null);
    setTotalSlices(1);
    setCurrentSlice(0);
    setError(null);
    setLoadingProgress(0);
    resetView(); // Reset all view transformations
  };

  const getCurrentDicomInfo = () => {
    if (!dicomData || !dicomData.metadata) {
      return {
        patientName: "",
        patientID: "",
        studyDate: "",
        modality: "",
        manufacturer: "",
        institutionName: "",
        sliceThickness: "",
        repetitionTime: "",
        echoTime: "",
        magneticFieldStrength: "",
        rows: "",
        columns: "",
        bitsAllocated: "",
      };
    }

    const meta = dicomData.metadata;
    return {
      patientName: meta.patientName || "Unknown Patient",
      patientID: meta.patientID || "....",
      studyDate: meta.studyDate ? formatDicomDate(meta.studyDate) : "....",
      modality: meta.modality || "....",
      manufacturer: meta.manufacturer || "....",
      institutionName: meta.institutionName || "....",
      sliceThickness: meta.sliceThickness
        ? `${parseFloat(meta.sliceThickness).toFixed(2)} mm`
        : "....",
      repetitionTime: meta.repetitionTime
        ? `${parseFloat(meta.repetitionTime).toFixed(2)} ms`
        : "....",
      echoTime: meta.echoTime
        ? `${parseFloat(meta.echoTime).toFixed(2)} ms`
        : "....",
      magneticFieldStrength: meta.magneticFieldStrength
        ? `${parseFloat(meta.magneticFieldStrength).toFixed(1)} T`
        : "....",
      rows: meta.rows || "....",
      columns: meta.columns || "....",
      bitsAllocated: meta.bitsAllocated || "....",
    };
  };

  const formatDicomDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    return `${dateStr.substr(0, 4)}-${dateStr.substr(4, 2)}-${dateStr.substr(
      6,
      2
    )}`;
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 25));

  const resetView = () => {
    setZoom(100);
    setRotation(0);
    setPanPosition({ x: 0, y: 0 });
    setContrast(100);
    setBrightness(100);
  };

  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Calculate mouse position relative to the scaled and transformed canvas content
    // This is simplified and assumes the canvas itself is transformed by CSS
    // For precise pixel data lookup with transforms, you'd need to inverse the transforms.
    // For now, it's just mouse position relative to the canvas element's displayed area.
    const x = (e.clientX - rect.left) / (zoom / 100) - panPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - panPosition.y;

    setMousePos({ x: Math.round(x), y: Math.round(y) });
  };

  return (
    <div className="pl-15 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Header - now specific to chat page actions */}

      {/* Sidebar */}
      <Sidebar onSignOut={handleSignOut} />

      {/* Animated Medical Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Medical Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 grid-rows-12 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-blue-400/20"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-slate-900/90 backdrop-blur-sm border-b border-blue-500/30 p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-8 h-8 text-blue-400" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Flake Laboratories
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Sidebar - Tools */}
          <div className="w-40 bg-slate-900/50 backdrop-blur-sm border-r border-blue-500/30 p-4 space-y-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`flex-1 p-2 rounded-lg border transition-all duration-200 ${
                  showGrid
                    ? "bg-blue-600/30 border-blue-400"
                    : "bg-slate-800/50 border-slate-600"
                }`}
              >
                <Grid3X3 className="w-4 h-4 mx-auto" />
              </button>

              <button
                onClick={resetView}
                className="flex-1 p-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition-all duration-200"
              >
                Reset
              </button>
            </div>
            {/* Image Controls */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h2 className="flex items-center justify-center text-lg  font-semibold text-blue-300">
                  Controls
                </h2>

                <div>
                  <label className="flex items-center justify-center text-sm text-slate-300 py-3">
                    Zoom: {zoom}%
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="range"
                      min="25"
                      max="400"
                      value={zoom}
                      onChange={(e) => setZoom(parseInt(e.target.value))}
                      className="custom-range-slider"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-center text-sm text-slate-300 py-3">
                    Contrast: {contrast}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                    className="custom-range-slider"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-center text-sm text-slate-300 py-3">
                    Brightness: {brightness}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="custom-range-slider"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-center text-sm text-slate-300 py-3">
                    Rotation: {rotation}°
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={rotation}
                      onChange={(e) => setRotation(parseInt(e.target.value))}
                      className="custom-range-slider"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Viewer */}
          <div className="flex-1 flex flex-col">
            {/* Viewer Controls */}
            <div className="bg-slate-800/50 backdrop-blur-sm border-b border-blue-500/30 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {!dicomData ? (
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        isDragging
                          ? "border-blue-400 bg-blue-500/10"
                          : "border-slate-600 hover:border-blue-500"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2 text-blue-400">
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>
                            Loading... ({loadingProgress.toFixed(0)}%)
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Upload className="w-8 h-2 text-blue-400" />
                          <span className="text-sm">Upload</span>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".dcm,.dicom,application/dicom" // Added application/dicom MIME type
                        onChange={handleSingleFileUpload} // Corrected onChange handler
                        className="hidden"
                        multiple // Allow multiple file selection
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <FileImage className="w-5 h-5 text-green-400" />
                      <span className="text-green-300">
                        {dicomData.filename || "DICOM Loaded"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {/* Slice Indicator and Playback Button */}
                  <span className="text-sm text-slate-400">
                    Slice {currentSlice + 1} / {totalSlices}
                  </span>
                  <button
                    onClick={togglePlayback}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200"
                    disabled={totalSlices <= 1} // Disable playback if only one slice
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  {/* Reset/Delete MRI Button */}
                  {dicomData && ( // Only show if a DICOM is loaded
                    <button
                      onClick={handleResetDicom}
                      className="p-2 bg-red-600/30 hover:bg-red-600/50 rounded-lg border border-red-500/30 transition-all duration-200"
                      title="Delete Uploaded MRI"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Loading/Error Messages */}

              {error && (
                <div className="mt-2 text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Error: {error}
                </div>
              )}

              {/* Slice Navigator */}
              {dicomData && (
                <div className="mt-4">
                  <input
                    type="range"
                    min="0"
                    max={totalSlices > 0 ? totalSlices - 1 : 0}
                    value={currentSlice}
                    onChange={(e) => handleSliceChange(e.target.value)}
                    className="custom-range-slider"
                    disabled={totalSlices <= 1} // Disable slider if only one slice
                  />
                </div>
              )}
            </div>

            {/* Image Viewer */}
            {dicomData != null ? (
              <div className="flex-1 relative bg-blue overflow-hidden flex items-center justify-center">
                <div
                  className="relative flex items-center justify-center h-full w-full" // Use h-full w-full to fill parent div
                >
                  <canvas
                    ref={canvasRef}
                    className="border border-blue-500/30 shadow-2xl cursor-crosshair max-w-full max-h-full" // Added max-width/height
                    onMouseMove={handleCanvasMouseMove}
                    // Apply transforms directly to the canvas for display
                    style={{
                      transform: `scale(${
                        zoom / 100
                      }) rotate(${rotation}deg) translate(${panPosition.x}px, ${
                        panPosition.y
                      }px)`,
                      imageRendering: "pixelated", // Improves sharp pixel scaling
                    }}
                  />

                  {/* Grid Overlay */}
                  {showGrid && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      {/* Position the grid overlay relative to the canvas, and scale/rotate it */}
                      <div
                        className="relative"
                        style={{
                          width: canvasRef.current?.width || 512,
                          height: canvasRef.current?.height || 512,
                          transform: `scale(${
                            zoom / 100
                          }) rotate(${rotation}deg) translate(${
                            panPosition.x
                          }px, ${panPosition.y}px)`,
                        }}
                      >
                        <div className="grid grid-cols-8 grid-rows-8 h-full w-full opacity-30">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div
                              key={i}
                              className="border border-blue-400/50"
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Bar */}
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-2 border border-blue-500/30">
                  <div className="text-xs space-y-1">
                    <div>
                      Mouse: ({mousePos.x}, {mousePos.y})
                    </div>
                    <div>Zoom: {zoom}%</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 relative bg-blue overflow-hidden flex items-center justify-center">
                <div
                  className="relative flex items-center justify-center h-full w-full" // Use h-full w-full to fill parent div
                >
                  <div>
                    <div className="flex justify-center items-center py-10">
                      <div className="absolute inset-0  rounded-full blur-xl opacity-50 animate-pulse"></div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 8,
                          ease: "linear",
                        }}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-full w-fit"
                      >
                        <FaSnowflake className="w-16 h-16 text-white" />
                      </motion.div>
                    </div>
                    <div className="flex justify-center items-center py-5">
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 animate-gradient"
                      >
                        Flake Laboratories
                      </motion.h1>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - DICOM Info */}
          <div className="w-50 bg-slate-900/50 backdrop-blur-sm border-l border-blue-500/30 p-4 space-y-4 overflow-y-auto">
            <h4 className="text-base font-semibold text-blue-300 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Meta-data
            </h4>

            <div className="space-y-3">
              {Object.entries(getCurrentDicomInfo()).map(([key, value]) => {
                // Remove rows, columns, bitsAllocated from display based on user request
                if (["rows", "columns", "bitsAllocated"].includes(key)) {
                  return null; // Do not render these items
                }
                return (
                  <div
                    key={key}
                    className="bg-slate-800/50 rounded-lg p-3 border border-slate-600"
                  >
                    <div className="text-xs text-slate-400  uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    <div className="text-sm text-blue-300">{value}</div>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="mt-6">
              <h4 className="text-md font-semibold text-blue-300 mb-3">
                Quick Stats
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-600/20 rounded-lg p-2 text-center border border-blue-500/30">
                  <div className="text-lg font-bold text-blue-300">
                    {totalSlices}
                  </div>
                  <div className="text-xs text-slate-400">Slices</div>
                </div>
                {/* Matrix (rows x columns) can be kept as it's a useful summary, even if individual rows/columns are removed */}
                <div className="bg-green-600/20 rounded-lg p-2 text-center border border-green-500/30">
                  <div className="text-lg font-bold text-green-300">
                    {dicomData?.metadata?.rows && dicomData?.metadata?.columns
                      ? `${dicomData.metadata.rows}x${dicomData.metadata.columns}`
                      : "N/A"}
                  </div>
                  <div className="text-xs text-slate-400">Matrix</div>
                </div>
                <div className="bg-purple-600/20 rounded-lg p-2 text-center border border-purple-500/30">
                  <div className="text-lg font-bold text-purple-300">
                    {dicomData?.metadata?.magneticFieldStrength
                      ? `${parseFloat(
                          dicomData.metadata.magneticFieldStrength
                        ).toFixed(1)}T`
                      : "N/A"}
                  </div>
                  <div className="text-xs text-slate-400">Field</div>
                </div>
                <div className="bg-cyan-600/20 rounded-lg p-2 text-center border border-cyan-500/30">
                  <div className="text-lg font-bold text-cyan-300">
                    {dicomData?.metadata?.modality || "N/A"}
                  </div>
                  <div className="text-xs text-slate-400">Modality</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MRIReader;
