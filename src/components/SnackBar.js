'use client'
import { useEffect, useState } from 'react'

export default function FancySnackbar({ message, visible, type = 'info', duration = 4000 }) {
  const [show, setShow] = useState(false)
  const [progress, setProgress] = useState(100)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (visible && message) {
      setShow(true)
      setProgress(100)
      setIsExiting(false)
      
      // Progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 50))
          return newProgress <= 0 ? 0 : newProgress
        })
      }, 50)
      
      // Hide animation
      const hideTimeout = setTimeout(() => {
        setIsExiting(true)
        setTimeout(() => setShow(false), 300)
      }, duration - 300)
      
      return () => {
        clearInterval(progressInterval)
        clearTimeout(hideTimeout)
      }
    }
  }, [message, visible, duration])

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-emerald-500 to-teal-600',
          shadow: 'shadow-emerald-500/25',
          icon: '✓',
          accent: 'bg-emerald-300'
        }
      case 'error':
        return {
          bg: 'from-red-500 to-rose-600',
          shadow: 'shadow-red-500/25',
          icon: '✕',
          accent: 'bg-red-300'
        }
      case 'warning':
        return {
          bg: 'from-amber-500 to-orange-600',
          shadow: 'shadow-amber-500/25',
          icon: '⚠',
          accent: 'bg-amber-300'
        }
      default:
        return {
          bg: 'from-blue-500 to-indigo-600',
          shadow: 'shadow-blue-500/25',
          icon: 'ℹ',
          accent: 'bg-blue-300'
        }
    }
  }

  const styles = getTypeStyles()

  if (!show && !isExiting) return null

  return (
    <div className={`
      fixed top-6 right-6 z-50
      transform transition-all duration-500 ease-out
      ${!show 
        ? 'translate-x-full opacity-0 scale-95' 
        : isExiting 
          ? 'translate-x-full opacity-0 scale-95' 
          : 'translate-x-0 opacity-100 scale-100'
      }
    `}>
      <div className={`
        relative overflow-hidden
        bg-gradient-to-r ${styles.bg}
        backdrop-blur-lg
        rounded-2xl shadow-2xl ${styles.shadow}
        min-w-80 max-w-96
        transform hover:scale-105 transition-transform duration-200
      `}>
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        
        {/* Content */}
        <div className="relative p-5 pr-12">
          <div className="flex items-start gap-3">
            {/* Animated icon */}
            <div className={`
              flex-shrink-0 w-8 h-8 rounded-full
              bg-white/20 backdrop-blur-sm
              flex items-center justify-center text-white font-bold
              animate-pulse hover:animate-bounce
            `}>
              {styles.icon}
            </div>
            
            {/* Message */}
            <div className="flex-1">
              <p className="text-white font-medium leading-relaxed text-sm">
                {message}
              </p>
            </div>
          </div>
        </div>
        
        {/* Close button */}
        <button
          onClick={() => {
            setIsExiting(true)
            setTimeout(() => setShow(false), 300)
          }}
          className="
            absolute top-3 right-3 w-6 h-6
            bg-white/20 hover:bg-white/30
            rounded-full flex items-center justify-center
            text-white text-xs font-bold
            transition-colors duration-200
            hover:scale-110 active:scale-95
          "
        >
          ×
        </button>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div 
            className={`h-full ${styles.accent} transition-all duration-75 ease-linear`}
            style={{ width: `${progress}%` }}
          >
            {/* Animated shimmer effect */}
            <div className="
              w-full h-full relative overflow-hidden
              before:absolute before:inset-0
              before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent
              before:translate-x-[-100%] before:animate-pulse
            "></div>
          </div>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="
                absolute w-1 h-1 bg-white/30 rounded-full
                animate-ping
              "
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}