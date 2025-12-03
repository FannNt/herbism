"use client"

import { motion, useTransform, useMotionValue } from "framer-motion"
import { useEffect, useState } from "react"

type TherapyMode = "default" | "calm" | "energy" | "balance" | "healing"

interface GrassParallaxProps {
  mode: TherapyMode
}

const leafColors = {
  default: { primary: "#10b981", secondary: "#059669", dark: "#047857" },
  calm: { primary: "#3b82f6", secondary: "#2563eb", dark: "#1d4ed8" },
  energy: { primary: "#f97316", secondary: "#ea580c", dark: "#dc2626" },
  balance: { primary: "#a855f7", secondary: "#9333ea", dark: "#7c3aed" },
  healing: { primary: "#14b8a6", secondary: "#0d9488", dark: "#0891b2" },
}

export default function GrassParallax({ mode }: GrassParallaxProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const scrollY = useMotionValue(0)

  // Manual scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      scrollY.set(window.scrollY)
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrollY])


  const xLeft1 = useTransform(scrollY, [0, 500], [0, -150])   
  const xLeft2 = useTransform(scrollY, [0, 500], [0, -250])   
  const xLeft3 = useTransform(scrollY, [0, 500], [0, -350])   
  
  const xRight1 = useTransform(scrollY, [0, 500], [0, 150])   
  const xRight2 = useTransform(scrollY, [0, 500], [0, 250])   
  const xRight3 = useTransform(scrollY, [0, 500], [0, 350])   

  // Center leaves - minimal movement
  const xCenter1 = useTransform(scrollY, [0, 500], [0, -30])
  const xCenter2 = useTransform(scrollY, [0, 500], [0, 0])
  const xCenter3 = useTransform(scrollY, [0, 500], [0, 30])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const colors = leafColors[mode]


  const leaves = [
    { x: "0%", offset: 0, size: 200, rotation: -15, color: colors.dark, xLayer: xLeft3, delay: 0.1 },
    { x: "5%", offset: 10, size: 170, rotation: -20, color: colors.primary, xLayer: xLeft3, delay: 0.2 },
    { x: "8%", offset: 5, size: 150, rotation: -10, color: colors.secondary, xLayer: xLeft2, delay: 0.3 },
    
    // Left quarter
    { x: "15%", offset: 0, size: 180, rotation: -12, color: colors.primary, xLayer: xLeft2, delay: 0.15 },
    { x: "20%", offset: 8, size: 160, rotation: -18, color: colors.dark, xLayer: xLeft2, delay: 0.25 },
    { x: "25%", offset: 0, size: 190, rotation: -8, color: colors.secondary, xLayer: xLeft1, delay: 0.35 },
    
    // Center left
    { x: "32%", offset: 5, size: 175, rotation: -5, color: colors.primary, xLayer: xLeft1, delay: 0.2 },
    { x: "38%", offset: 0, size: 185, rotation: -10, color: colors.dark, xLayer: xLeft1, delay: 0.3 },
    
    // Center - minimal horizontal movement
    { x: "45%", offset: 0, size: 200, rotation: 0, color: colors.primary, xLayer: xCenter1, delay: 0.25 },
    { x: "50%", offset: 8, size: 195, rotation: 3, color: colors.dark, xLayer: xCenter2, delay: 0.35 },
    { x: "55%", offset: 0, size: 185, rotation: -3, color: colors.secondary, xLayer: xCenter3, delay: 0.4 },
    
    // Center right
    { x: "62%", offset: 5, size: 175, rotation: 5, color: colors.primary, xLayer: xRight1, delay: 0.3 },
    { x: "68%", offset: 0, size: 190, rotation: 8, color: colors.dark, xLayer: xRight1, delay: 0.45 },
    
    // Right quarter
    { x: "75%", offset: 0, size: 180, rotation: 12, color: colors.secondary, xLayer: xRight1, delay: 0.35 },
    { x: "80%", offset: 8, size: 160, rotation: 18, color: colors.primary, xLayer: xRight2, delay: 0.5 },
    { x: "85%", offset: 0, size: 170, rotation: 10, color: colors.dark, xLayer: xRight2, delay: 0.4 },
    
    // Far right
    { x: "92%", offset: 5, size: 150, rotation: 10, color: colors.secondary, xLayer: xRight2, delay: 0.55 },
    { x: "95%", offset: 10, size: 170, rotation: 20, color: colors.primary, xLayer: xRight3, delay: 0.6 },
    { x: "100%", offset: 0, size: 200, rotation: 15, color: colors.dark, xLayer: xRight3, delay: 0.5 },
  ]

  return (
    <div className="absolute bottom-0 left-0 w-full h-64 pointer-events-none z-0 overflow-hidden">
      {leaves.map((leaf, index) => (
        <motion.div
          key={index}
          style={{ 
            x: leaf.xLayer,  // Horizontal parallax ONLY
            left: leaf.x,
            bottom: `${leaf.offset}px`,
          }}
          className="absolute pointer-events-none"
        >
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ 
              y: isLoaded ? 0 : 100, 
              opacity: isLoaded ? (0.7 + Math.random() * 0.3) : 0,
              scale: isLoaded ? 1 : 0.8,
              rotate: isLoaded ? [0, 2, -2, 0] : 0,  // Slight rotation
            }}
            transition={{ 
              duration: 1.2, 
              delay: leaf.delay, 
              type: "spring", 
              stiffness: 50,
              damping: 20,
              rotate: {
                repeat: Infinity,
                duration: 2.5 + Math.random() * 1.5,
                ease: "easeInOut",
              },
            }}
          >
            <PalmLeaf 
              color={leaf.color} 
              rotation={leaf.rotation} 
              size={leaf.size}
              flip={parseFloat(leaf.x) > 50}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}



interface PalmLeafProps {
  color: string
  rotation: number
  size: number
  flip?: boolean
}

function PalmLeaf({ color, rotation, size, flip = false }: PalmLeafProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{
        transform: `rotate(${rotation}deg) ${flip ? 'scaleX(-1)' : ''}`,
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
      }}
    >
      <defs>
        <linearGradient id={`palmGradient-${color}-${rotation}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="50%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Main stem */}
      <path
        d="M 100 180 Q 95 140, 90 100 Q 88 60, 85 20"
        stroke={color}
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />

      {/* Left leaves */}
      <g>
        {/* Leaf 1 - bottom left */}
        <path
          d="M 90 160 Q 60 155, 30 150 Q 20 148, 15 145"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="35"
          cy="150"
          rx="25"
          ry="8"
          fill={`url(#palmGradient-${color}-${rotation})`}
          opacity="0.85"
          transform="rotate(-10 35 150)"
        />

        {/* Leaf 2 */}
        <path
          d="M 90 140 Q 55 138, 25 135"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="30"
          cy="135"
          rx="28"
          ry="9"
          fill={`url(#palmGradient-${color}-${rotation})`}
          opacity="0.9"
          transform="rotate(-8 30 135)"
        />

        {/* Leaf 3 */}
        <path
          d="M 89 120 Q 52 120, 20 118"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="25"
          cy="118"
          rx="30"
          ry="10"
          fill={`url(#palmGradient-${color}-${rotation})`}
          opacity="0.95"
          transform="rotate(-5 25 118)"
        />

        {/* Leaf 4 */}
        <path
          d="M 88 100 Q 50 102, 18 100"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="20"
          cy="100"
          rx="32"
          ry="11"
          fill={`url(#palmGradient-${color}-${rotation})`}
          opacity="1"
          transform="rotate(-3 20 100)"
        />

        {/* Leaf 5 */}
        <path
          d="M 88 80 Q 52 85, 20 82"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="22"
          cy="82"
          rx="30"
          ry="10"
          fill={`url(#palmGradient-${color}-${rotation})`}
          opacity="0.95"
          transform="rotate(0 22 82)"
        />

        {/* Leaf 6 */}
        <path
          d="M 87 60 Q 55 68, 25 65"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="28"
          cy="65"
          rx="28"
          ry="9"
          fill={`url(#palmGradient-${color}-${rotation})`}
          opacity="0.9"
          transform="rotate(3 28 65)"
        />

        {/* Leaf 7 - top left */}
        <path
          d="M 86 40 Q 60 50, 35 48"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="38"
          cy="48"
          rx="25"
          ry="8"
          fill={`url(#palmGradient-${color}-${rotation})`}
          opacity="0.85"
          transform="rotate(5 38 48)"
        />
      </g>

      {/* Right leaves */}
      <g>
        {/* Leaf 1 - bottom right */}
        <path
          d="M 90 160 Q 120 155, 150 150 Q 160 148, 165 145"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="145"
          cy="150"
          rx="25"
          ry="8"
          fill={`url(#palmGradient-${color}-${rotation})`}
          opacity="0.85"
          transform="rotate(10 145 150)"
        />

        {/* Leaf 2 */}
        <path
          d="M 90 140 Q 125 138, 155 135"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="150"
          cy="135"
          rx="28"
          ry="9"
          fill={`url(#palmGradient-${color}-${rotation})`}
          opacity="0.9"
          transform="rotate(8 150 135)"
        />

        {/* Leaf 3 */}
        <path
          d="M 89 120 Q 128 120, 160 118"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="155"
          cy="118"
          rx="30"
          ry="10"
          fill={`url(#palmGradient-${color}-${rotation})`}
          opacity="0.95"
          transform="rotate(5 155 118)"
        />

        {/* Leaf 4 */}
        <path
          d="M 88 100 Q 130 102, 162 100"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="160"
          cy="100"
          rx="32"
          ry="11"
          fill={`url(#palmGradient-${color}-${rotation})`}
          opacity="1"
          transform="rotate(3 160 100)"
        />

        {/* Leaf 5 */}
        <path
          d="M 88 80 Q 128 85, 160 82"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="158"
          cy="82"
          rx="30"
          ry="10"
          fill={`url(#palmGradient-${color}-${rotation})`}
          opacity="0.95"
          transform="rotate(0 158 82)"
        />

        {/* Leaf 6 */}
        <path
          d="M 87 60 Q 125 68, 155 65"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="152"
          cy="65"
          rx="28"
          ry="9"
          fill={`url(#palmGradient-${color}-${rotation})`}
          opacity="0.9"
          transform="rotate(-3 152 65)"
        />

        {/* Leaf 7 - top right */}
        <path
          d="M 86 40 Q 120 50, 145 48"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="142"
          cy="48"
          rx="25"
          ry="8"
          fill={`url(#palmGradient-${color}-${rotation})`}
          opacity="0.85"
          transform="rotate(-5 142 48)"
        />
      </g>
    </svg>
  )
}
