// "use client";
// import React, { useState, useRef, useEffect, useCallback } from "react";
// import Sidebar from "../../components/SideBar";
// import { supabase } from "../../lib/supabaseClient";
// import { FaSnowflake } from "react-icons/fa";
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";
// import {
//   Upload,
//   Play,
//   Pause,
//   Brain,
//   Grid3X3,
//   FileImage,
//   Info,
//   AlertCircle,
//   Loader,
//   XCircle,
//   ZoomIn,
//   ZoomOut,
//   Move,
//   Sun,
//   Moon,
//   Ruler,
// } from "lucide-react";

// const parseDicomFile = async (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = function (e) {
//       try {
//         const arrayBuffer = e.target.result;
//         const dataView = new DataView(arrayBuffer);

//         let offset = 128;
//         let dicmPrefix = "";
//         if (dataView.byteLength >= 132) {
//           dicmPrefix = String.fromCharCode(
//             dataView.getUint8(offset),
//             dataView.getUint8(offset + 1),
//             dataView.getUint8(offset + 2),
//             dataView.getUint8(offset + 3)
//           );
//         }

//         if (dicmPrefix !== "DICM") {
//           offset = 0;
//         } else {
//           offset += 4;
//         }

//         const dicomData = parseDicomElements(dataView, offset);
//         const pixelData = extractPixelData(dataView, dicomData);

//         resolve({
//           metadata: dicomData,
//           pixelData: pixelData,
//           isValidDicom: true,
//           filename: file.name,
//           filesize: file.size,
//         });
//       } catch (error) {
//         reject(
//           new Error(`DICOM parsing failed for ${file.name}: ${error.message}`)
//         );
//       }
//     };
//     reader.onerror = () =>
//       reject(new Error(`File reading failed for ${file.name}`));
//     reader.readAsArrayBuffer(file);
//   });
// };

// const parseDicomElements = (dataView, startOffset) => {
//   const elements = {};
//   let offset = startOffset;
//   const fileSize = dataView.byteLength;

//   // Common DICOM tags we want to extract
//   const importantTags = {
//     "0010,0010": "patientName",
//     "0010,0020": "patientID",
//     "0010,0030": "patientBirthDate",
//     "0010,0040": "patientSex",
//     "0008,0020": "studyDate",
//     "0008,0030": "studyTime",
//     "0008,0060": "modality",
//     "0008,0070": "manufacturer",
//     "0008,0080": "institutionName",
//     "0008,1030": "studyDescription",
//     "0018,0050": "sliceThickness",
//     "0018,0080": "repetitionTime",
//     "0018,0081": "echoTime",
//     "0018,0087": "magneticFieldStrength",
//     "0020,0011": "seriesNumber",
//     "0020,0013": "instanceNumber",
//     "0020,1041": "sliceLocation",
//     "0028,0010": "rows",
//     "0028,0011": "columns",
//     "0028,0100": "bitsAllocated",
//     "0028,0101": "bitsStored",
//     "0028,0102": "highBit",
//     "0028,0103": "pixelRepresentation",
//     "0028,1050": "windowCenter",
//     "0028,1051": "windowWidth",
//     "0028,1052": "rescaleIntercept",
//     "0028,1053": "rescaleSlope",
//     "7FE0,0010": "pixelData",
//   };

//   try {
//     while (offset < fileSize - 8) {
//       // Read tag (group, element)
//       const group = dataView.getUint16(offset, true);
//       const element = dataView.getUint16(offset + 2, true);
//       const tag = `${group
//         .toString(16)
//         .padStart(4, "0")
//         .toUpperCase()},${element.toString(16).padStart(4, "0").toUpperCase()}`;

//       offset += 4;

//       // Read VR (Value Representation)
//       let vr = "";
//       let isExplicitVR = true;

//       if (offset + 2 > fileSize) {
//         // Prevent reading past end of file for VR
//         isExplicitVR = false; // Assume implicit if not enough bytes for VR
//       } else {
//         try {
//           vr = String.fromCharCode(
//             dataView.getUint8(offset),
//             dataView.getUint8(offset + 1)
//           );
//           offset += 2;
//         } catch (e) {
//           isExplicitVR = false;
//           // offset -= 2; // No need to decrement here, just means it wasn't explicit VR
//         }
//       }

//       // Read length
//       let length;
//       if (isExplicitVR && ["OB", "OW", "OF", "SQ", "UT", "UN"].includes(vr)) {
//         if (offset + 2 > fileSize)
//           throw new Error("Not enough bytes for reserved VR length");
//         offset += 2; // Reserved bytes
//         if (offset + 4 > fileSize)
//           throw new Error("Not enough bytes for explicit VR length");
//         length = dataView.getUint32(offset, true);
//         offset += 4;
//       } else if (isExplicitVR) {
//         if (offset + 2 > fileSize)
//           throw new Error("Not enough bytes for explicit VR length");
//         length = dataView.getUint16(offset, true);
//         offset += 2;
//       } else {
//         // Implicit VR
//         if (offset + 4 > fileSize)
//           throw new Error("Not enough bytes for implicit VR length");
//         length = dataView.getUint32(offset, true);
//         offset += 4;
//       }

//       // Handle undefined length
//       if (length === 0xffffffff) {
//         // For sequences with undefined length, we need to find the sequence delimitation item.
//         // This parser is simplified and will skip over such sequences.
//         // For a full DICOM parser, you'd need to recursively parse the sequence items.
//         // For now, we'll just break or skip a large chunk if it's pixel data.
//         if (tag === "7FE0,0010") {
//           // Pixel Data with undefined length
//           // This is a common and complex case. For simplicity, we'll skip it for now.
//           // A full implementation would parse Basic Offset Table and Encapsulated Pixel Data.
//           console.warn(`Skipping undefined length pixel data for tag ${tag}`);
//           break; // Stop parsing to prevent infinite loop
//         }
//         console.warn(`Skipping undefined length sequence for tag ${tag}`);
//         break; // Or implement proper sequence parsing
//       }

//       // Ensure length does not exceed remaining file size
//       if (offset + length > fileSize) {
//         console.warn(
//           `DICOM element ${tag} length (${length}) exceeds remaining file size. Truncating value.`
//         );
//         length = fileSize - offset; // Adjust length to prevent overflow
//         if (length < 0) length = 0; // Ensure length is non-negative
//       }

//       // Extract value if it's an important tag
//       if (importantTags[tag] && offset + length <= fileSize) {
//         let value;

//         if (tag === "7FE0,0010") {
//           // Pixel data - store offset and length
//           elements[importantTags[tag]] = { offset, length };
//         } else {
//           // Text/numeric data
//           const bytes = new Uint8Array(dataView.buffer, offset, length);
//           value = new TextDecoder("utf-8")
//             .decode(bytes)
//             .replace(/\0/g, "")
//             .trim();
//           elements[importantTags[tag]] = value;
//         }
//       }

//       offset += length;

//       // Safety check to prevent infinite loops (especially for zero-length elements without undefined length)
//       if (length === 0 && isExplicitVR) {
//         // Only advance if it's not undefined length and explicit
//         // This condition is tricky. A length of 0 is valid.
//         // If we always advance by 4, we might skip a valid next tag.
//         // Better to rely on the main loop condition `offset < fileSize - 8`.
//       }
//     }
//   } catch (error) {
//     console.warn("DICOM parsing error:", error.message);
//   }

//   return elements;
// };

// const extractPixelData = (dataView, dicomData) => {
//   const pixelDataInfo = dicomData.pixelData;
//   if (!pixelDataInfo) return null;

//   const rows = parseInt(dicomData.rows) || 512;
//   const columns = parseInt(dicomData.columns) || 512;
//   const bitsAllocated = parseInt(dicomData.bitsAllocated) || 16;
//   const pixelRepresentation = parseInt(dicomData.pixelRepresentation) || 0; // 0 for unsigned, 1 for signed

//   const { offset, length } = pixelDataInfo;

//   // Ensure offset and length are within bounds
//   if (offset < 0 || offset + length > dataView.byteLength) {
//     console.error(
//       `Pixel data offset (${offset}) or length (${length}) out of bounds (file size: ${dataView.byteLength}).`
//     );
//     return null;
//   }

//   const pixelArrayBuffer = dataView.buffer.slice(offset, offset + length);

//   let imageData;
//   if (bitsAllocated === 16) {
//     imageData = new Uint16Array(pixelArrayBuffer);
//   } else if (bitsAllocated === 8) {
//     imageData = new Uint8Array(pixelArrayBuffer);
//   } else {
//     console.warn(
//       `Unsupported bitsAllocated: ${bitsAllocated}. Defaulting to Uint8Array.`
//     );
//     imageData = new Uint8Array(pixelArrayBuffer);
//   }

//   return {
//     data: imageData,
//     rows,
//     columns,
//     bitsAllocated,
//     pixelRepresentation,
//     length: imageData.length,
//   };
// };

// const MRIReader = () => {
//   const [user, setUser] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [currentSlice, setCurrentSlice] = useState(0);
//   const [totalSlices, setTotalSlices] = useState(1);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [zoom, setZoom] = useState(100);
//   const [loading, setLoading] = useState(true);
//   const [rotation, setRotation] = useState(0);
//   const [contrast, setContrast] = useState(100);
//   const [brightness, setBrightness] = useState(100);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
//   const [dicomData, setDicomData] = useState(null);
//   const [dicomFiles, setDicomFiles] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const router = useRouter();
  

//   // Added state for new controls
//   const [activeTool, setActiveTool] = useState("pan");
//   const [windowCenter, setWindowCenter] = useState(null);
//   const [windowWidth, setWindowWidth] = useState(null);
//   const [invert, setInvert] = useState(false);
//   const [measurements, setMeasurements] = useState([]);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [signingOut, setSigningOut] = useState(false);

//   const canvasRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const playIntervalRef = useRef(null);
//   const viewerRef = useRef(null);
//   const mouseInteractionRef = useRef({
//     isMouseDown: false,
//     startPos: { x: 0, y: 0 },
//     startPan: { x: 0, y: 0 },
//   });

