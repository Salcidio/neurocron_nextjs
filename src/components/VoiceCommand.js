"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Snackbar from "./SnackBar";

export default function VoiceCommand() {
  const router = useRouter();
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("webkitSpeechRecognition" in window)
    ) {
      console.warn("Speech recognition not supported");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-GB"; // 🇬🇧 British English
    recognitionRef.current = recognition;

    const stopAfterFiveMinutes = () => {
      timeoutRef.current = setTimeout(() => {
        recognition.stop();
        console.log("[Voice] Auto stopped after 5 minutes");
        isListeningRef.current = false;
      }, 5 * 60 * 1000); // 5 minutes
    };

    const startRecognition = () => {
      if (!isListeningRef.current) {
        try {
          recognition.start();
          isListeningRef.current = true;
          console.log("[Voice] Listening started");
          stopAfterFiveMinutes();
        } catch (err) {
          console.warn("[Voice] Start error:", err);
        }
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();
      console.log("[Voice] Heard:", transcript);

      setSnackbarMessage(`You said: "${transcript}"`);
      setShowSnackbar(true);

      if (transcript.includes("flake enter")) {
        router.push("/auth");
      } else if (transcript.includes("flake register")) {
        router.push("/auth");
      } else if (transcript.includes("flake login")) {
        router.push("/auth");
      } else if (transcript.includes("flake homepage")) {
        router.push("/");
      } else if (transcript.includes("go back")) {
        router.back();
      } else if (transcript.includes("flake scan")) {
        router.push("/scan");
      } else if (transcript.includes("flake chat")) {
        router.push("/chat");
      } else if (transcript.includes("flake dasboard")) {
        router.push("/dasboard");
      }
    };

    recognition.onerror = (event) => {
      console.warn("[Voice] Error:", event.error);

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        console.warn("[Voice] Permission denied. Stopping forever.");
        recognition.stop();
        isListeningRef.current = false;
        return;
      }
    };

    recognition.onend = () => {
      console.log("[Voice] Recognition ended");
      isListeningRef.current = false;
    };

    startRecognition();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      recognition.stop();
    };
  }, [router]);

  return <Snackbar message={snackbarMessage} visible={showSnackbar} />;
}
