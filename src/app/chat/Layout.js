 "use client";
import { useState, useEffect } from "react";
import { supabase } from "../app/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Plus,
  Settings,
  LogOut,
  User,
  Sparkles,
  Brain,
  Zap,
} from "lucide-react";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        loadConversations();
      }
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          loadConversations();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });

    if (data) {
      setConversations(data);
    }
  };

  const createNewConversation = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .insert([
        {
          user_id: user.id,
          title: `New Chat ${new Date().toLocaleDateString()}`,
        },
      ])
      .select()
      .single();

    if (data) {
      setConversations([data, ...conversations]);
      setCurrentConversation(data);
      router.push(`/chat/${data.id}`);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-float"></div>

        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* AI Brain Logo Background */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          className="opacity-5"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <Brain size={400} className="text-white" />
        </motion.div>
      </div>

      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -280 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-80 bg-white/5 backdrop-blur-xl border-r border-white/10 shadow-2xl"
        >
          <div className="p-6 border-b border-white/10">
            <motion.div
              className="flex items-center space-x-3 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <Sparkles className="w-8 h-8 text-purple-400" />
                <motion.div
                  className="absolute inset-0 bg-purple-400 rounded-full blur-md opacity-50"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Chat Glass
              </h1>
            </motion.div>

            <motion.button
              onClick={createNewConversation}
              className="w-full flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/20 rounded-xl transition-all duration-200 backdrop-blur-sm group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
              <span className="text-purple-100 font-medium">New Chat</span>
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.map((conv, index) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 backdrop-blur-sm ${
                  currentConversation?.id === conv.id
                    ? "bg-white/20 border border-white/30"
                    : "bg-white/5 hover:bg-white/10 border border-transparent"
                }`}
                onClick={() => {
                  setCurrentConversation(conv);
                  router.push(`/chat/${conv.id}`);
                }}
              >
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-100 truncate">
                    {conv.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-100 font-medium">
                  {user?.email || "User"}
                </p>
                <p className="text-xs text-purple-300">Online</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <motion.button
                className="flex-1 flex items-center justify-center px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-4 h-4 text-purple-400" />
              </motion.button>
              <motion.button
                onClick={signOut}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/20 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4 text-red-400" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-xl border-b border-white/10"
          >
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MessageCircle className="w-5 h-5 text-purple-400" />
              </motion.button>
              <h2 className="text-xl font-semibold text-white">
                {currentConversation?.title || "Welcome to AI Chat"}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300">AI Online</span>
              </div>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
          </motion.div>

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}
