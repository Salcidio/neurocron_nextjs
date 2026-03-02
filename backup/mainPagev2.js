"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Sparkles,
  Brain,
  Zap,
  MessageCircle,
  ArrowRight,
  Code,
  Share2,
  Cpu,
} from "lucide-react";
import { FaSnowflake, FaDocker, FaReact } from "react-icons/fa";
import { SiHuggingface } from "react-icons/si";
import { TbBrandSupabase } from "react-icons/tb";

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    window.scrollTo({ top: element.offsetTop - 80, behavior: "smooth" });
  }
};

const Section = ({ children, id, ...props }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  return (
    <motion.section
      id={id}
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      {...props}
    >
      {children}
    </motion.section>
  );
};

const IntegratedFlakeHomePage = () => {
  const [headerShrunk, setHeaderShrunk] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => setHeaderShrunk(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const partners = [
    { name: "Github", path: "partners/github.svg" },
    { name: "React", path: "partners/react.svg" },
    { name: "Hugging Face", path: "partners/huggingface.svg" },
    { name: "Docker", path: "partners/docker.svg" },
    { name: "Vercel", path: "partners/vercel.svg" },
    { name: "Next.js", path: "partners/nextjs.svg" },
    { name: "NPM", path: "partners/npm.svg" },
    { name: "Llama", path: "partners/ollama.svg" },
  ];

  const techStack = [
    { icon: FaDocker, text: "Docker", link: "http://www.docker.com" },
    { icon: SiHuggingface, text: "HuggingFace", link: "http://www.huggingfac.com" },
    { icon: TbBrandSupabase, text: "Supabase", link: "http://www.supabase.com" },
    { icon: FaReact, text: "React", link: "http://www.react.com" },
  ];

  return (
    <div className="font-sans bg-[#08090d] min-h-screen text-white overflow-x-hidden">

      {/* Subtle ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#1a2744]/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#0f1f3d]/20 rounded-full blur-[100px]" />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#4a90d9 1px, transparent 1px), linear-gradient(90deg, #4a90d9 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #c8a96e;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }

        .gold-line {
          display: inline-block;
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, #c8a96e, transparent);
          vertical-align: middle;
          margin-right: 12px;
        }

        .marquee {
          overflow: hidden;
          --gap: 3rem;
          --duration: 50s;
        }
        .marquee__content {
          display: flex;
          gap: var(--gap);
          animation: marquee var(--duration) linear infinite;
        }
        .partner-item {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 14rem;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - var(--gap) / 2)); }
        }

        .feature-card {
          position: relative;
          overflow: hidden;
          transition: transform 0.4s ease, border-color 0.4s ease;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(200,169,110,0.04) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .feature-card:hover { transform: translateY(-6px); border-color: rgba(200,169,110,0.3) !important; }
        .feature-card:hover::before { opacity: 1; }

        .btn-primary {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .btn-primary:hover::after { opacity: 1; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(200,169,110,0.25); }

        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c8a96e;
          font-weight: 500;
        }
      `}</style>

      {/* ── HEADER ── */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        headerShrunk
          ? "bg-[#08090d]/90 backdrop-blur-xl border-b border-white/5 py-4"
          : "bg-transparent py-7"
      }`}>
        <nav className="container mx-auto flex justify-between items-center px-8 max-w-7xl">
          <div className="flex items-center space-x-3">
            <FaSnowflake className="w-5 h-5 text-[#c8a96e]" />
            <span className="font-display text-xl font-semibold tracking-widest text-white/90">
              FLAKE AI
            </span>
          </div>

          <ul className="flex space-x-10">
            {["Home", "About", "Build", "Features", "Partners", "Enter"].map((item) => (
              <li key={item}>
                <button
                  onClick={() =>
                    scrollToSection(
                      item.toLowerCase() === "home" ? "hero" : item.toLowerCase()
                    )
                  }
                  className="nav-link relative font-body text-sm tracking-wider text-white/50 hover:text-white/90 transition-colors duration-300 cursor-pointer"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section id="hero" className="relative h-screen flex items-center justify-center">
        <div className="relative z-10 text-center max-w-5xl mx-auto px-8">

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 flex justify-center"
          >
            <div className="relative p-5 border border-[#c8a96e]/20 rounded-full">
              <div className="absolute inset-0 rounded-full bg-[#c8a96e]/5 blur-xl" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              >
                <FaSnowflake className="w-10 h-10 text-[#c8a96e]" />
              </motion.div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="section-label mb-5"
          >
            Artificial Intelligence Platform
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-8xl font-light text-white/90 mb-6 leading-[0.95] tracking-tight"
          >
            Flake AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="font-body text-lg text-white/40 mb-12 max-w-xl mx-auto leading-relaxed font-light"
          >
            Experience the future of AI with our models realm. Powered by Hugging Face,
            secured by Supabase, and enhanced by Salcidio.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-wrap justify-center gap-3 mb-14"
          >
            {techStack.map((tech, i) => (
              <Link key={i} href={tech.link}>
                <div className="flex items-center space-x-2 px-5 py-2.5 border border-white/10 hover:border-[#c8a96e]/40 rounded-sm transition-all duration-300 cursor-pointer bg-white/[0.02] hover:bg-white/[0.04]">
                  <tech.icon className="w-4 h-4 text-[#c8a96e]" />
                  <span className="font-body text-sm text-white/60 tracking-wider">{tech.text}</span>
                </div>
              </Link>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center"
          >
            <div className="flex flex-col items-center space-y-2">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="w-px h-10 bg-gradient-to-b from-transparent via-[#c8a96e]/50 to-transparent"
              />
              <span className="section-label text-[0.6rem]">Scroll to explore</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <Section
        id="about"
        className="py-32 border-t border-white/5"
      >
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <p className="section-label mb-6">About</p>
              <h2 className="font-display text-6xl font-light text-white/90 mb-10 leading-tight">
                A New Standard<br />in AI Interaction
              </h2>
              <div className="space-y-6">
                <p className="font-body text-white/45 leading-relaxed font-light">
                  Flake AI is more than just a platform — it is a revolutionary approach
                  to artificial intelligence. We believe in empowering creators with tools
                  that are intuitive, powerful, and beautifully designed.
                </p>
                <p className="font-body text-white/45 leading-relaxed font-light">
                  Our mission is to bridge the gap between complex AI technology and everyday
                  users, making advanced AI accessible to everyone through elegant design
                  and seamless integration.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-[#c8a96e]/3 rounded-sm blur-2xl" />
              <div className="relative border border-white/8 rounded-sm p-12 bg-white/[0.02]">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 border border-[#c8a96e]/30 rounded-sm flex items-center justify-center">
                    <Brain className="w-5 h-5 text-[#c8a96e]" />
                  </div>
                  <span className="section-label">Core Philosophy</span>
                </div>
                <h3 className="font-display text-3xl font-light text-white/80 mb-5 leading-snug">
                  AI-First Design
                </h3>
                <p className="font-body text-white/40 leading-relaxed font-light">
                  Built from the ground up with artificial intelligence at its core —
                  every decision, every interface, every interaction.
                </p>
                <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
                  {[
                    { label: "Models Available", value: "50+" },
                    { label: "Uptime Guarantee", value: "99.9%" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="font-display text-4xl font-light text-[#c8a96e] mb-1">{stat.value}</p>
                      <p className="section-label text-[0.6rem]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── HOW IT WORKS ── */}
      <Section id="build" className="py-32 border-t border-white/5">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="section-label mb-4">Process</p>
              <h2 className="font-display text-6xl font-light text-white/90 leading-tight">
                How It Works
              </h2>
            </div>
            <div className="w-32 h-px bg-gradient-to-r from-[#c8a96e]/50 to-transparent" />
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {[
              {
                icon: Cpu,
                step: "01",
                title: "Connect Your Models",
                description:
                  "Integrate your Hugging Face models into our secure, scalable infrastructure with minimal configuration.",
              },
              {
                icon: Code,
                step: "02",
                title: "Build Your Interface",
                description:
                  "Use our intuitive tools to compose elegant user interfaces for your AI-powered applications.",
              },
              {
                icon: Share2,
                step: "03",
                title: "Deploy and Share",
                description:
                  "Deploy your creations with a single action and distribute them to a global audience.",
              },
            ].map((step, i) => (
              <div key={i} className="group bg-[#08090d] p-12 hover:bg-white/[0.02] transition-colors duration-400">
                <div className="flex items-center justify-between mb-10">
                  <span className="font-display text-5xl font-light text-white/10 group-hover:text-[#c8a96e]/20 transition-colors">{step.step}</span>
                  <div className="w-10 h-10 border border-white/10 group-hover:border-[#c8a96e]/30 rounded-sm flex items-center justify-center transition-colors">
                    <step.icon className="w-4 h-4 text-white/30 group-hover:text-[#c8a96e] transition-colors" />
                  </div>
                </div>
                <h3 className="font-display text-2xl font-light text-white/70 mb-4">{step.title}</h3>
                <p className="font-body text-sm text-white/35 leading-relaxed font-light">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FEATURES ── */}
      <Section id="features" className="py-32 border-t border-white/5">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="text-center mb-16">
            <p className="section-label mb-4">Capabilities</p>
            <h2 className="font-display text-6xl font-light text-white/90">
              AI-Powered Features
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "Intelligent Conversations",
                description:
                  "Advanced AI models that understand context and provide precise, meaningful responses tailored to your needs.",
                accent: "#4a90d9",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Optimized infrastructure delivering instantaneous responses and a seamless, uninterrupted experience.",
                accent: "#c8a96e",
              },
              {
                icon: Sparkles,
                title: "Creative AI",
                description:
                  "Generate, create, and innovate with a comprehensive suite of creative artificial intelligence tools.",
                accent: "#6ab5a0",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="feature-card border border-white/8 rounded-sm p-10 bg-white/[0.015]"
              >
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center mb-8"
                  style={{ backgroundColor: `${feature.accent}12`, border: `1px solid ${feature.accent}25` }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.accent }} />
                </div>
                <h3 className="font-display text-2xl font-light text-white/80 mb-4">{feature.title}</h3>
                <p className="font-body text-sm text-white/35 leading-relaxed font-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── PARTNERS ── */}
      <Section
        id="partners"
        className="py-28 border-t border-white/5 overflow-hidden"
      >
        <div className="container mx-auto px-8 max-w-7xl text-center mb-14">
          <p className="section-label mb-4">Ecosystem</p>
          <h2 className="font-display text-5xl font-light text-white/90">Powered By</h2>
        </div>

        <div className="marquee">
          <div className="marquee__content">
            {[...partners, ...partners].map((partner, i) => (
              <div key={i} className="partner-item">
                <img
                  src={partner.path}
                  alt={partner.name}
                  className="h-8 w-auto object-contain opacity-25 hover:opacity-60 transition-opacity duration-300"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
                <p className="font-body text-xs tracking-widest text-white/25 mt-3 uppercase">{partner.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section id="enter" className="py-32 border-t border-white/5">
        <div className="container mx-auto px-8 max-w-4xl text-center">
          <p className="section-label mb-6">Begin</p>
          <h2 className="font-display text-7xl font-light text-white/90 mb-8 leading-tight">
            Ready to Experience<br />the Future?
          </h2>
          <p className="font-body text-lg text-white/35 mb-14 max-w-xl mx-auto leading-relaxed font-light">
            Join thousands of creators already leveraging Flake AI to transform
            their ideas into reality.
          </p>

          <Link href="/auth" passHref>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary inline-flex items-center space-x-3 px-12 py-5 bg-[#c8a96e] text-[#08090d] font-body text-sm font-medium tracking-widest uppercase rounded-sm"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>

          <p className="font-body text-xs text-white/20 mt-8 tracking-wider">No commitment required · Free to start</p>
        </div>
      </Section>

      {/* ── FOOTER ── */}
      <footer className="py-12 border-t border-white/5">
        <div className="container mx-auto px-8 max-w-7xl flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <FaSnowflake className="w-4 h-4 text-[#c8a96e]" />
            <span className="font-display text-lg font-light tracking-widest text-white/50">FLAKE AI</span>
          </div>
          <div className="text-center md:text-right">
            <p className="font-body text-xs text-white/25 tracking-wider">
              &copy; {new Date().getFullYear()} Flake AI. All rights reserved.
            </p>
            <p className="font-body text-xs text-white/15 mt-1 tracking-wider">
              Built with precision for the future of AI interaction.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IntegratedFlakeHomePage;