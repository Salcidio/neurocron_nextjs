"use client";
import InputForm from "./input-form";
import Results from "./results";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Brain, Zap, MessageCircle } from "lucide-react";
import {
  FaSnowflake,
  FaRobot,
  FaChartLine,
  FaMicroscope,
  FaRegLightbulb,
  FaPen,
  FaStethoscope,
  FaFileUpload,
  FaChartBar,
  FaCheckCircle,
  FaRedoAlt,
  FaFileAlt,
} from "react-icons/fa";
import { GiArtificialHive } from "react-icons/gi";
import { supabase } from "../../lib/supabaseClient";
import Sidebar from "../../components/SideBar";

export default function ParkinsonPredictor() {
  const [prediction, setPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // auth section --snowflake
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

  const handlePrediction = (data) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setPrediction(data);
      setIsAnalyzing(false);
    }, 2000);
  };

    // Loading screen
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
  //end auth section --snowflake

  return (
    <div className="pl-10 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar onSignOut={handleSignOut} />

      {/* Background Visual Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>

        {/* Enhanced Floating Elements */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            {i % 5 === 0 && (
              <Sparkles className="w-3 h-3 text-purple-400 opacity-60" />
            )}
            {i % 5 === 1 && (
              <Zap className="w-3 h-3 text-yellow-400 opacity-60" />
            )}
            {i % 5 === 2 && (
              <Brain className="w-3 h-3 text-blue-400 opacity-60" />
            )}
            {i % 5 === 3 && (
              <MessageCircle className="w-3 h-3 text-pink-400 opacity-60" />
            )}
            {i % 5 === 4 && (
              <FaSnowflake className="w-3 h-3 text-cyan-400 opacity-60" />
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl 
                          hover:shadow-blue-glow/20 transition-all duration-500 animate-float mb-8"
          >
            <div className="flex justify-center items-center py-5">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-full"
              >
                <FaSnowflake className="w-16 h-16 text-white" />
              </motion.div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-2 w-34 bg-gradient-to-r from-blue-500 to-transparent rounded-full" />
              <div className="text-lg text-blue-300">Flake Laboratories.</div>
              <div className="h-2 w-34 bg-gradient-to-l from-pink-500 to-transparent rounded-full" />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              {
                icon: <FaRobot />,
                text: "AI-Powered Analysis",
                color: "bg-blue-500/20 border-blue-500/30",
              },
              {
                icon: <FaChartLine />,
                text: "Multi-Year Projections",
                color: "bg-purple-500/20 border-purple-500/30",
              },
              {
                icon: <FaMicroscope />,
                text: "Clinical context Data",
                color: "bg-pink-500/20 border-pink-500/30",
              },
              {
                icon: <FaRegLightbulb />,
                text: "Research level insights",
                color: "bg-green-500/20 border-green-500/30",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`${feature.color} backdrop-blur-xl rounded px-6 py-3 border 
                                        hover:scale-110 transition-all duration-300 cursor-normal 
                                        hover:shadow-lg hover:shadow-blue-glow/20`}
              >
                <div className="flex items-center gap-2 text-white font-medium">
                  {feature.icon}
                  {feature.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {!prediction && !isAnalyzing && (
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      {
                        title: "Basic Info",
                        desc: "Enter patient ID and assessment date",
                        icon: <FaPen />,
                      },
                      {
                        title: "Clinical Data",
                        desc: "Input UPDRS scores and DaTscan results",
                        icon: <FaStethoscope />,
                      },
                      {
                        title: "Upload CSV",
                        desc: "Or upload batch data for analysis",
                        icon: <FaFileUpload />,
                      },
                      {
                        title: "Get Results",
                        desc: "View predictions and recommendations",
                        icon: <FaChartBar />,
                      },
                    ].map((feature, i) => (
                      <div
                        key={i}
                        className="text-center group hover:scale-105 transition-transform duration-300"
                      >
                        <div className="bg-blue-pink-gradient w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-lg shadow-lg group-hover:shadow-blue-glow/50 transition-all duration-300">
                          {feature.icon}
                        </div>
                        <h4 className="text-white font-semibold mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-white/70 text-sm">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </h3>
              </div>
              <InputForm onSubmit={handlePrediction} />
            </div>
          )}

          {isAnalyzing && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl text-center">
                <div className="relative mb-8">
                  <div className="w-32 h-32 border-4 border-white/20 border-t-blue-400 rounded-full animate-spin mx-auto mb-6" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-pink-gradient rounded-full animate-pulse opacity-60" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl animate-bounce text-white">
                    <GiArtificialHive />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Analyzing Patient Data
                </h3>
                <p className="text-white/70 mb-6">
                  Our AI is processing your inputs and generating personalized
                  progression insights...
                </p>
                <div className="space-y-3">
                  {[
                    "Processing clinical parameters",
                    "Running progression models",
                    "Calculating confidence intervals",
                    "Generating recommendations",
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-white/80 animate-pulse"
                      style={{ animationDelay: `${i * 500}ms` }}
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {prediction && !isAnalyzing && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="bg-green-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 inline-block">
                  <div className="flex items-center gap-3 text-green-200">
                    <FaCheckCircle className="text-2xl animate-bounce" />
                    <span className="text-xl font-semibold">
                      Analysis Complete!
                    </span>
                    <FaCheckCircle className="text-2xl animate-bounce" />
                  </div>
                </div>
              </div>

              <Results prediction={prediction} />

              <div className="flex justify-center gap-4 pt-8">
                <button
                  onClick={() => {
                    setPrediction(null);
                    setIsAnalyzing(false);
                  }}
                  className="group px-8 py-4 bg-white/10 backdrop-blur-xl text-white font-semibold rounded-2xl 
                             border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 
                             flex items-center gap-3"
                >
                  <FaRedoAlt className="text-xl" />
                  New Analysis
                </button>
                <button
                  onClick={() => window.print()}
                  className="group px-8 py-4 bg-blue-pink-gradient text-white font-semibold rounded-2xl 
                             hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-glow/50 
                             flex items-center gap-3"
                >
                  <FaFileAlt className="text-xl" />
                  Export Report
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <p className="text-white/60 text-sm">
              © 2025 SnowFlake Research Laboratory • Advanced Healthcare
              Analytics •
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
