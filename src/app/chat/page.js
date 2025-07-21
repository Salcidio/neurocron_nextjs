"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowUp,
  Bot,
  User,
  Brain,
  Sparkles,
  MessageCircle,
  Zap,
  Home,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { FaSnowflake } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check authentication and initialize
  useEffect(() => {
    let isMounted = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/");
      } else if (isMounted) {
        setUser(user);
        if (messages.length === 0) {
          const welcomeMessage = {
            id: 1,
            type: "bot",
            content: "Hello! I'm your AI assistant. How can I help you today?",
            timestamp: new Date(),
          };
          setMessages([welcomeMessage]);
        }
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (!session?.user) {
          router.replace("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [router, messages.length]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Hide welcome screen when user sends first message
    setShowWelcome(false);

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Replace with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content: `Thanks for your message: "${userMessage.content}". This is a demo response. Replace this with your actual API integration.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: messages.length + 2,
        type: "bot",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: "bot",
        content: "Hello! I'm your AI assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    setShowWelcome(true);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Redirect to the home page after successful sign-out
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-teal-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-teal-900/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}

      {/* AI Brain Logo Background (only on welcome screen) */}
      {showWelcome && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 30,
              ease: "linear",
            }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-full w-fit"
          >
            <FaSnowflake size={600} className="text-white animate-pulse" />
          </motion.div>
        </div>
      )}

      {/* Header - now full width */}
      <header className="relative z-20 w-full border-b border-green-500/30 bg-black/50 backdrop-blur-sm">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className=" pl-4 flex items-center space-x-3">
                <div className="relative">
                  <Sparkles className="w-8 h-8 text-green-400" />
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-50 animate-pulse"></div>
                </div>
                <div>
                  <h1 className=" text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                    Flake AI
                  </h1>
                </div>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={clearChat}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-200 border border-green-400/50"
            >
              Clear
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-200 border border-red-400/50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main chat content and input area - now fills remaining height and is centered */}
      <div className="relative z-10 flex-1 flex flex-col max-w-6xl mx-auto w-full">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome Screen */}
          {showWelcome && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-2xl relative z-10">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-full">
                    <FaSnowflake className="w-16 h-16 text-white animate-pulse" />
                  </div>
                </div>

                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-teal-400 to-green-400 bg-clip-text text-transparent mb-6">
                  Hello, I&apos;m Flake AI.
                </h1>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
                    <Sparkles className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-white text-sm">
                      AI Powered Conversations
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
                    <MessageCircle className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                    <p className="text-white text-sm">Real-time Responses</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
                    <Brain className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-white text-sm">Smart Context Memory</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
                    <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-white text-sm">Lightning Fast</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Messages area */}
          {!showWelcome && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-4 ${
                    message.type === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`
                      flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2
                      ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-green-500 to-teal-500 border-green-400 shadow-lg shadow-green-500/50"
                          : "bg-gradient-to-r from-teal-500 to-emerald-500 border-teal-400 shadow-lg shadow-teal-500/50"
                      }
                    `}
                  >
                    {message.type === "user" ? (
                      <User size={22} className="text-white" />
                    ) : (
                      <Bot size={22} className="text-white" />
                    )}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`
                      flex-1 max-w-4xl p-5 rounded-2xl border backdrop-blur-sm
                      ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-green-900/50 to-teal-900/50 border-green-500/50 shadow-lg shadow-green-500/20"
                          : "bg-gradient-to-r from-teal-900/50 to-emerald-900/50 border-teal-500/50 shadow-lg shadow-teal-500/20"
                      }
                    `}
                  >
                    <div className="prose prose-invert max-w-none">
                      <p className="text-white leading-relaxed text-[15px]">
                        {message.content}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 mt-3 flex items-center space-x-2">
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      <span>•</span>
                      <span
                        className={
                          message.type === "user"
                            ? "text-green-400"
                            : "text-teal-400"
                        }
                      >
                        {message.type === "user" ? "You" : "AI Assistant"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 bg-gradient-to-r from-teal-500 to-emerald-500 border-teal-400 shadow-lg shadow-teal-500/50">
                    <Bot size={22} className="text-white" />
                  </div>
                  <div className="flex-1 max-w-4xl p-5 rounded-2xl border backdrop-blur-sm bg-gradient-to-r from-teal-900/50 to-emerald-900/50 border-teal-500/50 shadow-lg shadow-teal-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-150"></div>
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-300"></div>
                      </div>
                      <span className="text-gray-400 text-sm">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="sticky bottom-0 mb-6 border-t border-white/10 bg-black/30 backdrop-blur-3xl p-6 shadow-2xl shadow-green-500/10 rounded-3xl mx-4">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-4"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="How can i help you..."
                disabled={isLoading}
                className="w-full p-4 bg-gray-900/40 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 backdrop-blur-md transition-all duration-200"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/10 to-teal-500/10 pointer-events-none"></div>
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-200 border border-green-400/50"
            >
              <ArrowUp size={22} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