//   // auth section --snowflake
//   useEffect(() => {
//     const checkAuth = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       if (!session) {
//         router.push("/"); // not logged in → redirect to root
//       } else {
//         setUser(session.user);
//       }
//       setLoading(false);
//     };

//     checkAuth();

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (!session) {
//         router.push("/");
//       } else {
//         setUser(session.user);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, [router]);

//   const handleSignOut = async () => {
//     setSigningOut(true);
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//       console.log("User signed out successfully");
//       router.push("/");
//     } catch (error) {
//       console.error("Error signing out:", error.message);
//     } finally {
//       setSigningOut(false);
//     }
//   };

//   const renderDicomImage = useCallback(
//     (pixelData, metadata) => {
//       const canvas = canvasRef.current;
//       const viewerContainer = viewerRef.current;
//       if (!canvas || !pixelData || !pixelData.data || !viewerContainer) {
//         return;
//       }

//       const ctx = canvas.getContext("2d");
//       const { data, rows, columns, bitsAllocated, pixelRepresentation } =
//         pixelData;

//       // Determine initial window/level values
//       const wc =
//         windowCenter ??
//         parseFloat(metadata.windowCenter) ??
//         1 << (bitsAllocated - 1);
//       const ww =
//         windowWidth ??
//         parseFloat(metadata.windowWidth) ??
//         (1 << bitsAllocated) - 1;
//       const rescaleIntercept = parseFloat(metadata.rescaleIntercept) || 0;
//       const rescaleSlope = parseFloat(metadata.rescaleSlope) || 1;

//       const windowMin = wc - ww / 2;
//       const windowMax = wc + ww / 2;

//       const imageData = new ImageData(columns, rows);
//       const pixels = imageData.data;

//       for (let i = 0; i < data.length; i++) {
//         let pixelValue = data[i];

//         if (pixelRepresentation === 1) {
//           // Signed
//           if (bitsAllocated === 16) pixelValue = (pixelValue << 16) >> 16;
//           else if (bitsAllocated === 8) pixelValue = (pixelValue << 24) >> 24;
//         }

//         pixelValue = pixelValue * rescaleSlope + rescaleIntercept;

//         let displayValue;
//         if (pixelValue <= windowMin) {
//           displayValue = 0;
//         } else if (pixelValue >= windowMax) {
//           displayValue = 255;
//         } else {
//           displayValue = ((pixelValue - windowMin) / ww) * 255;
//         }

//         if (invert) {
//           displayValue = 255 - displayValue;
//         }

//         const pixelIndex = i * 4;
//         pixels[pixelIndex] = displayValue;
//         pixels[pixelIndex + 1] = displayValue;
//         pixels[pixelIndex + 2] = displayValue;
//         pixels[pixelIndex + 3] = 255;
//       }

//       // Create an off-screen canvas to draw the raw image data
//       const imageCanvas = document.createElement("canvas");
//       imageCanvas.width = columns;
//       imageCanvas.height = rows;
//       imageCanvas.getContext("2d").putImageData(imageData, 0, 0);

//       const viewerWidth = viewerContainer.clientWidth;
//       const viewerHeight = viewerContainer.clientHeight;
//       const imageAspectRatio = columns / rows;
//       const viewerAspectRatio = viewerWidth / viewerHeight;

//       let canvasWidth, canvasHeight;

//       if (imageAspectRatio > viewerAspectRatio) {
//         canvasWidth = viewerWidth;
//         canvasHeight = viewerWidth / imageAspectRatio;
//       } else {
//         canvasHeight = viewerHeight;
//         canvasWidth = viewerHeight * imageAspectRatio;
//       }

//       // Resize the main canvas to the viewer dimensions
//       canvas.width = viewerWidth;
//       canvas.height = viewerHeight;
//       ctx.clearRect(0, 0, viewerWidth, viewerHeight);

//       // Center the image with pan and zoom
//       const drawX =
//         (viewerWidth - canvasWidth * (zoom / 100)) / 2 + panPosition.x;
//       const drawY =
//         (viewerHeight - canvasHeight * (zoom / 100)) / 2 + panPosition.y;

//       ctx.save();
//       ctx.translate(drawX, drawY);
//       ctx.scale(zoom / 100, zoom / 100);
//       ctx.imageSmoothingEnabled = false;
//       ctx.drawImage(imageCanvas, 0, 0, canvasWidth, canvasHeight);
//       ctx.restore();

//       // Draw measurements on top
//       measurements.forEach((m) => {
//         ctx.beginPath();
//         ctx.moveTo(m.start.x, m.start.y);
//         ctx.lineTo(m.end.x, m.end.y);
//         ctx.strokeStyle = "cyan";
//         ctx.lineWidth = 2;
//         ctx.stroke();

//         const dist = Math.sqrt(
//           Math.pow(m.end.x - m.start.x, 2) + Math.pow(m.end.y - m.start.y, 2)
//         ).toFixed(1);
//         ctx.fillStyle = "cyan";
//         ctx.font = "14px Arial";
//         ctx.fillText(`${dist} px`, m.end.x + 5, m.end.y - 5);
//       });
//     },
//     [zoom, panPosition, windowCenter, windowWidth, invert, measurements]
//   );

//   const generateMockMRISlice = useCallback(
//     (sliceIndex) => {
//       const canvas = canvasRef.current;
//       if (!canvas) return;

//       const ctx = canvas.getContext("2d");
//       const width = 512;
//       const height = 512;

//       canvas.width = width;
//       canvas.height = height;

//       ctx.fillStyle = "#000000";
//       ctx.fillRect(0, 0, width, height);

//       const centerX = width / 2;
//       const centerY = height / 2;
//       // Ensure totalSlices is not 0 to prevent division by zero
//       const sliceRatio = totalSlices > 0 ? sliceIndex / totalSlices : 0.5;

//       const brainRadius = 180 - Math.abs(sliceRatio - 0.5) * 60;
//       const gradient = ctx.createRadialGradient(
//         centerX,
//         centerY,
//         0,
//         centerX,
//         centerY,
//         brainRadius
//       );
//       gradient.addColorStop(
//         0,
//         `rgba(200, 200, 200, ${0.8 - sliceRatio * 0.3})`
//       );
//       gradient.addColorStop(
//         0.3,
//         `rgba(150, 150, 150, ${0.6 - sliceRatio * 0.2})`
//       );
//       gradient.addColorStop(
//         0.7,
//         `rgba(100, 100, 100, ${0.4 - sliceRatio * 0.1})`
//       );
//       gradient.addColorStop(1, "rgba(50, 50, 50, 0.2)");

//       ctx.fillStyle = gradient;
//       ctx.beginPath();
//       ctx.arc(centerX, centerY, brainRadius, 0, Math.PI * 2);
//       ctx.fill();

//       if (sliceRatio > 0.2 && sliceRatio < 0.8) {
//         ctx.fillStyle = `rgba(20, 20, 20, ${
//           0.8 - Math.abs(sliceRatio - 0.5) * 0.5
//         })`;
//         ctx.beginPath();
//         ctx.ellipse(centerX - 30, centerY - 20, 25, 15, 0, 0, Math.PI * 2);
//         ctx.ellipse(centerX + 30, centerY - 20, 25, 15, 0, 0, Math.PI * 2);
//         ctx.fill();
//       }

//       for (let i = 0; i < 20; i++) {
//         const angle = (Math.PI * 2 * i) / 20;
//         const radius =
//           brainRadius * (0.7 + Math.sin(sliceRatio * Math.PI * 4) * 0.1);
//         const x = centerX + Math.cos(angle) * radius;
//         const y = centerY + Math.sin(angle) * radius;

//         ctx.fillStyle = `rgba(180, 180, 180, ${0.3 + sliceRatio * 0.2})`;
//         ctx.beginPath();
//         ctx.arc(x, y, 3, 0, Math.PI * 2);
//         ctx.fill();
//       }
//     },
//     [totalSlices]
//   );

//   useEffect(() => {
//     if (dicomFiles.length > 0 && dicomFiles[currentSlice]) {
//       const currentFile = dicomFiles[currentSlice];
//       if (currentFile.pixelData && currentFile.metadata) {
//         renderDicomImage(currentFile.pixelData, currentFile.metadata);
//       }
//     } else {
//       generateMockMRISlice(currentSlice);
//     }
//   }, [currentSlice, renderDicomImage, generateMockMRISlice, dicomFiles]);

//   const handleFileUpload = async (files) => {
//     setIsLoading(true);
//     setError(null);
//     setLoadingProgress(0);
//     setDicomFiles([]);
//     setDicomData(null);

//     try {
//       const fileArray = Array.from(files);
//       const parsedFiles = [];
//       const errorsOccurred = [];

//       for (let i = 0; i < fileArray.length; i++) {
//         const file = fileArray[i];
//         setLoadingProgress(Math.round(((i + 1) / fileArray.length) * 100)); // Update progress

//         try {
//           const result = await parseDicomFile(file);
//           parsedFiles.push(result);
//         } catch (fileError) {
//           console.warn(`Failed to parse ${file.name}:`, fileError.message);
//           errorsOccurred.push(file.name);
//         }
//       }

//       if (parsedFiles.length === 0) {
//         throw new Error(
//           `No valid DICOM files could be parsed. Errors occurred for: ${errorsOccurred.join(
//             ", "
//           )}`
//         );
//       }

//       // Sort by instance number if available, otherwise by filename
//       parsedFiles.sort((a, b) => {
//         const instanceA = parseInt(a.metadata.instanceNumber) || 0;
//         const instanceB = parseInt(b.metadata.instanceNumber) || 0;
//         if (instanceA !== instanceB) {
//           return instanceA - instanceB;
//         }
//         return a.filename.localeCompare(b.filename); // Fallback to filename sort
//       });

//       setDicomFiles(parsedFiles);
//       setTotalSlices(parsedFiles.length);
//       setCurrentSlice(0);
//       setDicomData(parsedFiles[0]); // Set the first file as current DICOM data
//       setError(
//         errorsOccurred.length > 0
//           ? `Some files failed to parse: ${errorsOccurred.join(", ")}`
//           : null
//       );
//       setWindowCenter(parseFloat(parsedFiles[0].metadata.windowCenter) || null);
//       setWindowWidth(parseFloat(parsedFiles[0].metadata.windowWidth) || null);
//       setMeasurements([]);
//     } catch (err) {
//       setError(err.message);
//       console.error("DICOM upload error:", err);
//     } finally {
//       setIsLoading(false);
//       setLoadingProgress(100); // Ensure progress is 100% even on error
//     }
//   };

//   const handleSingleFileUpload = (event) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       handleFileUpload(files);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const files = e.dataTransfer.files;
//     if (files.length > 0) {
//       handleFileUpload(files);
//     }
//   };

//   const togglePlayback = () => {
//     if (isPlaying) {
//       clearInterval(playIntervalRef.current);
//       setIsPlaying(false);
//     } else {
//       if (totalSlices <= 1) return; // No need to play if only one slice
//       playIntervalRef.current = setInterval(() => {
//         setCurrentSlice((prev) => (prev + 1) % totalSlices);
//       }, 200);
//       setIsPlaying(true);
//     }
//   };

//   const handleSliceChange = (value) => {
//     const sliceIndex = parseInt(value);
//     setCurrentSlice(sliceIndex);

//     // Update current DICOM data based on the selected slice
//     if (dicomFiles.length > 0 && dicomFiles[sliceIndex]) {
//       setDicomData(dicomFiles[sliceIndex]);
//     }
//   };

//   const handleResetDicom = () => {
//     clearInterval(playIntervalRef.current); // Stop any ongoing playback
//     setIsPlaying(false);
//     setDicomFiles([]);
//     setDicomData(null);
//     setTotalSlices(1);
//     setCurrentSlice(0);
//     setError(null);
//     setLoadingProgress(0);
//     resetView(); // Reset all view transformations
//   };

//   const getCurrentDicomInfo = () => {
//     if (!dicomData || !dicomData.metadata) {
//       return {
//         patientName: "",
//         patientID: "",
//         studyDate: "",
//         modality: "",
//         manufacturer: "",
//         institutionName: "",
//         sliceThickness: "",
//         repetitionTime: "",
//         echoTime: "",
//         magneticFieldStrength: "",
//         rows: "",
//         columns: "",
//         bitsAllocated: "",
//       };
//     }

//     const meta = dicomData.metadata;
//     return {
//       patientName: meta.patientName || "Unknown Patient",
//       patientID: meta.patientID || "....",
//       studyDate: meta.studyDate ? formatDicomDate(meta.studyDate) : "....",
//       modality: meta.modality || "....",
//       manufacturer: meta.manufacturer || "....",
//       institutionName: meta.institutionName || "....",
//       sliceThickness: meta.sliceThickness
//         ? `${parseFloat(meta.sliceThickness).toFixed(2)} mm`
//         : "....",
//       repetitionTime: meta.repetitionTime
//         ? `${parseFloat(meta.repetitionTime).toFixed(2)} ms`
//         : "....",
//       echoTime: meta.echoTime
//         ? `${parseFloat(meta.echoTime).toFixed(2)} ms`
//         : "....",
//       magneticFieldStrength: meta.magneticFieldStrength
//         ? `${parseFloat(meta.magneticFieldStrength).toFixed(1)} T`
//         : "....",
//       rows: meta.rows || "....",
//       columns: meta.columns || "....",
//       bitsAllocated: meta.bitsAllocated || "....",
//       windowCenter: windowCenter?.toFixed(2) ?? "N/A",
//       windowWidth: windowWidth?.toFixed(2) ?? "N/A",
//     };
//   };

//   const formatDicomDate = (dateStr) => {
//     if (!dateStr || dateStr.length !== 8) return dateStr;
//     return `${dateStr.substr(0, 4)}-${dateStr.substr(4, 2)}-${dateStr.substr(
//       6,
//       2
//     )}`;
//   };

//   // New mouse event handlers for pan, windowing, and measure tools
//   const handleMouseDown = (e) => {
//     if (!dicomData) return;
//     mouseInteractionRef.current.isMouseDown = true;
//     const rect = canvasRef.current.getBoundingClientRect();
//     const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
//     mouseInteractionRef.current.startPos = pos;
//     mouseInteractionRef.current.startPan = { ...panPosition };
//     if (activeTool === "measure") {
//       setIsDrawing(true);
//       setMeasurements((prev) => [...prev, { start: pos, end: pos }]);
//     }
//   };

//   const handleMouseMove = (e) => {
//     if (!mouseInteractionRef.current.isMouseDown || !dicomData) return;

//     const { startPos, startPan } = mouseInteractionRef.current;
//     const rect = canvasRef.current.getBoundingClientRect();
//     const currentPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
//     const delta = {
//       x: currentPos.x - startPos.x,
//       y: currentPos.y - startPos.y,
//     };

//     if (activeTool === "pan") {
//       setPanPosition({ x: startPan.x + delta.x, y: startPan.y + delta.y });
//     } else if (activeTool === "windowing") {
//       const newWc = (windowCenter || 2048) - delta.y * 2;
//       const newWw = Math.max(1, (windowWidth || 4096) + delta.x * 2);
//       setWindowCenter(newWc);
//       setWindowWidth(newWw);
//     } else if (activeTool === "measure" && isDrawing) {
//       setMeasurements((prev) => {
//         const newMeasurements = [...prev];
//         newMeasurements[newMeasurements.length - 1].end = currentPos;
//         return newMeasurements;
//       });
//     }
//     // Update mouse position for display
//     setMousePos({ x: Math.round(currentPos.x), y: Math.round(currentPos.y) });
//   };

//   const handleMouseUp = () => {
//     mouseInteractionRef.current.isMouseDown = false;
//     if (activeTool === "measure") {
//       setIsDrawing(false);
//     }
//   };

//   const handleWheel = (e) => {
//     e.preventDefault();
//     const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
//     setZoom((prev) => Math.max(10, Math.min(800, prev * zoomFactor)));
//   };

//   const resetView = () => {
//     setZoom(100);
//     setRotation(0);
//     setPanPosition({ x: 0, y: 0 });
//     setContrast(100);
//     setBrightness(100);
//     setMeasurements([]);
//     setInvert(false);
//     if (dicomFiles.length > 0 && dicomFiles[currentSlice]) {
//       const metadata = dicomFiles[currentSlice].metadata;
//       setWindowCenter(parseFloat(metadata.windowCenter));
//       setWindowWidth(parseFloat(metadata.windowWidth));
//     }
//   };

//     // Loading screen
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
//         <div className="text-white text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
//           <p>Loading</p>
//         </div>
//       </div>
//     );
//   }
//   // Loading screen for signing out
//   if (signingOut) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
//         <div className="text-white text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
//           <p>Exiting...</p>
//         </div>
//       </div>
//     );
//   }
//   //end auth section --snowflake


//   return (
//     <div className="ml-16 min-h-screen bg-[#08090d] text-white font-body overflow-hidden">
//       {/* Import the Google Fonts specifically inside this page or rely on global but adding here perfectly isolates it */}
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
//         .font-display { font-family: 'Cormorant Garamond', serif; }
//         .font-body { font-family: 'DM Sans', sans-serif; }
//         .cyber-scanline {
//           width: 100%;
//           height: 4px;
//           background: linear-gradient(to right, transparent, rgba(74, 144, 217, 0.8), transparent);
//           position: absolute;
//           box-shadow: 0 0 15px rgba(74, 144, 217, 0.5);
//           animation: scan 3s linear infinite;
//           opacity: 0.5;
//           pointer-events: none;
//         }
//         @keyframes scan {
//           0% { top: -10%; }
//           100% { top: 110%; }
//         }
//       `}</style>
      
//       {/* Header - now specific to chat page actions */}

//       {/* Sidebar */}
//       <Sidebar onSignOut={handleSignOut} />

//       {/* Subtle ambient background matching landing page */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-1/4 w-[800px] h-[500px] bg-[#1a2744]/20 rounded-full blur-[120px]" />
//         <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-[#0f1f3d]/20 rounded-full blur-[100px]" />
//         {/* Subtle grid overlay */}
//         <div className="absolute inset-0 opacity-[0.03]" style={{
//           backgroundImage: `linear-gradient(#4a90d9 1px, transparent 1px), linear-gradient(90deg, #4a90d9 1px, transparent 1px)`,
//           backgroundSize: '80px 80px'
//         }} />
//       </div>

//       <div className="relative z-10">
//         {/* Header */}
//         <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg p-4">
//           <div className="flex items-center justify-center max-w-7xl mx-auto">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <div>
//                   <h1 className=" text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
//                     Flake AI
//                   </h1>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="flex h-[calc(100vh-80px)]">
//           {/* Left Sidebar - Tools */}
//           <div className="w-40 bg-white/5 backdrop-blur-xl border-r border-white/10 p-4 space-y-4">
//             <div className="flex space-x-2">
//               <button
//                 onClick={resetView}
//                 className="flex-1 p-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-200"
//               >
//                 Reset
//               </button>
//             </div>

//             {/* New Tool Buttons */}
//             <div className="flex flex-col space-y-2">
//               <button
//                 title="Pan (Move)"
//                 onClick={() => setActiveTool("pan")}
//                 className={`p-3 rounded-lg border transition-all ${
//                   activeTool === "pan"
//                     ? "bg-blue-600/40 border-blue-400"
//                     : "bg-slate-800 border-slate-600"
//                 }`}
//               >
//                 {" "}
//                 <Move className="w-5 h-5 mx-auto" />{" "}
//               </button>
//               <button
//                 title="Windowing (Contrast/Brightness)"
//                 onClick={() => setActiveTool("windowing")}
//                 className={`p-3 rounded-lg border transition-all ${
//                   activeTool === "windowing"
//                     ? "bg-blue-600/40 border-blue-400"
//                     : "bg-slate-800 border-slate-600"
//                 }`}
//               >
//                 {" "}
//                 <Sun className="w-5 h-5 mx-auto" />{" "}
//               </button>
//               <button
//                 title="Measure"
//                 onClick={() => setActiveTool("measure")}
//                 className={`p-3 rounded-lg border transition-all ${
//                   activeTool === "measure"
//                     ? "bg-blue-600/40 border-blue-400"
//                     : "bg-slate-800 border-slate-600"
//                 }`}
//               >
//                 {" "}
//                 <Ruler className="w-5 h-5 mx-auto" />{" "}
//               </button>
//               <button
//                 title="Invert Colors"
//                 onClick={() => setInvert(!invert)}
//                 className={`p-3 rounded-lg border transition-all ${
//                   invert
//                     ? "bg-purple-600/40 border-purple-400"
//                     : "bg-slate-800 border-slate-600"
//                 }`}
//               >
//                 {" "}
//                 <Moon className="w-5 h-5 mx-auto" />{" "}
//               </button>
//             </div>
//           </div>

//           {/* Main Viewer */}
//           <div className="flex-1 flex flex-col">
//             {/* Viewer Controls */}
//             <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 p-2">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   {!dicomData ? (
//                     <div
//                       className={`relative border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all duration-200 ${
//                         isDragging
//                           ? "border-blue-400 bg-blue-500/10"
//                           : "border-slate-600 hover:border-blue-500"
//                       }`}
//                       onDragOver={handleDragOver}
//                       onDragLeave={handleDragLeave}
//                       onDrop={handleDrop}
//                       onClick={() => fileInputRef.current?.click()}
//                     >
//                       {isLoading ? (
//                         <div className="flex items-center space-x-2 text-blue-400">
//                           <Loader className="w-5 h-5 animate-spin" />
//                           <span>
//                             Loading...12 ({loadingProgress.toFixed(0)}%)
//                           </span>
//                         </div>
//                       ) : (
//                         <div className="flex items-center">
//                           <Upload className="w-8 h-2 text-blue-400" />
//                           <span className="text-sm">Upload</span>
//                         </div>
//                       )}
//                       <input
//                         ref={fileInputRef}
//                         type="file"
//                         accept=".dcm,.dicom,application/dicom" // Added application/dicom MIME type
//                         onChange={handleSingleFileUpload} // Corrected onChange handler
//                         className="hidden"
//                         multiple // Allow multiple file selection
//                       />
//                     </div>
//                   ) : (
//                     <div className="flex items-center space-x-2">
//                       <FileImage className="w-5 h-5 text-green-400" />
//                       <span className="text-green-300">
//                         {dicomData.filename || "DICOM Loaded"}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   {/* Slice Indicator and Playback Button */}
//                   <span className="text-sm text-slate-400">
//                     Slice {currentSlice + 1} / {totalSlices}
//                   </span>
//                   <button
//                     onClick={togglePlayback}
//                     className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200"
//                     disabled={totalSlices <= 1} // Disable playback if only one slice
//                   >
//                     {isPlaying ? (
//                       <Pause className="w-4 h-4" />
//                     ) : (
//                       <Play className="w-4 h-4" />
//                     )}
//                   </button>
//                   {/* Reset/Delete MRI Button */}
//                   {dicomData && ( // Only show if a DICOM is loaded
//                     <button
//                       onClick={handleResetDicom}
//                       className="p-2 bg-red-600/30 hover:bg-red-600/50 rounded-lg border border-red-500/30 transition-all duration-200"
//                       title="Delete Uploaded MRI"
//                     >
//                       <XCircle className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Loading/Error Messages */}

//               {error && (
//                 <div className="mt-2 text-red-400 text-sm flex items-center">
//                   <AlertCircle className="w-4 h-4 mr-2" />
//                   Error: {error}
//                 </div>
//               )}

//               {/* Slice Navigator */}
//               {dicomData && (
//                 <div className="mt-4">
//                   <input
//                     type="range"
//                     min="0"
//                     max={totalSlices > 0 ? totalSlices - 1 : 0}
//                     value={currentSlice}
//                     onChange={(e) => handleSliceChange(e.target.value)}
//                     className="custom-range-slider"
//                     disabled={totalSlices <= 1} // Disable slider if only one slice
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Image Viewer */}
//             {dicomData != null ? (
//               <div
//                 ref={viewerRef}
//                 className="flex-1 relative bg-black/40 backdrop-blur-sm shadow-inner overflow-hidden flex items-center justify-center border border-white/5"
//               >
//                 <canvas
//                   ref={canvasRef}
//                   onMouseDown={handleMouseDown}
//                   onMouseMove={handleMouseMove}
//                   onMouseUp={handleMouseUp}
//                   onMouseLeave={handleMouseUp}
//                   onWheel={handleWheel}
//                   className={`h-full w-full ${
//                     activeTool === "measure"
//                       ? "cursor-crosshair"
//                       : activeTool === "pan"
//                       ? "cursor-move"
//                       : "cursor-grab"
//                   }`}
//                 />

