"use client";

import { useState } from "react";
import {
  ArrowUp,
  Brain, // Default AI icon
  Lightbulb, // Creative AI icon
  FlaskConical, // Factual AI icon
  Code, // Technical AI icon
  Mic, // Microphone icon
} from "lucide-react"; // Import necessary icons

export default function ChatInput({ onSendMessage, isLoading }) {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMode, setSelectedMode] = useState("default"); // State for selected AI mode

  // Define your AI modes with icons
  const aiModes = [
    { value: "default", label: "Default AI", icon: Brain }, // Using Brain for default
    { value: "creative", label: "Creative AI", icon: Lightbulb }, // Lightbulb for creative
    { value: "factual", label: "Factual AI", icon: FlaskConical }, // Flask for factual/scientific
    { value: "technical", label: "Technical AI", icon: Code }, // Code for technical
    // Add more modes as needed with appropriate icons
  ];

  // Find the currently selected mode object to get its icon and label
  const currentMode =
    aiModes.find((mode) => mode.value === selectedMode) || aiModes[0]; // Fallback to default

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue.trim(), selectedMode); // Pass selectedMode to onSendMessage
    setInputValue(""); // Clear the input after sending
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    setShowDropdown(false); // Close dropdown after selection
  };

  return (
    <div className="sticky bottom-0 mb-6 mx-4">
      {/* The main container for the input area. */}
      <div
        className="relative w-full rounded-2xl bg-zinc-900 border border-zinc-700 shadow-xl
                   focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-300"
      >
        {/* Input area */}
        <form onSubmit={handleSubmit} className="relative p-3 flex items-center space-x-2">
          {/* AI Mode Selection Button (now uses the current mode's icon) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 rounded-full text-zinc-400 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-colors duration-200"
              aria-label={`Current AI Mode: ${currentMode.label}. Click to change.`}
            >
              <currentMode.icon size={20} /> {/* Display the icon of the current mode */}
            </button>

            {/* AI Mode Dropdown */}
            {showDropdown && (
              <div className="absolute bottom-full mb-2 left-0 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-2 text-xs text-zinc-400 border-b border-zinc-700">
                  Select AI Mode
                </div>
                {aiModes.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => handleModeChange(mode.value)}
                    className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm
                                ${selectedMode === mode.value
                        ? "bg-blue-600 text-white font-semibold" // Highlight selected mode more strongly
                        : "text-zinc-200 hover:bg-zinc-700"
                      } transition-colors duration-150`}
                  >
                    <mode.icon size={16} /> {/* Render the icon */}
                    {mode.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ask in ${currentMode.label} mode...`} // Dynamic placeholder
            disabled={isLoading}
            className="flex-1 p-2 bg-transparent text-white placeholder-zinc-500 focus:outline-none border-none"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label="Send message"
          >
            <ArrowUp size={20} />
          </button>

          {/* Microphone Icon */}
          <button
            type="button"
            className="p-2 rounded-full text-zinc-400 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-colors duration-200"
            aria-label="Voice input"
          >
            <Mic size={20} /> {/* Using the imported Mic icon */}
          </button>
        </form>
      </div>
      <p className="text-xs text-zinc-500 text-center mt-2">
        Flake AI can make mistakes, so double-check it.
      </p>
    </div>
  );
}