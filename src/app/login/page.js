"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function App() {
  return (
    <div
      className="bg-gradient-to-br from-blue-700 to-blue-900 min-h-screen flex items-center justify-center font-sans relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://i.postimg.cc/bwHVDRZ7/PC-background-wallpaper.jpg')",
      }}
    >
      <BackgroundShapes />
      <LoginPage />
    </div>
  );
}

const BackgroundShapes = () => (
  <>
    <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-blue-500/30 rounded-full filter blur-3xl"></div>
    <div className="absolute bottom-[-50px] right-[-50px] w-72 h-72 bg-blue-400/30 rounded-full filter blur-3xl"></div>
    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-500/20 rounded-full filter blur-2xl animate-pulse"></div>
    <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-indigo-400/20 rounded-full filter blur-2xl animate-pulse delay-500"></div>
  </>
);

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login")) {
          setError("Invalid email or password");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please verify your email address");
        } else {
          setError(error.message);
        }
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) setError(error.message);
    } catch (err) {
      setError("An unexpected error occurred during social login");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto z-10">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 m-4">
        <div className="flex justify-center mb-4"></div>
        <h2 className="text-white text-2xl font-semibold text-center mb-8">
          Flake AI
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email"
            type="email"
            placeholder="username@gmail.com"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <InputField
              label="Password"
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 top-7 flex items-center px-4 text-gray-400 hover:text-white"
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-blue-300 hover:text-white transition-colors"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center text-gray-400 my-6">or continue with</div>

        <div className="flex justify-center space-x-4">
          <SocialLoginButton
            icon={<GoogleIcon />}
            onClick={() => handleSocialLogin("google")}
          />
          <SocialLoginButton
            icon={<Github size={24} />}
            onClick={() => handleSocialLogin("github")}
          />
          <SocialLoginButton
            icon={<AppleIcon />}
            onClick={() => handleSocialLogin("apple")}
          />
        </div>

        <p className="text-center text-gray-400 mt-8">
          Do not have an account?{" "}
          <a
            href="/register"
            className="text-blue-300 hover:text-white font-bold transition-colors"
          >
            Register for free
          </a>
        </p>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  type,
  placeholder,
  id,
  value,
  onChange,
  required,
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-white text-sm font-medium mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full bg-white/20 border border-white/30 text-white placeholder-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
    />
  </div>
);

const SocialLoginButton = ({ icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-center w-16 h-12 bg-white/10 border border-white/30 rounded-lg text-white hover:bg-white/20 transition-colors"
  >
    {icon}
  </button>
);

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.245 44 30.028 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12.01,2.07c-2.31,0-4.23,1.52-5.2,3.62c-1.7,0.07-3.4,0.85-4.63,2.27c-1.54,1.78-1.74,4.39-0.5,6.58 c0.93,1.65,2.54,2.64,4.27,2.64c0.55,0,1.1-0.1,1.6-0.29c1.2,1.83,3.23,2.9,5.46,2.89c2.23-0.01,4.26-1.08,5.46-2.89 c0.5,0.19,1.05,0.29,1.6,0.29c1.73,0,3.34-0.99,4.27-2.64c1.24-2.19,1.04-4.8-0.5-6.58c-1.23-1.42-2.93-2.2-4.63-2.27 C16.24,3.59,14.32,2.07,12.01,2.07z M11.86,0c2.21,0,3.89,1.13,4.92,2.94C15.33,3.03,13.7,3.03,12,3.03s-3.33,0-4.78-0.09 C8,1.13,9.65,0,11.86,0z" />
  </svg>
);