//                 {/* Status Bar */}
//                 <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-2xl">
//                   <div className="text-xs space-y-1">
//                     <div>
//                       Mouse: ({mousePos.x}, {mousePos.y})
//                     </div>
//                     <div>Zoom: {zoom}%</div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex-1 relative bg-transparent overflow-hidden flex items-center justify-center">
//                 <div
//                   className="relative flex items-center justify-center h-full w-full" // Use h-full w-full to fill parent div
//                 >
//                   <div>
//                     <div className="flex justify-center items-center py-10">
//                       <div className="absolute inset-0  rounded-full blur-xl opacity-50 animate-pulse"></div>
//                       <motion.div
//                         animate={{ rotate: 360 }}
//                         transition={{
//                           repeat: Infinity,
//                           duration: 8,
//                           ease: "linear",
//                         }}
//                         className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-full w-fit"
//                       >
//                         <FaSnowflake className="w-16 h-16 text-white" />
//                       </motion.div>
//                     </div>
//                     <div className="flex justify-center items-center py-5">
//                       <motion.h1
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.2 }}
//                         className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 animate-gradient"
//                       >
//                         Flake Laboratories
//                       </motion.h1>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Sidebar - DICOM Info */}
//           <div className="w-50 bg-white/5 backdrop-blur-xl border-l border-white/10 p-4 space-y-4 overflow-y-auto">
//             <h4 className="text-base font-semibold text-blue-300 flex items-center">
//               <Info className="w-5 h-5 mr-2" />
//               Meta-data
//             </h4>

