"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterApp() {
  return (
    <div
      className="bg-gradient-to-br from-blue-700 to-blue-900 min-h-screen flex items-center justify-center font-sans relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://i.postimg.cc/bwHVDRZ7/PC-background-wallpaper.jpg')",
      }}
    >
      <BackgroundShapes />
      <RegisterPage />
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

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      setError("Please check your email to verify your account");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError("An error occurred during social sign up");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto z-10">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 m-4">
        <h2 className="text-white text-2xl font-semibold text-center mb-8">
          Create your Flake AI Account
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
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="relative">
            <InputField
              label="Password"
              type={passwordVisible ? "text" : "password"}
              placeholder="Create a strong password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-0 top-7 flex items-center px-4 text-gray-400 hover:text-white"
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <InputField
            label="Confirm Password"
            type={passwordVisible ? "text" : "password"}
            placeholder="Confirm your password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

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
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center text-gray-400 my-6">or sign up with</div>

        <div className="flex justify-center space-x-4">
          <SocialLoginButton
            icon={<GoogleIcon />}
            onClick={() => handleSocialSignup("google")}
          />
          <SocialLoginButton
            icon={<Github size={24} />}
            onClick={() => handleSocialSignup("github")}
          />
          <SocialLoginButton
            icon={<AppleIcon />}
            onClick={() => handleSocialSignup("apple")}
          />
        </div>

        <p className="text-center text-gray-400 mt-8">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-300 hover:text-white font-bold transition-colors"
          >
            Sign In
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
    <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.38 4.38 0 0 0-2.91 1.53 4.19 4.19 0 0 0-1.07 3.14 3.61 3.61 0 0 0 2.92-1.48zm3.89 12.92c-.95 1.63-1.95 3.27-3.37 3.27s-1.85-1.07-3.47-1.07-2.09 1.07-3.47 1.07-2.39-1.61-3.37-3.27c-1.84-2.78-3.25-7.86-1.35-11.3a5.25 5.25 0 0 1 4.41-2.67c1.37 0 2.67.91 3.5.91s2.39-.91 4-.91a5.23 5.23 0 0 1 4.17 2.17c-3.67 2-3.08 7.31.95 8.6z" />
  </svg>
);