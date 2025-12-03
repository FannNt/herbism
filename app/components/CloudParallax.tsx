// "use client"

// import { motion, useScroll, useTransform } from "framer-motion"
// import { useEffect, useState } from "react"

// type TherapyMode = "default" | "calm" | "energy" | "balance" | "healing"

// interface CloudParallaxProps {
//   mode: TherapyMode
// }

// const cloudColors = {
//   default: { primary: "#6ee7b7", secondary: "#a7f3d0", light: "#d1fae5" },
//   calm: { primary: "#93c5fd", secondary: "#bfdbfe", light: "#dbeafe" },
//   energy: { primary: "#fdba74", secondary: "#fcd34d", light: "#fef3c7" },
//   balance: { primary: "#d8b4fe", secondary: "#e9d5ff", light: "#f3e8ff" },
//   healing: { primary: "#5eead4", secondary: "#99f6e4", light: "#ccfbf1" },
// }

// export default function CloudParallax({ mode }: CloudParallaxProps) {
//   const [isLoaded, setIsLoaded] = useState(false)
//   const { scrollY } = useScroll()

//   // Horizontal parallax transforms
//   const xLeft = useTransform(scrollY, [0, 1000], [0, -300])   // Move left
//   const xRight = useTransform(scrollY, [0, 1000], [0, 300])   // Move right

//   useEffect(() => {
//     const timer = setTimeout(() => setIsLoaded(true), 100)
//     return () => clearTimeout(timer)
//   }, [])

//   const colors = cloudColors[mode]

//   // Awan 1 (kanan dan kiri)
//   const awan1Clouds = [
//     // Kiri
//     { x: "-5%", transform: xLeft, scale: 0.45, color: colors.primary, delay: 0.1, floatY: [0, -15, 0], duration: 6 },
//     { x: "8%", transform: xLeft, scale: 0.35, color: colors.light, delay: 0.3, floatY: [0, -10, 0], duration: 5 },
//     // // Kiri
//     // { x: "5%", transform: xLeft, scale: 0.45, color: colors.primary, delay: 0.1, floatY: [0, -15, 0], duration: 6 },
//     // { x: "15%", transform: xLeft, scale: 0.35, color: colors.light, delay: 0.3, floatY: [0, -10, 0], duration: 5 },
    
//     // // // Kanan
//     // // { x: "18%", transform: xRight, scale: 0.4, color: colors.secondary, delay: 0.2, floatY: [0, -12, 0], duration: 5.5 },
//     // // { x: "28%", transform: xRight, scale: 0.35, color: colors.light, delay: 0.4, floatY: [0, -8, 0], duration: 6.5 },

//     // // // Kanan
//     // // { x: "28%", transform: xRight, scale: 0.4, color: colors.secondary, delay: 0.2, floatY: [0, -12, 0], duration: 5.5 },
//     // // { x: "38%", transform: xRight, scale: 0.35, color: colors.light, delay: 0.4, floatY: [0, -8, 0], duration: 6.5 },

//     // // // Kanan
//     // // { x: "38%", transform: xRight, scale: 0.4, color: colors.secondary, delay: 0.2, floatY: [0, -12, 0], duration: 5.5 },
//     // // { x: "48%", transform: xRight, scale: 0.35, color: colors.light, delay: 0.4, floatY: [0, -8, 0], duration: 6.5 },

//     // // // Kanan
//     // // { x: "58%", transform: xRight, scale: 0.4, color: colors.secondary, delay: 0.2, floatY: [0, -12, 0], duration: 5.5 },
//     // // { x: "68%", transform: xRight, scale: 0.35, color: colors.light, delay: 0.4, floatY: [0, -8, 0], duration: 6.5 },
//   ]

//   // Awan 2 (tengah) - banyak
//   const awan2Clouds = [
//     { x: "18%", transform: xLeft, scale: 0.25, color: colors.secondary, delay: 0.15, floatY: [0, -8, 0], duration: 4.5 },
//     // { x: "28%", transform: xRight, scale: 0.22, color: colors.light, delay: 0.25, floatY: [0, -6, 0], duration: 5 },
//     // { x: "38%", transform: xLeft, scale: 0.28, color: colors.primary, delay: 0.35, floatY: [0, -10, 0], duration: 4.8 },
//     // { x: "48%", transform: xRight, scale: 0.24, color: colors.secondary, delay: 0.45, floatY: [0, -7, 0], duration: 5.2 },
//     // { x: "58%", transform: xLeft, scale: 0.26, color: colors.light, delay: 0.55, floatY: [0, -9, 0], duration: 4.6 },
//     // { x: "68%", transform: xRight, scale: 0.23, color: colors.primary, delay: 0.65, floatY: [0, -8, 0], duration: 5.4 },
//     // { x: "78%", transform: xLeft, scale: 0.27, color: colors.secondary, delay: 0.75, floatY: [0, -11, 0], duration: 4.9 },
//   ]

