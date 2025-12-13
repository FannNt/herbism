"use client"

import Navbar from "./Navbar"

interface MainLayoutProps {
  children: React.ReactNode
  hideNavbar?: boolean
  withNavbarPadding?: boolean
  className?: string
}

export default function MainLayout({ 
  children, 
  hideNavbar = false,
  withNavbarPadding = true,
  className = ""
}: MainLayoutProps) {
  return (
    <>
      {/* Navbar */}
      {!hideNavbar && <Navbar />}
      
      {/* Main Content */}
      <main 
        className={`
          min-h-screen
          ${withNavbarPadding && !hideNavbar ? 'pt-0 md:pt-22 pb-24 md:pb-0' : ''}
          ${className}
        `}
      >
        {children}
      </main>
    </>
  )
}
