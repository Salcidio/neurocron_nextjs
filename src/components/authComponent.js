"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";

export default function AuthComponent() {
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        router.push("/chat");
      }
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        router.push("/chat");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Welcome
                <br /> to the Future
              </h2>

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
                        defaultButtonBackgroundHover:
                          "rgba(255, 255, 255, 0.2)",
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
                        messageText: "rgba(255, 255, 255, 0.8)",
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
                redirectTo={`${window.location.origin}/chat`}
              />
            </div>
  );
}