//             <div className="space-y-3">
//               {Object.entries(getCurrentDicomInfo()).map(([key, value]) => {
//                 // Remove rows, columns, bitsAllocated from display based on user request
//                 if (["rows", "columns", "bitsAllocated"].includes(key)) {
//                   return null; // Do not render these items
//                 }
//                 return (
//                   <div
//                     key={key}
//                     className="bg-white/5 rounded-lg p-3 border border-white/10"
//                   >
//                     <div className="text-xs text-slate-400  uppercase tracking-wide">
//                       {key.replace(/([A-Z])/g, " $1").trim()}
//                     </div>
//                     <div className="text-sm text-blue-300">{value}</div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Quick Stats */}
//             <div className="mt-6">
//               <h4 className="text-md font-semibold text-blue-300 mb-3">
//                 Quick Stats
//               </h4>
//               <div className="grid grid-cols-2 gap-2">
//                 <div className="bg-blue-500/10 rounded-lg p-2 text-center border border-blue-500/20 backdrop-blur-md">
//                   <div className="text-lg font-bold text-blue-300">
//                     {totalSlices}
//                   </div>
//                   <div className="text-xs text-slate-400">Slices</div>
//                 </div>
//                 {/* Matrix (rows x columns) can be kept as it's a useful summary, even if individual rows/columns are removed */}
//                 <div className="bg-green-500/10 rounded-lg p-2 text-center border border-green-500/20 backdrop-blur-md">
//                   <div className="text-lg font-bold text-green-300">
//                     {dicomData?.metadata?.rows && dicomData?.metadata?.columns
//                       ? `${dicomData.metadata.rows}x${dicomData.metadata.columns}`
//                       : "N/A"}
//                   </div>
//                   <div className="text-xs text-slate-400">Matrix</div>
//                 </div>
//                 <div className="bg-purple-500/10 rounded-lg p-2 text-center border border-purple-500/20 backdrop-blur-md">
//                   <div className="text-lg font-bold text-purple-300">
//                     {dicomData?.metadata?.magneticFieldStrength
//                       ? `${parseFloat(
//                           dicomData.metadata.magneticFieldStrength
//                         ).toFixed(1)}T`
//                       : "N/A"}
//                   </div>
//                   <div className="text-xs text-slate-400">Field</div>
//                 </div>
//                 <div className="bg-cyan-500/10 rounded-lg p-2 text-center border border-cyan-500/20 backdrop-blur-md">
//                   <div className="text-lg font-bold text-cyan-300">
//                     {dicomData?.metadata?.modality || "N/A"}
//                   </div>
//                   <div className="text-xs text-slate-400">Modality</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MRIReader;
"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "../../components/SideBar";
import { supabase } from "../../lib/supabaseClient";
import { FaSnowflake } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Upload, Play, Pause, Info, AlertCircle,
  ZoomIn, ZoomOut, Move, Sun, Moon, Ruler, RotateCw, RotateCcw,
  FlipHorizontal, FlipVertical, Crosshair, Trash2, Camera,
  Grid3X3, RefreshCw, Maximize2, ChevronDown, ChevronUp, XCircle,
} from "lucide-react";

// ── Design tokens ─────────────────────────────────────────────────────────
const GOLD    = "#c8a96e";
const CHARCOAL = "#08090d";
const STEEL   = "#4a90d9";

