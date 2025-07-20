"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Snackbar from "./SnackBar";

export default function VoiceCommand() {
  const router = useRouter();
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const shouldContinueListeningRef = useRef(true);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {    shouldContinueListeningRef.current = true; 

    

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
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    const startRecognition = () => {
      if (!isListeningRef.current && shouldContinueListeningRef.current) {
        try {
          recognition.start();
          isListeningRef.current = true;
          console.log("[Voice] Listening started");
        } catch (err) {
          console.warn("[Voice] Start error:", err);
        }
      }
    };

    const restartRecognition = () => {
      isListeningRef.current = false;
      if (shouldContinueListeningRef.current) {
        setTimeout(() => startRecognition(), 500);
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();
      console.log("[Voice] Heard:", transcript);

      // Show the command in the Snackbar
      setSnackbarMessage(`You said: "${transcript}"`);
      setShowSnackbar(true);

         if (transcript.includes("flake enter")) {
        router.push("/auth");
      } else if (transcript.includes("flake register")) {
        router.push("/register");
      } else if (transcript.includes("flake homepage")) {
        router.push("/");
      } else if (transcript.includes("go back")) {
        router.back();
      }
    };

    recognition.onerror = (event) => {
      console.warn("[Voice] Error:", event.error);

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        console.warn("[Voice] Permission denied. Stopping forever.");
        shouldContinueListeningRef.current = false;
        recognition.stop();
        return;
      }

      restartRecognition();
    };

    recognition.onend = () => {
      console.log("[Voice] Recognition ended");
      restartRecognition();
    };

    startRecognition();

    return () => {
      shouldContinueListeningRef.current = false;
      try {
        recognition.stop();
      } catch (err) {
        console.log("[Voice] Stop error:", err);
      }
    };
  }, [router]);

  return (
    <>
      <Snackbar message={snackbarMessage} visible={showSnackbar} />
    </>
  );
}
