"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";
import { FaSnowflake } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AuthComponent() {
  const [session, setSession] = useState(null);
  const router = useRouter();

  // Initialize redirectTo safely on first render
  const redirectTo =
    typeof window !== "undefined" ? window.location.origin + "/lora" : null;

  useEffect(() => {
    // Check for active session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        router.push("/lora");
      }
    });

    // Cleanup subscription
    return () => subscription?.unsubscribe();
  }, [router]);

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
      <Link href="/">
        <h2 className="text-2xl font-bold text-white text-center mb-6 cursor-pointer">
          <div className="flex justify-center items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 8,
                ease: "linear",
              }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-full w-fit"
            >
              <FaSnowflake className="w-10 h-10 text-white" />
            </motion.div>
          </div>
          <br />
          Flake AI
        </h2>
      </Link>

      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#8B5CF6",
                brandAccent: "#7C3AED",
                brandButtonText: "white",
                defaultButtonBackground: "rgba(255, 255, 255, 0.1)",
                defaultButtonBackgroundHover: "rgba(255, 255, 255, 0.2)",
                defaultButtonBorder: "rgba(255, 255, 255, 0.2)",
                defaultButtonText: "white",
                dividerBackground: "rgba(255, 255, 255, 0.2)",
                inputBackground: "rgba(255, 255, 255, 0.1)",
                inputBorder: "rgba(255, 255, 255, 0.2)",
                inputBorderHover: "rgba(255, 255, 255, 0.3)",
                inputBorderFocus: "#07078eff",
                inputText: "white",
                inputLabelText: "rgba(255, 255, 255, 0.8)",
                inputPlaceholder: "rgba(255, 255, 255, 0.5)",
                messageText: "rgba(0, 0, 0, 0.8)",
                messageTextDanger: "#EF4444",
                anchorTextColor: "#A855F7",
                anchorTextHoverColor: "#9333EA",
              },
              space: {
                spaceSmall: "4px",
                spaceMedium: "8px",
                spaceLarge: "16px",
                labelBottomMargin: "8px",
                anchorBottomMargin: "4px",
                emailInputSpacing: "4px",
                socialAuthSpacing: "4px",
                buttonPadding: "10px 15px",
                inputPadding: "10px 15px",
              },
              fontSizes: {
                baseBodySize: "13px",
                baseInputSize: "14px",
                baseLabelSize: "14px",
                baseButtonSize: "14px",
              },
              fonts: {
                bodyFontFamily: `ui-sans-serif, sans-serif`,
                buttonFontFamily: `ui-sans-serif, sans-serif`,
                inputFontFamily: `ui-sans-serif, sans-serif`,
                labelFontFamily: `ui-sans-serif, sans-serif`,
              },
              borderWidths: {
                buttonBorderWidth: "1px",
                inputBorderWidth: "1px",
              },
              radii: {
                borderRadiusButton: "8px",
                buttonBorderRadius: "8px",
                inputBorderRadius: "8px",
              },
            },
          },
          className: {
            container: "auth-container",
            button: "auth-button",
            input: "auth-input",
          },
        }}
        providers={["google", "github"]}
        redirectTo={redirectTo}
      />
    </div>
  );
}