// ── Window presets ────────────────────────────────────────────────────────
const WINDOW_PRESETS = [
  { label: "Brain",       wc: 40,   ww: 80   },
  { label: "Subdural",    wc: 75,   ww: 215  },
  { label: "Stroke",      wc: 32,   ww: 8    },
  { label: "Soft Tissue", wc: 50,   ww: 350  },
  { label: "Bone",        wc: 300,  ww: 1500 },
  { label: "Lung",        wc: -600, ww: 1500 },
  { label: "Abdomen",     wc: 60,   ww: 400  },
  { label: "Angio",       wc: 300,  ww: 600  },
];

// ── DICOM Parser ──────────────────────────────────────────────────────────
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
            dataView.getUint8(offset), dataView.getUint8(offset+1),
            dataView.getUint8(offset+2), dataView.getUint8(offset+3)
          );
        }
        offset = dicmPrefix !== "DICM" ? 0 : offset + 4;
        const dicomData = parseDicomElements(dataView, offset);
        const pixelData = extractPixelData(dataView, dicomData);
        resolve({ metadata: dicomData, pixelData, isValidDicom: true, filename: file.name, filesize: file.size });
      } catch (error) {
        reject(new Error(`DICOM parsing failed for ${file.name}: ${error.message}`));
      }
    };
    reader.onerror = () => reject(new Error(`File reading failed for ${file.name}`));
    reader.readAsArrayBuffer(file);
  });
};

const parseDicomElements = (dataView, startOffset) => {
  const elements = {};
  let offset = startOffset;
  const fileSize = dataView.byteLength;
  const importantTags = {
    "0010,0010": "patientName",  "0010,0020": "patientID",
    "0010,0030": "patientBirthDate", "0010,0040": "patientSex",
    "0008,0020": "studyDate",    "0008,0030": "studyTime",
    "0008,0060": "modality",     "0008,0070": "manufacturer",
    "0008,0080": "institutionName", "0008,1030": "studyDescription",
    "0018,0050": "sliceThickness", "0018,0080": "repetitionTime",
    "0018,0081": "echoTime",     "0018,0087": "magneticFieldStrength",
    "0020,0011": "seriesNumber", "0020,0013": "instanceNumber",
    "0020,1041": "sliceLocation","0028,0010": "rows",
    "0028,0011": "columns",      "0028,0100": "bitsAllocated",
    "0028,0103": "pixelRepresentation", "0028,1050": "windowCenter",
    "0028,1051": "windowWidth",  "0028,1052": "rescaleIntercept",
    "0028,1053": "rescaleSlope", "7FE0,0010": "pixelData",
  };
  try {
    while (offset < fileSize - 8) {
      const group   = dataView.getUint16(offset, true);
      const element = dataView.getUint16(offset + 2, true);
      const tag = `${group.toString(16).padStart(4,"0").toUpperCase()},${element.toString(16).padStart(4,"0").toUpperCase()}`;
      offset += 4;
      let vr = ""; let isExplicitVR = true;
      if (offset + 2 <= fileSize) {
        try { vr = String.fromCharCode(dataView.getUint8(offset), dataView.getUint8(offset+1)); offset += 2; }
        catch { isExplicitVR = false; }
      } else { isExplicitVR = false; }
      let length;
      if (isExplicitVR && ["OB","OW","OF","SQ","UT","UN"].includes(vr)) {
        if (offset + 6 > fileSize) break;
        offset += 2; length = dataView.getUint32(offset, true); offset += 4;
      } else if (isExplicitVR) {
        if (offset + 2 > fileSize) break;
        length = dataView.getUint16(offset, true); offset += 2;
      } else {
        if (offset + 4 > fileSize) break;
        length = dataView.getUint32(offset, true); offset += 4;
      }
      if (length === 0xffffffff) break;
      if (offset + length > fileSize) length = Math.max(0, fileSize - offset);
      if (importantTags[tag] && offset + length <= fileSize) {
        if (tag === "7FE0,0010") { elements[importantTags[tag]] = { offset, length }; }
        else {
          const bytes = new Uint8Array(dataView.buffer, offset, length);
          elements[importantTags[tag]] = new TextDecoder("utf-8").decode(bytes).replace(/\0/g,"").trim();
        }
      }
      offset += length;
    }
  } catch (error) { console.warn("DICOM parsing error:", error.message); }
  return elements;
};

const extractPixelData = (dataView, dicomData) => {
  const pixelDataInfo = dicomData.pixelData;
  if (!pixelDataInfo) return null;
  const rows = parseInt(dicomData.rows) || 512;
  const columns = parseInt(dicomData.columns) || 512;
  const bitsAllocated = parseInt(dicomData.bitsAllocated) || 16;
  const pixelRepresentation = parseInt(dicomData.pixelRepresentation) || 0;
  const { offset, length } = pixelDataInfo;
  if (offset < 0 || offset + length > dataView.byteLength) return null;
  const buf = dataView.buffer.slice(offset, offset + length);
  const imageData = bitsAllocated === 16 ? new Uint16Array(buf) : new Uint8Array(buf);
  return { data: imageData, rows, columns, bitsAllocated, pixelRepresentation, length: imageData.length };
};

// ── ToolBtn ──────────────────────────────────────────────────────────────
function ToolBtn({ icon: Icon, label, active, onClick, gold, danger, disabled }) {
  const [hov, setHov] = useState(false);
  const baseColor = gold ? GOLD : danger ? "#b05a5a" : active ? STEEL : hov ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        gap:3, padding:"8px 4px", borderRadius:2, cursor:disabled?"not-allowed":"pointer",
        background: active||gold||danger||hov
          ? gold   ? "rgba(200,169,110,0.1)"
          : danger ? "rgba(176,90,90,0.1)"
          : active ? "rgba(74,144,217,0.1)"
          :          "rgba(255,255,255,0.03)"
          : "transparent",
        border:`1px solid ${
          gold   ? active||hov ? "rgba(200,169,110,0.5)" : "rgba(200,169,110,0.25)"
          : danger? hov ? "rgba(176,90,90,0.5)" : "rgba(176,90,90,0.2)"
          : active ? "rgba(74,144,217,0.4)"
          : hov    ? "rgba(255,255,255,0.12)"
          :          "rgba(255,255,255,0.04)"
        }`,
        color: baseColor,
        transition:"all 0.18s ease",
        opacity: disabled ? 0.3 : 1,
        width:"100%",
        minHeight:44,
      }}
    >
      <Icon size={13} />
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.48rem", letterSpacing:"0.15em", textTransform:"uppercase" }}>
        {label}
      </span>
    </button>
  );
}

function GroupLabel({ children }) {
  return (
    <div style={{ padding:"8px 0 3px", display:"flex", alignItems:"center", gap:6 }}>
      <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.05)" }} />
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.48rem", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(255,255,255,0.2)", whiteSpace:"nowrap" }}>
        {children}
      </span>
      <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.05)" }} />
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div style={{ padding:"7px 12px", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.5rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.18)", marginBottom:2 }}>{label}</p>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.85rem", fontWeight:300, color:GOLD, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{value || "—"}</p>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ padding:"8px 6px", textAlign:"center", borderRadius:2, background:`${color}0a`, border:`1px solid ${color}20` }}>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", fontWeight:400, color, lineHeight:1 }}>{value}</p>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.48rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.2)", marginTop:3 }}>{label}</p>
    </div>
  );
}