//   return (
//     <div className="w-full h-48 relative pointer-events-none z-10 overflow-hidden -mt-20">
//       {/* Awan 1 - Kanan dan Kiri */}
//       {awan1Clouds.map((cloud, index) => (
//         <motion.div
//           key={`awan1-${index}`}
//           style={{ 
//             x: cloud.transform,
//             left: cloud.x,
//           }}
//           className="absolute top-1/2 -translate-y-1/2"
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.5, y: 50 }}
//             animate={{ 
//               opacity: isLoaded ? 0.8 : 0,
//               scale: isLoaded ? cloud.scale : 0.5,
//               y: isLoaded ? cloud.floatY : 50,
//             }}
//             transition={{ 
//               opacity: { duration: 1, delay: cloud.delay },
//               scale: { duration: 1, delay: cloud.delay },
//               y: {
//                 repeat: Infinity,
//                 duration: cloud.duration,
//                 ease: "easeInOut",
//                 repeatType: "reverse",
//               },
//             }}
//           >
//             <Awan1SVG color={cloud.color} />
//           </motion.div>
//         </motion.div>
//       ))}

//       {/* Awan 2 - Tengah (sepanjang jalan) */}
//       {awan2Clouds.map((cloud, index) => (
//         <motion.div
//           key={`awan2-${index}`}
//           style={{ 
//             x: cloud.transform,
//             left: cloud.x,
//           }}
//           className="absolute top-1/2 -translate-y-1/2"
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.5, y: 50 }}
//             animate={{ 
//               opacity: isLoaded ? 0.75 : 0,
//               scale: isLoaded ? cloud.scale : 0.5,
//               y: isLoaded ? cloud.floatY : 50,
//             }}
//             transition={{ 
//               opacity: { duration: 1, delay: cloud.delay },
//               scale: { duration: 1, delay: cloud.delay },
//               y: {
//                 repeat: Infinity,
//                 duration: cloud.duration,
//                 ease: "easeInOut",
//                 repeatType: "reverse",
//               },
//             }}
//           >
//             <Awan2SVG color={cloud.color} />
//           </motion.div>
//         </motion.div>
//       ))}
//     </div>
//   )
// }

// // Awan 1 SVG Component (untuk kanan dan kiri)
// function Awan1SVG({ color }: { color: string }) {
//   return (
//     <svg 
//       width="832" 
//       height="496" 
//       viewBox="0 0 832 496" 
//       xmlns="http://www.w3.org/2000/svg"
//       preserveAspectRatio="xMidYMid meet"
//       style={{ background: 'transparent' }}
//     >
//       <path 
//         d="M79.7493 168.4C-36.7578 200.83 0.441571 304.614 33.6046 352.452C51.3861 348.093 100.367 363.371 154.039 459.352C207.711 555.333 335.89 437.667 393.271 366.836C423.489 421.539 516.193 520.485 645.267 478.64C774.341 436.795 822.536 331.747 830.5 284.454C802.355 272.249 746.785 227.898 749.665 148.132C752.545 68.3649 661.63 73.9224 615.813 86.672C552.65 95.6076 407.998 96.8063 334.69 30.1162C261.383 -36.5739 206.838 24.7767 188.729 63.7882C200.947 85.1465 196.256 135.97 79.7493 168.4Z" 
//         fill={color}
//         fillOpacity="0.85"
//       />
//     </svg>
//   )
// }

// // Awan 2 SVG Component (untuk tengah)
// function Awan2SVG({ color }: { color: string }) {
//   return (
//     <svg 
//       width="530" 
//       height="316" 
//       viewBox="0 0 530 316" 
//       xmlns="http://www.w3.org/2000/svg"
//       preserveAspectRatio="xMidYMid meet"
//       style={{ background: 'transparent' }}
//     >
//       <path 
//         d="M50.914 107.346C-23.2013 127.983 0.462831 194.027 21.5593 224.469C32.8709 221.695 64.0299 231.418 98.173 292.497C132.316 353.576 213.857 278.697 250.359 233.623C269.582 268.434 328.555 331.399 410.665 304.771C492.775 278.142 523.434 211.294 528.5 181.198C510.596 173.431 475.245 145.208 477.077 94.4473C478.909 43.6868 421.074 47.2234 391.928 55.3367C351.747 61.023 259.728 61.7858 213.093 19.3467C166.459 -23.0924 131.761 15.9488 120.241 40.7743C128.013 54.3659 125.029 86.7084 50.914 107.346Z" 
//         fill={color}
//         fillOpacity="0.8"
//       />
//     </svg>
//   )
// }
// sumpah tar dulu