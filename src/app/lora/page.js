"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { FaSnowflake } from "react-icons/fa";
import Sidebar from "../../components/SideBar";

import {
  ChevronDown,
  Brain,
  Zap,
  Download,
  Settings,
  Play,
  Pause,
} from "lucide-react";

export default function ParkinsonsMRITool() {
  const [selectedStage, setSelectedStage] = useState("early");
  const [selectedView, setSelectedView] = useState("axial");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const router = useRouter();
  const [messages, setMessages] = useState([]);

  // New state variables for API URL, guidance scale, and inference steps
  const [apiUrl, setApiUrl] = useState(
    "https://amaro2a-flakeai.hf.space/generate-image"
  );
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [numSteps, setNumSteps] = useState(1);
  const [user, setUser] = useState(null);
  const [signingOut, setSigningOut] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/"); // not logged in → redirect to root
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("User signed out successfully");
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900  to-blue-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading</p>
        </div>
      </div>
    );
  }

    // Loading screen for signing out
  if (signingOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-1000 via-blue to-blue-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Exiting...</p>
        </div>
      </div>
    );
  }

  // Guard: If no user, nothing should render (router already redirected)
  if (!user) return null;
  const diseaseStages = {
    healthy: {
      label: "Healthy Control",
      description: "Normal brain structure with intact substantia nigra",
      color: "#22c55e",
    },
    early: {
      label: "Early Stage PD",
      description: "Mild dopaminergic neuron loss, subtle structural changes",
      color: "#f59e0b",
    },
    moderate: {
      label: "Moderate Stage PD",
      description: "Moderate substantia nigra degeneration, visible atrophy",
      color: "#f97316",
    },
    advanced: {
      label: "Advanced Stage PD",
      description: "Severe neurodegeneration, significant structural changes",
      color: "#dc2626",
    },
  };

  const viewTypes = {
    axial: "Axial [ Horizontal ]",
    sagittal: "Sagittal [ Side ]",
    coronal: "Coronal [ Frontal ]",
    dti: "DTI [ Diffusion Tensor ]",
    fmri: "fMRI [ Functional ]",
  };

  // Formula for calculating temporal progression metrics
  const calculateProgressionMetrics = (stage) => {
    const baseMetrics = {
      substantiaNigraIntensity: 95, // Percentage (healthy baseline)
      brainVolume: 1400, // cm³ (healthy baseline)
      asymmetryIndex: 2, // Low asymmetry in healthy brain
      confidenceScore: 95, // High confidence for healthy brain
    };

    // Progression factors for each stage (simulating disease progression)
    const progressionFactors = {
      healthy: { sn: 1, bv: 1, ai: 1, cs: 1 },
      early: { sn: 0.85, bv: 0.95, ai: 1.5, cs: 0.9 },
      moderate: { sn: 0.65, bv: 0.85, ai: 2.5, cs: 0.85 },
      advanced: { sn: 0.45, bv: 0.75, ai: 4, cs: 0.8 },
    };

    const factor = progressionFactors[stage];
    return {
      substantiaNigraIntensity:
        baseMetrics.substantiaNigraIntensity * factor.sn +
        (Math.random() * 5 - 2.5), // ±2.5% noise
      brainVolume:
        baseMetrics.brainVolume * factor.bv + (Math.random() * 20 - 10), // ±10 cm³ noise
      asymmetryIndex:
        baseMetrics.asymmetryIndex * factor.ai + (Math.random() * 0.5 - 0.25), // ±0.25 noise
      confidenceScore:
        baseMetrics.confidenceScore * factor.cs + (Math.random() * 5 - 2.5), // ±2.5% noise
    };
  };

  // Function to generate MRI image by calling the FastAPI backend
  const generateMRIImage = async () => {
    setIsGenerating(true);

    const prompt =
      customPrompt ||
      `${selectedStage} parkinson disease brain MRI ${selectedView} view, medical imaging, high resolution, clinical quality`;

    // Make API call to FastAPI endpoint
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          num_steps: numSteps,
          guidance_scale: guidanceScale,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      // Get the image as a blob and create a URL for it
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setGeneratedImage(imageUrl);

      // Calculate analysis metrics based on the selected stage
      const analysis = calculateProgressionMetrics(selectedStage);
      setAnalysisResults(analysis);
    } catch (error) {
      console.error("Error generating MRI image:", error);
      setGeneratedImage(null);
      setAnalysisResults(null);
      alert("Failed to generate MRI image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to animate disease progression
  const startAnimation = () => {
    setAnimationPlaying(true);
    const stages = ["healthy", "early", "moderate", "advanced"];
    let currentIndex = 0;

    const interval = setInterval(async () => {
      setSelectedStage(stages[currentIndex]);
      await generateMRIImage();
      currentIndex = (currentIndex + 1) % stages.length;
    }, 5000); // Increased interval to account for API call latency

    setTimeout(() => {
      clearInterval(interval);
      setAnimationPlaying(false);
    }, 20000); // 4 stages * 5 seconds each
  };

  // Cleanup image URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (generatedImage) {
        URL.revokeObjectURL(generatedImage);
      }
    };
  }, [generatedImage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Sidebar */}
      <Sidebar onSignOut={handleSignOut} />
      <Head>
        <title>Flake laboratories</title>
        <meta
          name="description"
          content="AI-powered MRI visualization for Parkinson's disease research and education"
        />
      </Head>

      {/* Header */}
      <div className="flex  items-center justify-center bg-black/20 backdrop-blur-sm border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <div className="flex items-center justify-center ">
                  <FaSnowflake className="w-8 h-8 text-white relative z-10" />
                </div>

                <h1 className="flex items-center justify-center text-2xl font-bold text-white">
                  Flake AI
                </h1>
                <p className="text-blue-300 text-sm">
                  Parkinson&apos;s Disease Visualization Tool
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Generation Controls
            </h2>

            {/* API URL Input */}
            <div className="space-y-4 mb-6">
              <label className="text-blue-300 font-medium">API URL</label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="Enter API URL"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400"
              />
            </div>

            {/* Disease Stage Selection */}
            <div className="space-y-4 mb-6">
              <label className="text-blue-300 font-medium">Disease Stage</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(diseaseStages).map(([key, stage]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedStage(key)}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedStage === key
                        ? "border-blue-400 bg-blue-500/20 text-white"
                        : "border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="text-sm font-medium">{stage.label}</div>
                    <div
                      className="w-full h-1 rounded mt-2"
                      style={{ backgroundColor: stage.color }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* View Type Selection */}
            <div className="space-y-4 mb-6">
              <label className="text-blue-300 font-medium py-5 jsutify-center align-center">
                Anatomical descriptors
              </label>
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400"
              >
                {Object.entries(viewTypes).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Prompt */}
            <div className="space-y-4 mb-6">
              <label className="text-blue-300 font-medium">
                Custom Prompt (Optional)
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Add specific details for generation..."
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-400 resize-none"
                rows={3}
              />
            </div>

            {/* Guidance Scale and Inference Steps */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-blue-300 font-medium">
                  Guidance Scale: {guidanceScale}
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={guidanceScale}
                  onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-blue-300 font-medium">
                  Inference Steps: {numSteps}
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={numSteps}
                  onChange={(e) => setNumSteps(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={generateMRIImage}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate MRI
                  </>
                )}
              </button>

              <button
                onClick={startAnimation}
                disabled={animationPlaying}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center"
              >
                {animationPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Playing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Disease Progression
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Image Display */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Generated MRI</h2>
              {generatedImage && (
                <a href={generatedImage} download="mri-image.png">
                  <button className="text-blue-400 hover:text-blue-300 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </a>
              )}
            </div>

            <div className="aspect-square bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden">
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated MRI"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Generated MRI will appear here</p>
                  <p className="text-sm mt-2">
                    Configure settings and click Generate
                  </p>
                </div>
              )}
            </div>

            {/* Current Stage Info */}
            {generatedImage && (
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">
                    {diseaseStages[selectedStage].label}
                  </h3>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: diseaseStages[selectedStage].color,
                    }}
                  />
                </div>
                <p className="text-gray-300 text-sm">
                  {diseaseStages[selectedStage].description}
                </p>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
            <h2 className="text-xl font-bold text-white mb-6">AI Analysis</h2>

            {analysisResults ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-300">
                        Substantia Nigra Intensity
                      </span>
                      <span className="text-white">
                        {analysisResults.substantiaNigraIntensity.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${analysisResults.substantiaNigraIntensity}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-300">Brain Volume</span>
                      <span className="text-white">
                        {analysisResults.brainVolume.toFixed(0)} cm³
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            ((analysisResults.brainVolume - 1200) / 200) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-300">Asymmetry Index</span>
                      <span className="text-white">
                        {analysisResults.asymmetryIndex.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${analysisResults.asymmetryIndex * 10}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-300">Confidence Score</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-bold">
                        {analysisResults.confidenceScore.toFixed(1)}%
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          analysisResults.confidenceScore > 90
                            ? "bg-green-500"
                            : analysisResults.confidenceScore > 75
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                  <ChevronDown className="w-8 h-8" />
                </div>
                <p>Analysis results will appear here</p>
                <p className="text-sm mt-2">
                  Generate an MRI to start analysis
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Educational Info */}
        <div className="mt-8 bg-black/30 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
          <h2 className="text-xl font-bold text-white mb-4">About This Tool</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div>
              <h3 className="font-medium text-blue-300 mb-2">AI Model</h3>
              <p className="text-gray-300">
                Stable Diffusion with custom LoRA adapter trained on
                Parkinson&apos;s MRI datasets
              </p>
            </div>
            <div>
              <h3 className="font-medium text-blue-300 mb-2">Applications</h3>
              <p className="text-gray-300">
                Medical education, research visualization, and synthetic data
                generation
              </p>
            </div>
            <div>
              <h3 className="font-medium text-blue-300 mb-2">Disease Stages</h3>
              <p className="text-gray-300">
                Visualizes progression from healthy brain to advanced
                Parkinson&apos;s disease
              </p>
            </div>
            <div>
              <h3 className="font-medium text-blue-300 mb-2">Disclaimer</h3>
              <p className="text-gray-300">
                For research and educational purposes only. Not for clinical
                diagnosis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