function HUDItem({ label, value }) {
  return (
    <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.48rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.2)", whiteSpace:"nowrap" }}>{label}</span>
      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.85rem", fontWeight:300, color:GOLD }}>{value}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
const MRIReader = () => {
  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [signingOut, setSigningOut]   = useState(false);
  const [isDragging, setIsDragging]   = useState(false);
  const [currentSlice, setCurrentSlice] = useState(0);
  const [totalSlices, setTotalSlices] = useState(1);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [playSpeed, setPlaySpeed]     = useState(200);
  const [zoom, setZoom]               = useState(100);
  const [rotation, setRotation]       = useState(0);
  const [flipH, setFlipH]             = useState(false);
  const [flipV, setFlipV]             = useState(false);
  const [mousePos, setMousePos]       = useState({ x: 0, y: 0 });
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [dicomData, setDicomData]     = useState(null);
  const [dicomFiles, setDicomFiles]   = useState([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeTool, setActiveTool]   = useState("pan");
  const [windowCenter, setWindowCenter] = useState(null);
  const [windowWidth, setWindowWidth] = useState(null);
  const [invert, setInvert]           = useState(false);
  const [showGrid, setShowGrid]       = useState(false);
  const [showCrosshair, setShowCrosshair] = useState(false);
  const [measurements, setMeasurements] = useState([]);
  const [isDrawing, setIsDrawing]     = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const canvasRef   = useRef(null);
  const fileInputRef = useRef(null);
  const emptyFileInputRef = useRef(null);
  const playIntervalRef = useRef(null);
  const viewerRef   = useRef(null);
  const mouseRef    = useRef({ isMouseDown:false, startPos:{x:0,y:0}, startPan:{x:0,y:0} });
  const router = useRouter();

  // ── Auth ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/"); else setUser(session.user);
      setLoading(false);
    };
    check();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e,s) => {
      if (!s) router.push("/"); else setUser(s.user);
    });
    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try { await supabase.auth.signOut(); router.push("/"); }
    catch { /* silent */ } finally { setSigningOut(false); }
  };

  // ── Render ────────────────────────────────────────────────────────────
  const renderDicomImage = useCallback((pixelData, metadata) => {
    const canvas = canvasRef.current, vc = viewerRef.current;
    if (!canvas || !pixelData?.data || !vc) return;
    const ctx = canvas.getContext("2d");
    const { data, rows, columns, bitsAllocated, pixelRepresentation } = pixelData;
    const wc_ = windowCenter ?? parseFloat(metadata.windowCenter) ?? (1 << (bitsAllocated-1));
    const ww_ = windowWidth  ?? parseFloat(metadata.windowWidth)  ?? ((1 << bitsAllocated)-1);
    const ri  = parseFloat(metadata.rescaleIntercept) || 0;
    const rs  = parseFloat(metadata.rescaleSlope) || 1;
    const wMin = wc_ - ww_/2, wMax = wc_ + ww_/2;

    const imgData = new ImageData(columns, rows);
    const px = imgData.data;
    for (let i = 0; i < data.length; i++) {
      let v = data[i];
      if (pixelRepresentation===1) {
        if (bitsAllocated===16) v=(v<<16)>>16;
        else if (bitsAllocated===8) v=(v<<24)>>24;
      }
      v = v*rs+ri;
      let d = v<=wMin ? 0 : v>=wMax ? 255 : ((v-wMin)/ww_)*255;
      if (invert) d=255-d;
      const pi=i*4; px[pi]=d; px[pi+1]=d; px[pi+2]=d; px[pi+3]=255;
    }
    const ic=document.createElement("canvas"); ic.width=columns; ic.height=rows;
    ic.getContext("2d").putImageData(imgData,0,0);

    const vw=vc.clientWidth, vh=vc.clientHeight;
    const iar=columns/rows, var_=vw/vh;
    let cw,ch;
    if (iar>var_){cw=vw;ch=vw/iar;}else{ch=vh;cw=vh*iar;}
    canvas.width=vw; canvas.height=vh;
    ctx.clearRect(0,0,vw,vh);

    const dx=(vw-cw*(zoom/100))/2+panPosition.x;
    const dy=(vh-ch*(zoom/100))/2+panPosition.y;
    ctx.save();
    ctx.translate(vw/2,vh/2);
    ctx.rotate((rotation*Math.PI)/180);
    ctx.scale(flipH?-1:1, flipV?-1:1);
    ctx.translate(-vw/2,-vh/2);
    ctx.translate(dx,dy);
    ctx.scale(zoom/100,zoom/100);
    ctx.imageSmoothingEnabled=false;
    ctx.drawImage(ic,0,0,cw,ch);
    ctx.restore();

    if (showGrid) {
      ctx.save(); ctx.strokeStyle="rgba(74,144,217,0.12)"; ctx.lineWidth=1;
      for(let x=0;x<vw;x+=64){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,vh);ctx.stroke();}
      for(let y=0;y<vh;y+=64){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(vw,y);ctx.stroke();}
      ctx.restore();
    }
    if (showCrosshair) {
      ctx.save(); ctx.strokeStyle=`${GOLD}55`; ctx.lineWidth=1; ctx.setLineDash([5,7]);
      ctx.beginPath();ctx.moveTo(vw/2,0);ctx.lineTo(vw/2,vh);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,vh/2);ctx.lineTo(vw,vh/2);ctx.stroke();
      ctx.restore();
    }
    measurements.forEach(m=>{
      ctx.save(); ctx.strokeStyle=GOLD; ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(m.start.x,m.start.y);ctx.lineTo(m.end.x,m.end.y);ctx.stroke();
      ctx.fillStyle=GOLD;
      [m.start,m.end].forEach(pt=>{ctx.beginPath();ctx.arc(pt.x,pt.y,3,0,Math.PI*2);ctx.fill();});
      const dist=Math.sqrt(Math.pow(m.end.x-m.start.x,2)+Math.pow(m.end.y-m.start.y,2)).toFixed(1);
      ctx.font="11px 'DM Sans',sans-serif"; ctx.fillText(`${dist}px`,m.end.x+6,m.end.y-6);
      ctx.restore();
    });
  },[zoom,panPosition,windowCenter,windowWidth,invert,rotation,flipH,flipV,showGrid,showCrosshair,measurements]);

  const generateMockMRISlice = useCallback((sliceIndex) => {
    const canvas=canvasRef.current; if(!canvas)return;
    const ctx=canvas.getContext("2d"); const w=512,h=512;
    canvas.width=w; canvas.height=h;
    ctx.fillStyle="#000"; ctx.fillRect(0,0,w,h);
    const cx=w/2,cy=h/2,sr=totalSlices>0?sliceIndex/totalSlices:0.5;
    const br=180-Math.abs(sr-0.5)*60;
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,br);
    g.addColorStop(0,`rgba(200,200,200,${0.8-sr*0.3})`);
    g.addColorStop(0.3,`rgba(150,150,150,${0.6-sr*0.2})`);
    g.addColorStop(0.7,`rgba(100,100,100,${0.4-sr*0.1})`);
    g.addColorStop(1,"rgba(50,50,50,0.2)");
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,br,0,Math.PI*2); ctx.fill();
    if(sr>0.2&&sr<0.8){
      ctx.fillStyle=`rgba(20,20,20,${0.8-Math.abs(sr-0.5)*0.5})`;
      ctx.beginPath();ctx.ellipse(cx-30,cy-20,25,15,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(cx+30,cy-20,25,15,0,0,Math.PI*2);ctx.fill();
    }
    if(showGrid){
      ctx.strokeStyle="rgba(74,144,217,0.12)";ctx.lineWidth=1;
      for(let x=0;x<w;x+=64){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
      for(let y=0;y<h;y+=64){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    }
    if(showCrosshair){
      ctx.strokeStyle=`${GOLD}55`;ctx.lineWidth=1;ctx.setLineDash([5,7]);
      ctx.beginPath();ctx.moveTo(w/2,0);ctx.lineTo(w/2,h);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();
    }
  },[totalSlices,showGrid,showCrosshair]);

  useEffect(() => {
    if (dicomFiles.length>0&&dicomFiles[currentSlice]) {
      const f=dicomFiles[currentSlice];
      if(f.pixelData&&f.metadata) renderDicomImage(f.pixelData,f.metadata);
    } else { generateMockMRISlice(currentSlice); }
  },[currentSlice,renderDicomImage,generateMockMRISlice,dicomFiles]);

  const handleFileUpload = async (files) => {
    setIsLoading(true);setError(null);setLoadingProgress(0);setDicomFiles([]);setDicomData(null);
    try {
      const arr=Array.from(files),parsed=[],errors=[];
      for(let i=0;i<arr.length;i++){
        setLoadingProgress(Math.round(((i+1)/arr.length)*100));
        try{parsed.push(await parseDicomFile(arr[i]));}catch(e){errors.push(arr[i].name);}
      }
      if(parsed.length===0) throw new Error("No valid DICOM files parsed.");
      parsed.sort((a,b)=>{
        const ia=parseInt(a.metadata.instanceNumber)||0,ib=parseInt(b.metadata.instanceNumber)||0;
        return ia!==ib?ia-ib:a.filename.localeCompare(b.filename);
      });
      setDicomFiles(parsed);setTotalSlices(parsed.length);setCurrentSlice(0);setDicomData(parsed[0]);
      setError(errors.length>0?`Some files failed: ${errors.join(", ")}`:null);
      setWindowCenter(parseFloat(parsed[0].metadata.windowCenter)||null);
      setWindowWidth(parseFloat(parsed[0].metadata.windowWidth)||null);
      setMeasurements([]);
    } catch(err){setError(err.message);}
    finally{setIsLoading(false);setLoadingProgress(100);}
  };

  const togglePlayback = () => {
    if(isPlaying){clearInterval(playIntervalRef.current);setIsPlaying(false);}
    else{
      if(totalSlices<=1)return;
      playIntervalRef.current=setInterval(()=>setCurrentSlice(p=>(p+1)%totalSlices),playSpeed);
      setIsPlaying(true);
    }
  };

  const handleSliceChange = (v) => {
    const idx=parseInt(v);setCurrentSlice(idx);
    if(dicomFiles[idx])setDicomData(dicomFiles[idx]);
  };

  const handleResetDicom = () => {
    clearInterval(playIntervalRef.current);setIsPlaying(false);
    setDicomFiles([]);setDicomData(null);setTotalSlices(1);setCurrentSlice(0);
    setError(null);setLoadingProgress(0);resetView();
  };

  const resetView = () => {
    setZoom(100);setRotation(0);setPanPosition({x:0,y:0});
    setFlipH(false);setFlipV(false);setMeasurements([]);
    setInvert(false);setShowGrid(false);setShowCrosshair(false);
    if(dicomFiles[currentSlice]){
      const m=dicomFiles[currentSlice].metadata;
      setWindowCenter(parseFloat(m.windowCenter)||null);
      setWindowWidth(parseFloat(m.windowWidth)||null);
    }
  };

  const exportCanvas = () => {
    if(!canvasRef.current)return;
    const link=document.createElement("a");
    link.download=`mri_slice_${currentSlice+1}.png`;
    link.href=canvasRef.current.toDataURL("image/png");link.click();
  };

  const getCurrentDicomInfo = () => {
    if(!dicomData?.metadata)return{};
    const m=dicomData.metadata;
    const fmt=(s)=>s?`${s.substr(0,4)}-${s.substr(4,2)}-${s.substr(6,2)}`:null;
    return {
      "Patient":        m.patientName||null,
      "Patient ID":     m.patientID||null,
      "Study Date":     m.studyDate?fmt(m.studyDate):null,
      "Modality":       m.modality||null,
      "Institution":    m.institutionName||null,
      "Manufacturer":   m.manufacturer||null,
      "Description":    m.studyDescription||null,
      "Slice Thickness":m.sliceThickness?`${parseFloat(m.sliceThickness).toFixed(2)} mm`:null,
      "TR":             m.repetitionTime?`${parseFloat(m.repetitionTime).toFixed(0)} ms`:null,
      "TE":             m.echoTime?`${parseFloat(m.echoTime).toFixed(1)} ms`:null,
      "Field Strength": m.magneticFieldStrength?`${parseFloat(m.magneticFieldStrength).toFixed(1)} T`:null,
      "Window Center":  windowCenter?.toFixed(1)??"N/A",
      "Window Width":   windowWidth?.toFixed(1)??"N/A",
    };
  };

  const handleMouseDown = (e) => {
    mouseRef.current.isMouseDown=true;
    const rect=canvasRef.current.getBoundingClientRect();
    const pos={x:e.clientX-rect.left,y:e.clientY-rect.top};
    mouseRef.current.startPos=pos; mouseRef.current.startPan={...panPosition};
    if(activeTool==="measure"){setIsDrawing(true);setMeasurements(p=>[...p,{start:pos,end:pos}]);}
  };
  const handleMouseMove = (e) => {
    const rect=canvasRef.current?.getBoundingClientRect(); if(!rect)return;
    const cur={x:e.clientX-rect.left,y:e.clientY-rect.top};
    setMousePos({x:Math.round(cur.x),y:Math.round(cur.y)});
    if(!mouseRef.current.isMouseDown)return;
    const {startPos,startPan}=mouseRef.current;
    const delta={x:cur.x-startPos.x,y:cur.y-startPos.y};
    if(activeTool==="pan") setPanPosition({x:startPan.x+delta.x,y:startPan.y+delta.y});
    else if(activeTool==="windowing"){
      setWindowCenter(p=>(p||2048)-delta.y*2);
      setWindowWidth(p=>Math.max(1,(p||4096)+delta.x*2));
    } else if(activeTool==="measure"&&isDrawing){
      setMeasurements(p=>{const n=[...p];n[n.length-1].end=cur;return n;});
    }
  };
  const handleMouseUp = () => { mouseRef.current.isMouseDown=false; setIsDrawing(false); };
  const handleWheel = (e) => { e.preventDefault(); setZoom(p=>Math.max(10,Math.min(800,p*(e.deltaY<0?1.1:0.9)))); };

  const Spinner = ({msg}) => (
    <div style={{minHeight:"100vh",background:CHARCOAL,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:12,ease:"linear"}}>
          <FaSnowflake style={{color:GOLD,fontSize:"2rem",margin:"0 auto 16px"}}/>
        </motion.div>
        {msg&&<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.6rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)"}}>{msg}</p>}
      </div>
    </div>
  );

  if(loading)    return <Spinner/>;
  if(signingOut) return <Spinner msg="Signing out..."/>;

  const cursorMap = {pan:"move",windowing:"ns-resize",measure:"crosshair"};

  return (
    <div style={{marginLeft:64,minHeight:"100vh",background:CHARCOAL,color:"white",fontFamily:"'DM Sans',sans-serif",overflow:"hidden",display:"flex",flexDirection:"column"}}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(200,169,110,0.2);border-radius:2px;}
        input[type=range]{-webkit-appearance:none;width:100%;height:2px;background:rgba(255,255,255,0.07);border-radius:0;outline:none;cursor:pointer;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:10px;height:10px;border-radius:50%;background:${GOLD};cursor:pointer;box-shadow:0 0 6px ${GOLD}66;}
        select{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:2px;color:rgba(255,255,255,0.4);font-family:'DM Sans',sans-serif;font-size:0.6rem;padding:3px 6px;cursor:pointer;outline:none;}
      `}</style>

      <Sidebar onSignOut={handleSignOut}/>

      {/* Ambient bg */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:0}}>
        <div style={{position:"absolute",top:0,left:"30%",width:600,height:400,background:"rgba(74,144,217,0.04)",borderRadius:"50%",filter:"blur(100px)"}}/>
        <div style={{position:"absolute",bottom:0,right:0,width:500,height:300,background:"rgba(200,169,110,0.03)",borderRadius:"50%",filter:"blur(100px)"}}/>
        <div style={{position:"absolute",inset:0,opacity:0.025,backgroundImage:"radial-gradient(circle,#4a90d9 1px,transparent 1px)",backgroundSize:"48px 48px"}}/>
      </div>

      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100vh"}}>

        {/* ── Header ── */}
        <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px",borderBottom:"1px solid rgba(255,255,255,0.05)",background:"rgba(8,9,13,0.85)",backdropFilter:"blur(12px)",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:20,ease:"linear"}}>
              <FaSnowflake style={{color:GOLD,fontSize:"0.8rem"}}/>
            </motion.div>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",fontWeight:300,letterSpacing:"0.22em",color:"rgba(255,255,255,0.7)"}}>FLAKE AI</span>
            <div style={{width:1,height:12,background:"rgba(255,255,255,0.08)"}}/>
            <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.55rem",letterSpacing:"0.28em",textTransform:"uppercase",color:"rgba(255,255,255,0.22)"}}>MRI Viewer</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {dicomData&&(
              <>
                <button onClick={exportCanvas} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",border:"1px solid rgba(255,255,255,0.08)",borderRadius:2,background:"transparent",fontFamily:"'DM Sans',sans-serif",fontSize:"0.58rem",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",cursor:"pointer",transition:"all 0.2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=`${GOLD}50`;e.currentTarget.style.color=GOLD;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.color="rgba(255,255,255,0.35)";}}>
                  <Camera size={10}/> Export PNG
                </button>
                <button onClick={handleResetDicom} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",border:"1px solid rgba(176,90,90,0.3)",borderRadius:2,background:"rgba(176,90,90,0.06)",fontFamily:"'DM Sans',sans-serif",fontSize:"0.58rem",letterSpacing:"0.15em",textTransform:"uppercase",color:"#b05a5a",cursor:"pointer",transition:"all 0.2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(176,90,90,0.14)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(176,90,90,0.06)";}}>
                  <XCircle size={10}/> Clear
                </button>
              </>
            )}
          </div>
        </header>

        {/* ── Body ── */}
        <div style={{flex:1,display:"flex",overflow:"hidden"}}>

          {/* ── LEFT TOOLBAR ── */}
          <div style={{width:80,display:"flex",flexDirection:"column",padding:"8px 6px",gap:1,borderRight:"1px solid rgba(255,255,255,0.05)",overflowY:"auto",background:"rgba(255,255,255,0.008)",flexShrink:0}}>

            <GroupLabel>Navigate</GroupLabel>
            <ToolBtn icon={Move}         label="Pan"     active={activeTool==="pan"}       onClick={()=>setActiveTool("pan")}/>
            <ToolBtn icon={ZoomIn}       label="Zoom +"  onClick={()=>setZoom(p=>Math.min(800,p*1.25))}/>
            <ToolBtn icon={ZoomOut}      label="Zoom −"  onClick={()=>setZoom(p=>Math.max(10,p/1.25))}/>
            <ToolBtn icon={Maximize2}    label="Fit"     onClick={()=>{setZoom(100);setPanPosition({x:0,y:0});}}/>

            <GroupLabel>Window</GroupLabel>
            <ToolBtn icon={Sun}          label="W / L"   active={activeTool==="windowing"} onClick={()=>setActiveTool("windowing")}/>
            <ToolBtn icon={Moon}         label="Invert"  active={invert}  gold={invert}    onClick={()=>setInvert(p=>!p)}/>

            <GroupLabel>Transform</GroupLabel>
            <ToolBtn icon={RotateCw}     label="Rot CW"  onClick={()=>setRotation(p=>p+90)}/>
            <ToolBtn icon={RotateCcw}    label="Rot CCW" onClick={()=>setRotation(p=>p-90)}/>
            <ToolBtn icon={FlipHorizontal} label="Flip H" active={flipH}   onClick={()=>setFlipH(p=>!p)}/>
            <ToolBtn icon={FlipVertical}   label="Flip V" active={flipV}   onClick={()=>setFlipV(p=>!p)}/>

            <GroupLabel>Overlay</GroupLabel>
            <ToolBtn icon={Grid3X3}      label="Grid"    active={showGrid}      gold={showGrid}      onClick={()=>setShowGrid(p=>!p)}/>
            <ToolBtn icon={Crosshair}    label="X-hair"  active={showCrosshair} gold={showCrosshair} onClick={()=>setShowCrosshair(p=>!p)}/>

            <GroupLabel>Annotate</GroupLabel>
            <ToolBtn icon={Ruler}        label="Ruler"   active={activeTool==="measure"}   onClick={()=>setActiveTool("measure")}/>
            <ToolBtn icon={Trash2}       label="Clear"   danger onClick={()=>setMeasurements([])} disabled={measurements.length===0}/>

            <GroupLabel>View</GroupLabel>
            <ToolBtn icon={RefreshCw}    label="Reset"   onClick={resetView}/>
          </div>

          {/* ── CENTER ── */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

            {/* Controls strip */}
            <div style={{padding:"7px 14px",borderBottom:"1px solid rgba(255,255,255,0.05)",background:"rgba(255,255,255,0.008)",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",flexShrink:0}}>

              {/* Upload / file indicator */}
              {!dicomData?(
                <div onClick={()=>fileInputRef.current?.click()}
                  onDragOver={e=>{e.preventDefault();setIsDragging(true);}}
                  onDragLeave={e=>{e.preventDefault();setIsDragging(false);}}
                  onDrop={e=>{e.preventDefault();setIsDragging(false);handleFileUpload(e.dataTransfer.files);}}
                  style={{display:"flex",alignItems:"center",gap:7,padding:"6px 12px",border:`1px dashed ${isDragging?GOLD:"rgba(255,255,255,0.1)"}`,borderRadius:2,cursor:"pointer",background:isDragging?`${GOLD}08`:"transparent",transition:"all 0.2s"}}>
                  {isLoading
                    ?<><div style={{width:10,height:10,borderRadius:"50%",border:`1px solid ${STEEL}`,borderTopColor:"transparent",animation:"spin 0.7s linear infinite"}}/><span style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.6rem",letterSpacing:"0.1em",color:STEEL}}>Loading {loadingProgress.toFixed(0)}%</span></>
                    :<><Upload size={11} color={GOLD}/><span style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.6rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)"}}>Upload DICOM</span></>
                  }
                  <input ref={fileInputRef} type="file" accept=".dcm,.dicom,application/dicom" onChange={e=>handleFileUpload(e.target.files)} style={{display:"none"}} multiple/>
                </div>
              ):(
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"#5a9e8a",boxShadow:"0 0 5px #5a9e8a"}}/>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.6rem",letterSpacing:"0.1em",color:"rgba(255,255,255,0.35)",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dicomData.filename}</span>
                </div>
              )}

              <div style={{width:1,height:16,background:"rgba(255,255,255,0.06)"}}/>

              {/* Slice + playback */}
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.55rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.22)",whiteSpace:"nowrap"}}>
                  Slice {currentSlice+1} / {totalSlices}
                </span>
                <button onClick={togglePlayback} disabled={totalSlices<=1} style={{display:"flex",alignItems:"center",justifyContent:"center",width:24,height:24,borderRadius:2,background:isPlaying?`${GOLD}18`:"rgba(255,255,255,0.05)",border:`1px solid ${isPlaying?`${GOLD}45`:"rgba(255,255,255,0.08)"}`,cursor:totalSlices<=1?"not-allowed":"pointer",color:isPlaying?GOLD:"rgba(255,255,255,0.4)",opacity:totalSlices<=1?0.3:1,transition:"all 0.2s"}}>
                  {isPlaying?<Pause size={10}/>:<Play size={10}/>}
                </button>
                <select value={playSpeed} onChange={e=>{
                  const v=Number(e.target.value);setPlaySpeed(v);
                  if(isPlaying){clearInterval(playIntervalRef.current);playIntervalRef.current=setInterval(()=>setCurrentSlice(p=>(p+1)%totalSlices),v);}
                }}>
                  <option value={500}>Slow</option>
                  <option value={200}>Normal</option>
                  <option value={80}>Fast</option>
                  <option value={30}>Cine</option>
                </select>
              </div>

              <div style={{width:1,height:16,background:"rgba(255,255,255,0.06)"}}/>

              {/* Window presets */}
              <div style={{position:"relative"}}>
                <button onClick={()=>setShowPresets(p=>!p)} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",border:`1px solid ${showPresets?`${GOLD}35`:"rgba(255,255,255,0.08)"}`,borderRadius:2,background:showPresets?`${GOLD}08`:"transparent",fontFamily:"'DM Sans',sans-serif",fontSize:"0.58rem",letterSpacing:"0.14em",textTransform:"uppercase",color:showPresets?GOLD:"rgba(255,255,255,0.3)",cursor:"pointer",transition:"all 0.2s"}}>
                  Presets {showPresets?<ChevronUp size={9}/>:<ChevronDown size={9}/>}
                </button>
                <AnimatePresence>
                  {showPresets&&(
                    <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}
                      style={{position:"absolute",top:"calc(100% + 4px)",left:0,zIndex:50,background:"#0d1117",border:"1px solid rgba(255,255,255,0.08)",borderRadius:2,padding:6,display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,minWidth:180}}>
                      {WINDOW_PRESETS.map(p=>(
                        <button key={p.label} onClick={()=>{setWindowCenter(p.wc);setWindowWidth(p.ww);setShowPresets(false);}} style={{padding:"5px 8px",borderRadius:2,cursor:"pointer",background:"transparent",border:"1px solid rgba(255,255,255,0.06)",fontFamily:"'DM Sans',sans-serif",fontSize:"0.58rem",letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",transition:"all 0.18s",whiteSpace:"nowrap",textAlign:"left"}}
                          onMouseEnter={e=>{e.currentTarget.style.borderColor=`${GOLD}50`;e.currentTarget.style.color=GOLD;}}
                          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";e.currentTarget.style.color="rgba(255,255,255,0.35)";}}>
                          {p.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: zoom + rotation readout */}
              <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
                {rotation!==0&&<span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.85rem",fontWeight:300,color:GOLD}}>{rotation}°</span>}
                <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.58rem",letterSpacing:"0.18em",color:"rgba(255,255,255,0.2)"}}>{zoom.toFixed(0)}%</span>
              </div>
            </div>

            {/* Slice slider */}
            {dicomData&&(
              <div style={{padding:"5px 14px",borderBottom:"1px solid rgba(255,255,255,0.04)",flexShrink:0}}>
                <input type="range" min="0" max={totalSlices-1} value={currentSlice} onChange={e=>handleSliceChange(e.target.value)} disabled={totalSlices<=1}/>
              </div>
            )}

            {/* Error */}
            {error&&(
              <div style={{padding:"6px 14px",display:"flex",alignItems:"center",gap:6,background:"rgba(176,90,90,0.07)",borderBottom:"1px solid rgba(176,90,90,0.18)",flexShrink:0}}>
                <AlertCircle size={11} color="#b05a5a"/>
                <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.6rem",color:"#b05a5a"}}>{error}</span>
              </div>
            )}

            {/* Canvas or empty state */}
            {dicomData?(
              <div ref={viewerRef} style={{flex:1,position:"relative",background:"#000",overflow:"hidden"}}>
                <canvas ref={canvasRef}
                  onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel}
                  style={{width:"100%",height:"100%",display:"block",cursor:cursorMap[activeTool]||"default"}}/>

                {/* HUD bottom-left */}
                <div style={{position:"absolute",bottom:14,left:14,background:"rgba(8,9,13,0.8)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:2,padding:"8px 12px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 16px"}}>
                  <HUDItem label="X,Y" value={`${mousePos.x},${mousePos.y}`}/>
                  <HUDItem label="Zoom" value={`${zoom.toFixed(0)}%`}/>
                  <HUDItem label="W/C" value={windowCenter?.toFixed(0)??"N/A"}/>
                  <HUDItem label="W/W" value={windowWidth?.toFixed(0)??"N/A"}/>
                </div>

                {/* Active tool badge top-left */}
                <div style={{position:"absolute",top:12,left:12,padding:"3px 9px",borderRadius:2,background:`${STEEL}18`,border:`1px solid ${STEEL}30`,fontFamily:"'DM Sans',sans-serif",fontSize:"0.5rem",letterSpacing:"0.22em",textTransform:"uppercase",color:STEEL}}>
                  {activeTool}
                </div>

                {/* Measurement count top-right */}
                {measurements.length>0&&(
                  <div style={{position:"absolute",top:12,right:12,padding:"3px 9px",borderRadius:2,background:`${GOLD}12`,border:`1px solid ${GOLD}30`,fontFamily:"'DM Sans',sans-serif",fontSize:"0.5rem",letterSpacing:"0.22em",textTransform:"uppercase",color:GOLD}}>
                    {measurements.length} ruler{measurements.length>1?"s":""}
                  </div>
                )}
              </div>
            ):(
              <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:18}}>
                <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:18,ease:"linear"}}
                  style={{padding:18,border:`1px solid ${GOLD}28`,borderRadius:"50%",background:`${GOLD}05`,boxShadow:`0 0 30px ${GOLD}12`}}>
                  <FaSnowflake style={{color:GOLD,fontSize:"2.2rem"}}/>
                </motion.div>
                <div style={{textAlign:"center"}}>
                  <motion.p initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
                    style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,color:"rgba(255,255,255,0.55)",letterSpacing:"0.04em"}}>
                    Flake Laboratories
                  </motion.p>
                  <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}
                    style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.58rem",letterSpacing:"0.28em",textTransform:"uppercase",color:"rgba(255,255,255,0.14)",marginTop:8}}>
                    Upload a DICOM file to begin
                  </motion.p>
                </div>
                <motion.button initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
                  onClick={()=>emptyFileInputRef.current?.click()}
                  style={{display:"flex",alignItems:"center",gap:7,padding:"9px 22px",border:`1px solid ${GOLD}32`,borderRadius:2,background:`${GOLD}08`,color:GOLD,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"0.6rem",letterSpacing:"0.2em",textTransform:"uppercase",transition:"all 0.25s"}}
                  whileHover={{scale:1.02}} whileTap={{scale:0.97}}>
                  <Upload size={12}/> Upload DICOM
                </motion.button>
                <input ref={emptyFileInputRef} type="file" accept=".dcm,.dicom,application/dicom" onChange={e=>handleFileUpload(e.target.files)} style={{display:"none"}} multiple/>
              </div>
            )}
          </div>

          {/* ── RIGHT METADATA PANEL ── */}
          <div style={{width:210,display:"flex",flexDirection:"column",borderLeft:"1px solid rgba(255,255,255,0.05)",background:"rgba(255,255,255,0.008)",overflowY:"auto",flexShrink:0}}>
            <div style={{padding:"10px 12px",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:6}}>
              <Info size={10} color={GOLD}/>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.55rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(255,255,255,0.22)"}}>Metadata</span>
            </div>

            {dicomData
              ? Object.entries(getCurrentDicomInfo()).map(([k,v])=><MetaRow key={k} label={k} value={v}/>)
              : <div style={{padding:"24px 12px",textAlign:"center"}}><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.56rem",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.1)"}}>No file loaded</p></div>
            }

            {/* Quick Stats */}
            <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",padding:"10px 8px",marginTop:"auto"}}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.5rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(255,255,255,0.16)",marginBottom:7}}>Quick Stats</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                <StatCard label="Slices"   value={totalSlices} color={STEEL}/>
                <StatCard label="Matrix"   value={dicomData?.metadata?.rows&&dicomData?.metadata?.columns?`${dicomData.metadata.rows}×${dicomData.metadata.columns}`:"—"} color="#5a9e8a"/>
                <StatCard label="Field"    value={dicomData?.metadata?.magneticFieldStrength?`${parseFloat(dicomData.metadata.magneticFieldStrength).toFixed(1)}T`:"—"} color={GOLD}/>
                <StatCard label="Modality" value={dicomData?.metadata?.modality||"—"} color="#9e7a9e"/>
              </div>

              {/* Measurement list */}
              {measurements.length>0&&(
                <div style={{marginTop:10,borderTop:"1px solid rgba(255,255,255,0.04)",paddingTop:9}}>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.5rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(255,255,255,0.16)",marginBottom:6}}>Rulers</p>
                  {measurements.map((m,i)=>{
                    const d=Math.sqrt(Math.pow(m.end.x-m.start.x,2)+Math.pow(m.end.y-m.start.y,2)).toFixed(1);
                    return(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3,padding:"3px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.55rem",color:"rgba(255,255,255,0.25)"}}>#{i+1}</span>
                        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.85rem",fontWeight:300,color:GOLD}}>{d} px</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <style jsx>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
};

export default MRIReader;
