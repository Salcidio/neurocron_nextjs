"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Brain, Zap, MessageCircle } from "lucide-react";
import { FaSnowflake, FaDocker } from "react-icons/fa";
import { SiHuggingface } from "react-icons/si";
import { TbBrandSupabase } from "react-icons/tb";
import { FaReact } from "react-icons/fa6";
import Link from "next/link";
import VoiceCommand from "@/components/VoiceCommand";

export default function Home() {
  const [session, setSession] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  useEffect(() => {

    setIsClient(true);
  }, []);

  /*
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        router.push("/chat");
      }
    };
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        router.push("/chat");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);*/

  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Redirecting to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-float"></div>

        {/* Floating Elements */}
        {isClient &&
          [...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {i % 4 === 0 && <Sparkles className="w-4 h-4 text-purple-400" />}
              {i % 4 === 1 && <Zap className="w-4 h-4 text-yellow-400" />}
              {i % 4 === 2 && <Brain className="w-4 h-4 text-blue-400" />}
              {i % 4 === 3 && (
                <MessageCircle className="w-4 h-4 text-pink-400" />
              )}
            </motion.div>
          ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <VoiceCommand />

          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative inline-block mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
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
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 animate-gradient"
            >
              Flake ai{" "}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto"
            >
              Experience the future of AI conversation with our stunning Flake
              ai realm. Powered by Hugging Face models, secured by Supabase, and
              enhanced by Salcidio.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4  mb-12"
            >
              {[
                { icon: FaDocker, text: "Docker", color: "blue" },
                { icon: SiHuggingface, text: "HuggingFace", color: "yellow" },
                {
                  icon: TbBrandSupabase,
                  text: "Supabase",
                  color: "green",
                },
                { icon: FaReact, text: "React", color: "blue" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
                  }} // Add this line for hover animation
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 cursor-pointer"
                >
                  <feature.icon
                    className={`w-5 h-5 text-${feature.color}-400`}
                  />
                  <span className="text-white font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <Link
              href="/auth"
              className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explore
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
