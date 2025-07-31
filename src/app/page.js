"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Zap, MessageCircle, ArrowRight } from "lucide-react";
import { FaSnowflake, FaDocker, FaReact } from "react-icons/fa";
import {
  SiHuggingface,
  SiOpenai,
  SiGoogleai,
  SiLlama,
  SiGooglecolab,
  SiLenovo,
  SiNpm,
  SiFastapi,
  SiNextdotjs,
  SiVercel,
  SiGithubcopilot,
  SiGooglechrome,
} from "react-icons/si";
import { TbBrandSupabase, TbBrandX } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 80,
      behavior: "smooth",
    });
  }
};

const IntegratedFlakeHomePage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [headerShrunk, setHeaderShrunk] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Refs for sections
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const partnersRef = useRef(null);
  const ctaRef = useRef(null);

  // State for section visibility
  const [aboutVisible, setAboutVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [partnersVisible, setPartnersVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    setHeaderShrunk(currentScrollY > 80);

    const checkVisibility = (entries) => {
      entries.forEach((entry) => {
        if (entry.target === aboutRef.current) {
          setAboutVisible(entry.isIntersecting);
        } else if (entry.target === featuresRef.current) {
          setFeaturesVisible(entry.isIntersecting);
        } else if (entry.target === partnersRef.current) {
          setPartnersVisible(entry.isIntersecting);
        } else if (entry.target === ctaRef.current) {
          setCtaVisible(entry.isIntersecting);
        }
      });
    };

    const observer = new IntersectionObserver(checkVisibility, {
      threshold: 0.2,
    });

    if (aboutRef.current) observer.observe(aboutRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (partnersRef.current) observer.observe(partnersRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Enhanced partners data
  const partners = [
    {
      name: "React",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
      icon: FaReact,
    },
    {
      name: "Hugging Face",
      logo: "https://huggingface.co/front/assets/huggingface_logo.svg",
      icon: SiHuggingface,
    },
    {
      name: "Docker",
      logo: "https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.png",
      icon: FaDocker,
    },
    {
      name: "Supabase",
      logo: "https://supabase.com/brand-assets/supabase-logo-icon.png",
      icon: TbBrandSupabase,
    },
    {
      name: "OpenAI",
      logo: "https://cdn.simpleicons.org/openai/ffffff",
      icon: SiOpenai,
    },
    {
      name: "Google ",
      logo: "https://cdn.simpleicons.org/googleai/ffffff",
      icon: FcGoogle,
    },
    {
      name: "Grok",
      logo: "https://cdn.simpleicons.org/grok/ffffff",
      icon: TbBrandX,
    },

    {
      name: "Gemini",
      logo: "https://cdn.simpleicons.org/googlegemini/ffffff",
      icon: SiGoogleai,
    },
    {
      name: "Llama",
      logo: "ollama.svg",
      icon: SiLlama,
    },
    {
      name: "Colab",
      logo: "https://cdn.simpleicons.org/googlecolab/ffffff",
      icon: SiGooglecolab,
    },
    {
      name: "Lenovo",
      logo: "lenovo.svg",
      icon: SiLenovo,
    },
    {
      name: "NPM",
      logo: "npm.svg",
      icon: SiNpm,
    },
    {
      name: "FastAPI",
      logo: "fastapi.svg",
      icon: SiFastapi,
    },

    {
      name: "Next.js",
      logo: "nextdotjs.svg",
      icon: SiNextdotjs,
    },

    {
      name: "Vercel",
      logo: "vercel.svg",
      icon: SiVercel,
    },
    {
      name: "Copilot",
      logo: "copilot.svg",
      icon: SiGithubcopilot,
    },
    {
      name: "Github",
      logo: "github.svg",
      icon: SiGithubcopilot,
    },
  ];
  const techStack = [
    { icon: FaDocker, text: "Docker", color: "from-blue-400 to-blue-600" },
    {
      icon: SiHuggingface,
      text: "HuggingFace",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: TbBrandSupabase,
      text: "Supabase",
      color: "from-green-400 to-emerald-600",
    },
    { icon: FaReact, text: "React", color: "from-cyan-400 to-blue-500" },
  ];

  return (
    <div className="font-inter bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>

        {/* Enhanced Floating Elements */}
        {isClient &&
          [...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              {i % 5 === 0 && (
                <Sparkles className="w-3 h-3 text-purple-400 opacity-60" />
              )}
              {i % 5 === 1 && (
                <Zap className="w-3 h-3 text-yellow-400 opacity-60" />
              )}
              {i % 5 === 2 && (
                <Brain className="w-3 h-3 text-blue-400 opacity-60" />
              )}
              {i % 5 === 3 && (
                <MessageCircle className="w-3 h-3 text-pink-400 opacity-60" />
              )}
              {i % 5 === 4 && (
                <FaSnowflake className="w-3 h-3 text-cyan-400 opacity-60" />
              )}
            </div>
          ))}
      </div>

      {/* Enhanced Sticky Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
          headerShrunk
            ? "bg-black/80 backdrop-blur-lg shadow-lg py-3 border-b border-white/10"
            : "bg-transparent py-6"
        }`}
      >
        <nav className="container mx-auto flex justify-between items-center px-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-sm opacity-50"></div>
              <FaSnowflake className="w-8 h-8 text-white relative z-10" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Flake AI
            </span>
          </div>
          <ul className="flex space-x-8">
            {["Home", "About", "Features", "Partners", "Contact"].map(
              (item) => (
                <li key={item}>
                  <button
                    onClick={() =>
                      scrollToSection(
                        item.toLowerCase() === "home"
                          ? "hero"
                          : item.toLowerCase()
                      )
                    }
                    className="text-gray-300 hover:text-white transition-all duration-200 relative group cursor-pointer"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-200 group-hover:w-full"></span>
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      </header>

      {/* Enhanced Hero Section */}
      <section
        id="hero"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          {/* AI Logo Animation */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 8,
                ease: "linear",
              }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-full w-fit"
            >
              <FaSnowflake className="w-16 h-16 text-white" />
            </motion.div>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 animate-gradient"
          >
            Flake ai{" "}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-purple-200 mb-8 max-w-2xl mx-auto"
          >
            Experience the future of AI with our stunning models realm. Powered
            by Hugging Face models, secured by Supabase, and enhanced by
            Salcidio.
          </motion.p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded border border-white/20 hover:scale-110 transition-all duration-300 cursor-pointer hover:bg-white/20`}
              >
                <tech.icon className="w-5 h-5 text-white" />
                <span className="text-white font-medium">{tech.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section
        id="about"
        ref={aboutRef}
        className={`py-20 bg-black/20 backdrop-blur-sm border-y border-white/10 transform transition-all duration-1000 ease-out ${
          aboutVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0"
        }`}
      >
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-8">
            About Flake AI
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <p className="text-lg text-purple-200 leading-relaxed mb-6">
                Flake AI is more than just a platform; it's a revolutionary
                approach to artificial intelligence. We believe in empowering
                creators with tools that are intuitive, powerful, and
                beautifully designed.
              </p>
              <p className="text-lg text-purple-200 leading-relaxed">
                Our mission is to bridge the gap between complex AI technology
                and everyday users, making advanced AI accessible to everyone
                through elegant design and seamless integration.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4 text-white">
                  AI-First Design
                </h3>
                <p className="text-purple-200">
                  Built from the ground up with artificial intelligence at its
                  core.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section
        id="features"
        ref={featuresRef}
        className={`py-20 transform transition-all duration-1000 ease-out ${
          featuresVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0"
        }`}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent text-center mb-12">
            AI-Powered Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Intelligent Conversations",
                description:
                  "Advanced AI models that understand context and provide meaningful responses.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Optimized performance with instant responses and seamless user experience.",
                gradient: "from-yellow-500 to-orange-500",
              },
              {
                icon: Sparkles,
                title: "Creative AI",
                description:
                  "Generate, create, and innovate with our suite of creative AI tools.",
                gradient: "from-cyan-500 to-blue-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl blur-xl"></div>
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 mx-auto`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-purple-200 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Partners Section */}
      <section
        id="partners"
        ref={partnersRef}
        className={`py-20 bg-black/20 backdrop-blur-sm border-y border-white/10 transform transition-all duration-1000 ease-out ${
          partnersVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0"
        }`}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-12">
            Powered By
          </h2>

          <div className="marquee">
            <div className="marquee__content">
              {[...partners, ...partners].map((partner, i) => (
                <div key={i} className="partner-item">
                  {partner.icon ? (
                    <partner.icon className="w-12 h-12 text-white" />
                  ) : (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-12 h-12 object-contain filter brightness-0 invert"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                  <p className="text-sm font-medium text-purple-200 mt-2">
                    {partner.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section
        id="contact"
        ref={ctaRef}
        className={`py-20 text-center transform transition-all duration-1000 ease-out ${
          ctaVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Ready to Experience the Future?
              </h2>
              <p className="text-xl mb-10 text-purple-200 max-w-2xl mx-auto">
                Join thousands of creators who are already using Flake AI to
                transform their ideas into reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-600 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                  <span>
                    {" "}
                    <Link href="/auth">Explore</Link>
                  </span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-12 bg-black/40 backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaSnowflake className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Flake AI
            </span>
          </div>
          <p className="text-purple-200 mb-2">
            &copy; {new Date().getFullYear()} Flake AI. All rights reserved.
          </p>
          <p className="text-purple-300">
            Built with love for the future of AI interaction.
          </p>
        </div>
      </footer>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        .marquee {
          position: relative;
          overflow: hidden;
        }

        .marquee__content {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: 12rem; /* match your .partner-item width */
          gap: 2rem; /* optional spacing */
          animation: marquee 30s linear infinite;
        }

        .partner-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* keyframes */
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(5deg);
          }
          50% {
            transform: translateY(-20px) rotate(0deg);
          }
          75% {
            transform: translateY(-10px) rotate(-5deg);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default IntegratedFlakeHomePage;
