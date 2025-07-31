
"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Helper function for smooth scrolling (optional, but good for UX)
const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 80, // Adjust for sticky header height
      behavior: 'smooth',
    });
  }
};

const FlakeHomePage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [headerShrunk, setHeaderShrunk] = useState(false);

  // Refs for sections to trigger animations based on visibility
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const partnersRef = useRef(null); // Ref for partners section
  const ctaRef = useRef(null);

  // State for section visibility
  const [aboutVisible, setAboutVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [partnersVisible, setPartnersVisible] = useState(false); // State for partners section
  const [ctaVisible, setCtaVisible] = useState(false);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);

    // Header shrink logic
    setHeaderShrunk(currentScrollY > 80); // Shrink header after scrolling 80px

    // Intersection Observer for section animations
    const checkVisibility = (entries) => {
      entries.forEach(entry => {
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

    // Create a single observer instance and reuse it
    const observer = new IntersectionObserver(checkVisibility, {
      threshold: 0.2, // Trigger when 20% of the element is visible
    });

    // Observe all relevant sections
    if (aboutRef.current) observer.observe(aboutRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (partnersRef.current) observer.observe(partnersRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    // The cleanup is handled in the useEffect return function,
    // so no need to return a disconnect function here.
  }, []); // Dependencies are stable, so useCallback is effective

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Initial check for visibility on mount
    handleScroll();

    // Cleanup function for the effect
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Disconnect all observers when the component unmounts
      const observer = new IntersectionObserver(() => {}, { threshold: 0.2 }); // Dummy callback for disconnecting
      if (aboutRef.current) observer.unobserve(aboutRef.current);
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (partnersRef.current) observer.unobserve(partnersRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
      observer.disconnect();
    };
  }, [handleScroll]);

  // Calculate logo letter transformations based on scrollY
  const getLetterTransform = (index) => {
    const baseOffset = scrollY * 0.3; // Adjust sensitivity
    let translateX = 0;
    let translateY = 0;
    let rotate = 0;

    switch (index) {
      case 0: // F
        translateX = -baseOffset * 0.5;
        translateY = -baseOffset * 0.3;
        rotate = -baseOffset * 0.05;
        break;
      case 1: // L
        translateX = baseOffset * 0.2;
        translateY = -baseOffset * 0.4;
        rotate = baseOffset * 0.03;
        break;
      case 2: // A
        translateX = -baseOffset * 0.1;
        translateY = baseOffset * 0.2;
        rotate = -baseOffset * 0.02;
        break;
      case 3: // K
        translateX = baseOffset * 0.4;
        translateY = baseOffset * 0.1;
        rotate = baseOffset * 0.04;
        break;
      case 4: // E
        translateX = -baseOffset * 0.3;
        translateY = baseOffset * 0.3;
        rotate = -baseOffset * 0.06;
        break;
      default:
        break;
    }

    return {
      transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`,
      opacity: Math.max(0.2, 1 - scrollY / 500), // Fade out slightly
      transition: 'transform 0.1s ease-out, opacity 0.1s ease-out', // Smooth transition for scroll
    };
  };

  // Partner logos data with real trademark URLs
  const partners = [
    { name: 'React', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
    { name: 'Next.js', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg' },
    { name: 'Hugging Face', logo: 'https://huggingface.co/front/assets/huggingface_logo.svg' },
    { name: 'Google Cloud AI', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Google_Cloud_logo.svg' },
    { name: 'Azure AI', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure_Logo.svg' },
    { name: 'AWS AI', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
    { name: 'OpenAI', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1200px-OpenAI_Logo.svg.png' },
    { name: 'Orender', logo: 'https://www.orender.com/wp-content/uploads/2023/07/orender_logo_1000px.png' }, // Placeholder, actual logo might be different
    { name: 'Grok', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Grok_Logo.svg/1200px-Grok_Logo.svg.png' },
    { name: 'Groq', logo: 'https://groq.com/wp-content/uploads/2023/11/groq-logo-dark.svg' },
    { name: 'VSCode', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg' },
    { name: 'Claude AI', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Claude_AI_logo.svg/1200px-Claude_AI_logo.svg.png' },
    { name: 'Copilot', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/GitHub_Copilot_logo.svg/1200px-GitHub_Copilot_logo.svg.png' },
    { name: 'Gemini', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Google_Gemini_logo.svg/1200px-Google_Gemini_logo.svg.png' },
  ];

  return (
    <div className="font-inter bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen text-gray-800">
      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
          headerShrunk
            ? 'bg-white shadow-lg py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <nav className="container mx-auto flex justify-between items-center px-6">
          <div className="text-2xl font-bold text-indigo-600">Flake</div>
          <ul className="flex space-x-6">
            <li>
              <button
                onClick={() => scrollToSection('hero')}
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
              >
                Features
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('partners')}
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
              >
                Partners
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
              >
                Contact
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Parallax Background Element */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://placehold.co/1920x1080/E0F2F7/2C5282?text=Flake+Background)`,
            transform: `translateY(${scrollY * 0.2}px)`, // Parallax effect
            transition: 'transform 0.1s ease-out',
          }}
        ></div>

        <div className="relative z-10 text-center">
          <h1 className="text-8xl md:text-9xl font-extrabold text-white drop-shadow-lg mb-8">
            {'FLAKE'.split('').map((char, index) => (
              <span
                key={index}
                style={getLetterTransform(index)}
                className="inline-block"
              >
                {char}
              </span>
            ))}
          </h1>
          <p className="text-white text-xl md:text-2xl max-w-2xl mx-auto drop-shadow-md">
            Unleash the power of effortless creation with Flake.
            Experience seamless design and unparalleled performance.
          </p>
          <button className="mt-10 px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105">
            Discover Flake
          </button>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        ref={aboutRef}
        className={`py-20 bg-white shadow-inner transform transition-all duration-1000 ease-out ${
          aboutVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-4xl font-bold text-indigo-700 mb-8">
            About Flake
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Flake is more than just a platform; it's a philosophy. We believe
            in empowering creators with tools that are intuitive, powerful,
            and beautifully designed. Our mission is to simplify complex
            processes, allowing you to focus on what truly matters: bringing
            your ideas to life. From robust backend solutions to stunning
            frontend experiences, Flake provides a comprehensive ecosystem
            tailored for modern development.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            Join a community of innovators and experience the next generation
            of digital creation. With Flake, your imagination is the only limit.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={featuresRef}
        className={`py-20 bg-gradient-to-br from-blue-50 to-indigo-100 transform transition-all duration-1000 ease-out ${
          featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-indigo-700 text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="text-indigo-500 text-5xl mb-4">✨</div> {/* Placeholder icon */}
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Intuitive Interface
              </h3>
              <p className="text-gray-700">
                Designed for simplicity, Flake's interface allows you to
                navigate and create with unparalleled ease.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="text-indigo-500 text-5xl mb-4">🚀</div> {/* Placeholder icon */}
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Blazing Fast Performance
              </h3>
              <p className="text-gray-700">
                Experience lightning-fast load times and smooth operations,
                even with complex projects.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="text-indigo-500 text-5xl mb-4">🔗</div> {/* Placeholder icon */}
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Seamless Integrations
              </h3>
              <p className="text-gray-700">
                Connect with your favorite tools and services effortlessly,
                expanding your workflow capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section
        id="partners"
        ref={partnersRef}
        className={`py-20 bg-white shadow-inner transform transition-all duration-1000 ease-out ${
          partnersVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-indigo-700 mb-12">
            Our Valued Partners
          </h2>
          <div className="relative h-32 overflow-hidden">
            <div className="absolute inset-0 flex flex-row items-center animate-horizontal-scroll whitespace-nowrap">
              {partners.map((partner, index) => (
                <div key={index} className="flex flex-col items-center p-4 flex-shrink-0 w-48">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-20 object-contain"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/CCCCCC/000000?text=Logo"; }}
                  />
                  <p className="mt-2 text-lg font-semibold text-gray-800">{partner.name}</p>
                </div>
              ))}
              {/* Duplicate partners to create a seamless loop */}
              {partners.map((partner, index) => (
                <div key={`dup-${index}`} className="flex flex-col items-center p-4 flex-shrink-0 w-48">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-20 object-contain"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/CCCCCC/000000?text=Logo"; }}
                  />
                  <p className="mt-2 text-lg font-semibold text-gray-800">{partner.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        id="contact"
        ref={ctaRef}
        className={`py-20 bg-indigo-600 text-white text-center transform transition-all duration-1000 ease-out ${
          ctaVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Build Something Amazing?</h2>
          <p className="text-xl mb-10">
            Join the Flake community today and transform your ideas into reality.
          </p>
          <button className="px-10 py-5 bg-white text-indigo-600 text-xl font-bold rounded-full shadow-xl hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:scale-105">
            Get Started with Flake
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-800 text-white text-center text-sm">
        <div className="container mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} Flake. All rights reserved.</p>
          <p className="mt-2">
            Built with ❤️ by Gemini for an astounding web experience.
          </p>
        </div>
      </footer>

      {/* Custom CSS for horizontal scrolling animation */}
      <style jsx>{`
        @keyframes horizontal-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%); /* Scrolls left half the width to loop seamlessly */
          }
        }

        .animate-horizontal-scroll {
          animation: horizontal-scroll 30s linear infinite; /* Adjust duration for speed */
        }
      `}</style>
    </div>
  );
};

export default FlakeHomePage;
