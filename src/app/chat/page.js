"use client";

import { useState, useRef, useEffect } from "react";
import {
  BookA,
  Bot,
  User,
  Brain,
  MessageCircle,
  Zap,
  MessageSquarePlus,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { FaSnowflake } from "react-icons/fa";
import { motion } from "framer-motion";
import Sidebar from "../../components/SideBar";
import ChatInput from "../../components/ChatInput";

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef(null);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  // Backend API URL
  const API_BASE_URL = "https://neurocron-render.onrender.com";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //  //Check authentication and initialize
  // useEffect(() => {
  //   let isMounted = true;
  //   supabase.auth.getUser().then(({ data: { user } }) => {
  //     if (!user) {
  //       router.replace("/");
  //     } else if (isMounted) {
  //       setUser(user);
  //       setLoading(false);
  //     }
  //   });

  //   const { data: authListener } = supabase.auth.onAuthStateChange(
  //     async (_, session) => {
  //       if (!session?.user) {
  //         router.replace("/auth");
  //       } else {
  //         setUser(session.user);
  //       }
  //     }
  //   );

  //   return () => {
  //     isMounted = false;
  //     authListener.subscription.unsubscribe();
  //   };
  // }, [router, messages.length]); // messages.length is in the dependency array to prevent stale closure issues for messages

  const MAX_HISTORY_TURNS = 4; // Define how many recent user/bot pairs to keep
  const handleSendMessage = async (inputValue, selectedMode) => {
    if (!inputValue.trim() || isLoading) return;

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
      const apiHistory = [];
      const conversationTurns = [];

      // Group messages into turns (user followed by bot response)
      let currentTurn = [];
      // Start from the second message to exclude the initial welcome message if it was ever hardcoded for display purposes only,
      // though it's completely removed from state now.
      // This loop processes existing messages to build historical context for the API.
      for (const msg of messages) {
        currentTurn.push(msg);
        if (msg.type === "bot" && currentTurn.length > 0) {
          conversationTurns.push(currentTurn);
          currentTurn = [];
        }
      }
      // Add any pending user message as the start of a new turn
      if (currentTurn.length > 0) {
        conversationTurns.push(currentTurn);
      }

      // Take only the last N complete turns + the current user message
      const relevantTurns = conversationTurns.slice(-MAX_HISTORY_TURNS);

      relevantTurns.forEach((turn) => {
        turn.forEach((msg) => {
          if (msg.type === "user") {
            apiHistory.push({ role: "user", content: msg.content });
          } else if (msg.type === "bot") {
            apiHistory.push({
              role: "assistant",
              content: msg.content.split("\n\n—")[0], // Ensure only the main content is sent, not metadata
            });
          }
        });
      });

      // Use selectedMode as persona
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          persona: selectedMode || "default",
          history: apiHistory.map((item) => item.content), // Only sending content strings for history
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.response || "Failed to fetch response from AI."
        );
      }

      const data = await response.json();
      const botReply = data.response;

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content: botReply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: messages.length + 2,
        type: "bot",
        content: `Sorry, I encountered an error: ${
          error.message || "Please try again."
        }`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]); // Clears all messages
    setShowWelcome(true); // Shows the welcome screen again
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("User signed out successfully");
      router.push("/");
      setSigningOut(false); //trying to exit to the page before the loading exiting end showing
    } catch (error) {
      setSigningOut(false);
      console.error("Error signing out:", error.message);
    }
  };

  // Loading screen
  if (!loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900  to-blue-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  // Loading screen for signing out
  if (signingOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Exiting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-1000 via-blue-1000 to-blue-1000  text-white relative overflow-hidden flex">
      {/* Sidebar */}
      <Sidebar onSignOut={handleSignOut} />

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-blue-900/20 -z-10"></div>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-200"></div>
      </div>

      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse -z-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Main content area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header - now specific to chat page actions */}
        <header className="relative z-20 w-full bg-black/50 backdrop-blur-sm p-2 flex items-center justify-end">
          <button
            onClick={clearChat}
            className="p-2 bg-blue-600 rounded-md text-white font-medium hover:shadow-md hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-200 border border-blue-400/50 cursor-pointer"
            aria-label="Clear Chat"
          >
            <MessageSquarePlus size={20} />
          </button>
        </header>

        {/* Main chat content and input area */}
        <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Welcome Screen */}
            {showWelcome && (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-2xl relative z-10">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 8,
                        ease: "linear",
                      }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-full w-fit"
                    >
                      <FaSnowflake className="w-16 h-16 text-white animate-pulse" />
                    </motion.div>
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 animate-gradient"
                  >
                    {user
                      ? `Hello Again , ${
                          user.user_metadata?.name || user.email
                        }`
                      : "Welcome"}
                  </motion.h1>

                  <div>
                    <br />
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
                      <p className="text-white text-sm">
                        <BookA className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                        AI Powered Conversations
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
                      <MessageCircle className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                      <p className="text-white text-sm">Real-time Responses</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
                      <Brain className="w-8 h-8 text-blue-400 mx-auto mb-2" />
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
            {/* Only render messages if not on the welcome screen and there are actual messages */}
            {!showWelcome && messages.length > 0 && (
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
                            ? "bg-gradient-to-r from-blue-500 to-blue-500 border-blue-400 shadow-lg shadow-blue-500/50"
                            : "bg-gradient-to-r from-blue-500 to-blue-500 border-blue-400 shadow-lg shadow-blue-500/50"
                        }
                      `}
                    >
                      {message.type === "user" ? (
                        <User size={22} className="text-white" />
                      ) : (
                        <FaSnowflake size={22} className="text-white" />
                      )}
                    </div>

                    {/* Message bubble */}
                    <div
                      className={`
                        flex-1 max-w-4xl p-5 rounded-2xl border backdrop-blur-sm
                        ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-blue-900/50 to-blue-900/50 border-blue-500/50 shadow-lg shadow-blue-500/20"
                            : "bg-gradient-to-r from-blue-900/50 to-blue-900/50 border-blue-500/50 shadow-lg shadow-blue-500/20"
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
                              ? "text-blue-400"
                              : "text-blue-400"
                          }
                        >
                          {message.type === "user" ? "You" : "Flake ai"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 bg-gradient-to-r from-blue-500 to-blue-500 border-blue-400 shadow-lg shadow-blue-500/50">
                      <FaSnowflake size={22} className="text-white" />
                    </div>
                    <div className="flex-1 max-w-4xl p-5 rounded-2xl border backdrop-blur-sm bg-gradient-to-r from-blue-900/50 to-blue-900/50 border-blue-500/50 shadow-lg shadow-blue-500/20">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300"></div>
                        </div>
                        <span className="text-gray-400 text-sm">
                          Waiting for Flake ai ...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
