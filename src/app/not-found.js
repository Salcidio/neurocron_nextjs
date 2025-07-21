"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import VoiceCommand from "@/components/VoiceCommand";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <VoiceCommand />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8"
      >
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h1 className="text-6xl font-bold text-white mb-4">Flake ai</h1>

        <p className="text-xl text-purple-200 mb-8">
          Oops! The page you&#39;re looking for doesn&#39;t exist.
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
        >
          Go Back
        </button>
      </motion.div>
    </div>
  );
}
