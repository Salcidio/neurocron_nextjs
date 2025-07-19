'use client';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../app/lib/supabase";
import { HuggingFaceAPI } from "../app/lib/huggingface";
import Layout from "../Layout";
import ChatMessage from "../../../components/ChatMessage";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Mic, Paperclip, Smile } from "lucide-react";

export default function ChatRoom({params}) {
  const {id} = params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  

  const hfAPI = new HuggingFaceAPI(process.env.HUGGINGFACE_API_KEY);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [router]);

  useEffect(() => {
    if (id && user) {
      loadConversation();
      loadMessages();
    }
  }, [id, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversation = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setConversation(data);
    }
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    if (data) {
      setMessages(data);
    }
  };

  const saveMessage = async (content, role) => {
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          conversation_id: id,
          user_id: user.id,
          content,
          role,
        },
      ])
      .select()
      .single();

    return data;
  };

  const updateConversationTitle = async (title) => {
    await supabase
      .from("conversations")
      .update({
        title: title.substring(0, 50) + (title.length > 50 ? "..." : ""),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      // Save user message
      const savedUserMessage = await saveMessage(userMessage, "user");
      if (savedUserMessage) {
        setMessages((prev) => [...prev, savedUserMessage]);
      }

      // Update conversation title if it's the first message
      if (messages.length === 0) {
        await updateConversationTitle(userMessage);
      }

      // Get AI response
      const aiResponse = await hfAPI.chat([
        ...messages,
        { role: "user", content: userMessage },
      ]);

      // Save AI response
      const savedAIMessage = await saveMessage(aiResponse, "assistant");
      if (savedAIMessage) {
        setMessages((prev) => [...prev, savedAIMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Save error message
      const errorMessage = await saveMessage(
        "I apologize, but I'm experiencing technical difficulties. Please try again later.",
        "assistant"
      );
      if (errorMessage) {
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <div key={message.id} className="group">
                <ChatMessage message={message} index={index} />
              </div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start mb-6"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                  <div className="flex space-x-1">
                    <motion.div
                      className="w-2 h-2 bg-white/60 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-white/60 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-white/60 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.4,
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/5 backdrop-blur-xl border-t border-white/10"
        >
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="flex items-end space-x-4">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[60px] max-h-32"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(e);
                      }
                    }}
                  />

                  {/* Input Actions */}
                  <div className="absolute right-2 bottom-2 flex items-center space-x-2">
                    <motion.button
                      type="button"
                      className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Paperclip className="w-4 h-4 text-white/60" />
                    </motion.button>
                    <motion.button
                      type="button"
                      className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Smile className="w-4 h-4 text-white/60" />
                    </motion.button>
                    <motion.button
                      type="button"
                      className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Mic className="w-4 h-4 text-white/60" />
                    </motion.button>
                  </div>
                </div>

                {/* Send Button */}
                <motion.button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 rounded-2xl transition-all duration-200 shadow-lg disabled:opacity-50"
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Loader2 className="w-6 h-6 text-white" />
                    </motion.div>
                  ) : (
                    <Send className="w-6 h-6 text-white" />
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
