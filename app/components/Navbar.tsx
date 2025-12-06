"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { logout } from "@/services/authService"
import { Home, MessageCircle, ScanLine, Sprout, Users, User, Leaf, ShieldAlert, LogOut, Settings } from "lucide-react"
import HerbismLogo from "./HerbismLogo"

export default function Navbar() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [showScanDropdown, setShowScanDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showMobileScanMenu, setShowMobileScanMenu] = useState(false)
  const [showMobileAkunMenu, setShowMobileAkunMenu] = useState(false)
  const { scrollY } = useScroll()
  const navbarOpacity = useTransform(scrollY, [0, 100], [0.95, 1])
  const { getThemeColors } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const desktopNavItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "konsultasi", label: "Konsultasi", icon: MessageCircle },
    { id: "scan", label: "Scan", icon: ScanLine, hasDropdown: true },
    { id: "rawat", label: "Rawat", icon: Sprout },
    { id: "wireless", label: "Wireless", icon: Users }
  ]

  const mobileNavLeft = [
    { id: "home", label: "Home", icon: Home },
    { id: "konsultasi", label: "Konsultasi", icon: MessageCircle }
  ]

  const mobileNavRight = [
    { id: "wireless", label: "Wireless", icon: Users },
    { id: "akun", label: "Akun", icon: User, hasDropdown: true }
  ]

  const centerFAB = { id: "scan", label: "Scan", icon: ScanLine, hasDropdown: true }

  const scanOptions = [
    { id: "scan-manfaat", label: "Scan Manfaat", icon: Leaf, description: "Identifikasi manfaat tanaman" },
    { id: "scan-penyakit", label: "Scan Penyakit", icon: ShieldAlert, description: "Diagnosa penyakit tanaman" }
  ]

  const akunOptions = [
    { id: "rawat", label: "Rawat Tanaman", icon: Sprout, description: "Kelola perawatan tanaman" },
    { id: "dashboard", label: "Dashboard Akun", icon: User, description: "Profil & pengaturan" }
  ]

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    setShowMobileScanMenu(false)
    setShowMobileAkunMenu(false)
  }

  const themeColors = getThemeColors()

  return (
    <>
      <motion.nav
        style={{ opacity: navbarOpacity }}
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-emerald-100/50"
            : "bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-11 md:h-22">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-1"
            >
              <div className="relative">
                <HerbismLogo 
                  color={themeColors.primary}
                  className="w-28 h-auto"
                />
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-1"
            >
              {desktopNavItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && setShowScanDropdown(true)}
                  onMouseLeave={() => item.hasDropdown && setShowScanDropdown(false)}
                >
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    onClick={() => !item.hasDropdown && scrollToSection(item.id)}
                    className="relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
                    style={{
                      color: activeSection === item.id ? "white" : isScrolled ? "#475569" : "#334155"
                    }}
                    onMouseEnter={(e) => {
                      if (activeSection !== item.id) {
                        e.currentTarget.style.color = themeColors.primary
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSection !== item.id) {
                        e.currentTarget.style.color = isScrolled ? "#475569" : "#334155"
                      }
                    }}
                  >
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute inset-0 bg-gradient-to-r ${themeColors.gradient} rounded-full shadow-lg`}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="text-base">{item.label}</span>
                    </span>
                  </motion.button>
                  {/* Dropdown Menu Desktop */}
                  {item.hasDropdown && (
                    <AnimatePresence>
                      {showScanDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-72 bg-white rounded-2xl shadow-2xl border-2 overflow-hidden"
                          style={{ borderColor: `${themeColors.primary}25` }}
                        >
                          {scanOptions.map((option, idx) => (
                            <motion.button
                              key={option.id}
                              onClick={() => scrollToSection(option.id)}
                              className="w-full px-5 py-4 flex items-start gap-4 transition-all duration-200"
                              whileHover={{ x: 6 }}
                              style={{
                                borderBottom: idx === 0 ? `1px solid ${themeColors.primary}15` : 'none',
                                backgroundColor: 'transparent'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${themeColors.primary}08`
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                              }}
                            >
                              <div 
                                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                                style={{ background: `${themeColors.primary}18` }}
                              >
                                <option.icon size={22} style={{ color: themeColors.primary }} strokeWidth={2} />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-sm font-semibold text-slate-900">{option.label}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{option.description}</div>
                              </div>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </motion.div>
            {/* Account Desktop */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
              onMouseEnter={() => user && setShowUserDropdown(true)}
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              {user ? (
                <>
                  {/* User Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-300"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {user.username || user.name || "User"}
                    </span>
                  </motion.button>
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-3 right-0 w-56 bg-white rounded-2xl shadow-2xl border-2 overflow-hidden"
                        style={{ borderColor: `${themeColors.primary}25` }}
                      >
                        <div className="p-4 border-b" style={{ borderColor: `${themeColors.primary}15` }}>
                          <p className="text-sm font-semibold text-slate-900">{user.name || user.username}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                        </div>                
                        <div className="p-2">
                          <Link href="/profile">
                            <motion.button
                              whileHover={{ x: 4 }}
                              className="w-full px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 hover:bg-slate-50"
                            >
                              <User size={18} className="text-slate-600" />
                              <span className="text-sm font-medium text-slate-700">Profil Saya</span>
                            </motion.button>
                          </Link>
                          
                          <motion.button
                            whileHover={{ x: 4 }}
                            onClick={async () => {
                              await logout()
                              router.push("/home")
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 hover:bg-red-50"
                          >
                            <LogOut size={18} className="text-red-600" />
                            <span className="text-sm font-medium text-red-600">Keluar</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                // Login/Register Buttons
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 border-2"
                      style={{
                        color: themeColors.primary,
                        borderColor: `${themeColors.primary}30`,
                        backgroundColor: `${themeColors.primary}08`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${themeColors.primary}15`
                        e.currentTarget.style.borderColor = `${themeColors.primary}50`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${themeColors.primary}08`
                        e.currentTarget.style.borderColor = `${themeColors.primary}30`
                      }}
                    >
                      Masuk
                    </motion.button>
                  </Link>
                  <Link href="/register">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 text-sm text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                    >
                      Daftar
                    </motion.button>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      >
        {/* Scan POPUP */}
        <AnimatePresence>
          {showMobileScanMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileScanMenu(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                style={{ bottom: '80px' }}
              />
              
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-white rounded-3xl shadow-2xl border overflow-hidden"
                style={{ borderColor: `${themeColors.primary}20` }}
              >
                <div className="p-2">
                  {scanOptions.map((option, idx) => (
                    <motion.button
                      key={option.id}
                      onClick={() => scrollToSection(option.id)}
                      className="w-full px-4 py-4 flex items-center gap-4 rounded-2xl transition-all duration-200"
                      whileTap={{ scale: 0.98 }}
                      style={{
                        background: idx === 0 ? `${themeColors.primary}08` : 'transparent'
                      }}
                    >
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ background: `linear-gradient(135deg, ${themeColors.primary}20, ${themeColors.secondary}20)` }}
                      >
                        <option.icon size={24} style={{ color: themeColors.primary }} strokeWidth={2} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold text-slate-900">{option.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{option.description}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Akun POP UP */}
        <AnimatePresence>
          {showMobileAkunMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileAkunMenu(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                style={{ bottom: '80px' }}
              />
              
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute bottom-20 right-4 w-[calc(100%-2rem)] max-w-xs bg-white rounded-3xl shadow-2xl border overflow-hidden"
                style={{ borderColor: `${themeColors.primary}20` }}
              >
                <div className="p-2">
                  {akunOptions.map((option, idx) => (
                    <motion.button
                      key={option.id}
                      onClick={() => scrollToSection(option.id)}
                      className="w-full px-4 py-4 flex items-center gap-4 rounded-2xl transition-all duration-200"
                      whileTap={{ scale: 0.98 }}
                      style={{
                        background: idx === 0 ? `${themeColors.primary}08` : 'transparent'
                      }}
                    >
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ background: `linear-gradient(135deg, ${themeColors.primary}20, ${themeColors.secondary}20)` }}
                      >
                        <option.icon size={24} style={{ color: themeColors.primary }} strokeWidth={2} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold text-slate-900">{option.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{option.description}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none" />
          
          <div className="relative bg-white/98 backdrop-blur-xl border-t-2 shadow-2xl" style={{ borderColor: `${themeColors.primary}20` }}>
            <div className="max-w-md mx-auto px-4 py-2">
              <div className="flex items-center justify-between relative">
                
                {/* Left Nav*/}
                <div className="flex items-center pr-12 flex-1 justify-around">
                  {mobileNavLeft.map((item, index) => {
                    const isActive = activeSection === item.id
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        onClick={() => {
                          setShowMobileScanMenu(false)
                          setShowMobileAkunMenu(false)
                          scrollToSection(item.id)
                        }}
                        whileTap={{ scale: 0.9 }}
                        className="relative flex flex-col items-center gap-1 py-2 px-3"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="mobileActiveTab"
                            className={`absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-gradient-to-r ${themeColors.gradient} rounded-full`}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        
                        <motion.div
                          animate={{
                            scale: isActive ? 1.1 : 1,
                            y: isActive ? -2 : 0
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className={`relative flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300 ${
                            isActive
                              ? `bg-gradient-to-br ${themeColors.gradient} shadow-lg`
                              : "bg-slate-100"
                          }`}
                        >
                          <item.icon 
                            className={`transition-all duration-300 ${
                              isActive ? "text-white" : "text-slate-600"
                            }`}
                            size={20}
                            strokeWidth={2.5}
                          />
                        </motion.div>
                        
                        <motion.span
                          animate={{
                            fontWeight: isActive ? 600 : 500
                          }}
                          className="text-[9px] leading-tight text-center transition-colors duration-300"
                          style={{
                            color: isActive ? themeColors.primary : "#64748b"
                          }}
                        >
                          {item.label}
                        </motion.span>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Center FAB - Scan Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                  onClick={() => {
                    setShowMobileAkunMenu(false)
                    setShowMobileScanMenu(!showMobileScanMenu)
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute left-1/2 -translate-x-1/2 -top-6 z-10"
                >
                  <motion.div
                    animate={{
                      rotate: showMobileScanMenu ? 45 : 0,
                      scale: showMobileScanMenu ? 1.05 : 1
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` 
                    }}
                  >
                    <ScanLine className="text-white" size={24} strokeWidth={2.5} />
                  </motion.div>
                  <span 
                    className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-medium whitespace-nowrap"
                    style={{ color: themeColors.primary }}
                  >
                    Scan
                  </span>
                </motion.button>

                {/* Right Nav */}
                <div className="flex items-center gap-2 flex-1 justify-around">
                  {mobileNavRight.map((item, index) => {
                    const isActive = activeSection === item.id
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * (index + 2) }}
                        onClick={() => {
                          if (item.hasDropdown) {
                            setShowMobileScanMenu(false)
                            setShowMobileAkunMenu(!showMobileAkunMenu)
                          } else {
                            setShowMobileScanMenu(false)
                            setShowMobileAkunMenu(false)
                            scrollToSection(item.id)
                          }
                        }}
                        whileTap={{ scale: 0.9 }}
                        className="relative flex flex-col items-center gap-1 py-2 px-3"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="mobileActiveTab"
                            className={`absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-gradient-to-r ${themeColors.gradient} rounded-full`}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        
                        <motion.div
                          animate={{
                            scale: isActive ? 1.1 : showMobileAkunMenu && item.hasDropdown ? 1.1 : 1,
                            y: isActive ? -2 : 0
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className={`relative flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300 ${
                            isActive
                              ? `bg-gradient-to-br ${themeColors.gradient} shadow-lg`
                              : showMobileAkunMenu && item.hasDropdown
                              ? "bg-slate-200"
                              : "bg-slate-100"
                          }`}
                        >
                          <item.icon 
                            className={`transition-all duration-300 ${
                              isActive ? "text-white" : "text-slate-600"
                            }`}
                            size={20}
                            strokeWidth={2.5}
                          />
                        </motion.div>
                        
                        <motion.span
                          animate={{
                            fontWeight: isActive ? 600 : 500
                          }}
                          className="text-[9px] leading-tight text-center transition-colors duration-300"
                          style={{
                            color: isActive ? themeColors.primary : "#64748b"
                          }}
                        >
                          {item.label}
                        </motion.span>
                      </motion.button>
                    )
                  })}
                </div>

              </div>
            </div>
          </div>
        </div>
      </motion.nav>


    </>
  )
}
