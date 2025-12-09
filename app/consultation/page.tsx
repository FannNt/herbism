"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ChevronLeft, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  BookOpen,
  Loader2,
  ArrowRight,
  Leaf,
  Save,
  Check
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Frontend-only types
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  relatedPlants?: string[];
  recipe?: {
    title: string;
    ingredients: string[];
    steps: string[];
    purpose: string;
  };
};

export default function ConsultationPage() {
  const router = useRouter();
  const { getThemeColors } = useTheme();
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savingRecipeId, setSavingRecipeId] = useState<string | null>(null);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Halo! Saya Erbis, asisten herbal Anda. Apa keluhan kesehatan yang Anda rasakan hari ini? Saya akan mencarikan solusi obat herbal berdasarkan tanaman yang Anda miliki.",
      timestamp: new Date(),
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Mock AI Response Logic (Frontend Only)
    setTimeout(() => {
        let responseContent = "";
        let recipe = undefined;
        let relatedPlants: string[] = [];
        
        // Simple extraction of purpose from input for demo
        const purpose = userMessage.content.length > 20 
            ? userMessage.content.substring(0, 30) + "..." 
            : userMessage.content;
            
        // Mocked Random Plant
        const randomPlants = ["Daun Sirih", "Jahe Merah", "Kunyit", "Lidah Buaya", "Temulawak"];
        const randomPlant = randomPlants[Math.floor(Math.random() * randomPlants.length)];
        relatedPlants = [randomPlant];
        
        responseContent = `Berdasarkan dashboard Anda, saya melihat Anda memiliki tanaman **${randomPlant}**. Tanaman ini sangat bagus untuk meredakan gejala yang Anda sebutkan.`;
        
        recipe = {
            title: `Racikan ${randomPlant} Obat Alami`,
            purpose: `Mengobati ${purpose}`,
            ingredients: [
            `3 ruas ${randomPlant}`,
            "2 gelas air",
            "Madu secukupnya",
            "Sedikit perasan jeruk nipis"
            ],
            steps: [
            `Cuci bersih ${randomPlant} dan geprek hingga memar.`,
            "Rebus air hingga mendidih.",
            `Masukkan ${randomPlant} ke dalam air mendidih.`,
            "Tunggu hingga air menyusut menjadi 1 gelas.",
            "Saring air rebusan ke dalam gelas.",
            "Tambahkan madu dan jeruk nipis selagi hangat."
            ]
        };

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: responseContent,
          timestamp: new Date(),
          relatedPlants: relatedPlants,
          recipe: recipe
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      }, 2000); 
  };

  const handleSaveRecipe = (messageId: string) => {
    // Frontend Only Mock Save
    setSavingRecipeId(messageId);
    
    setTimeout(() => {
        setSavedRecipeIds(prev => new Set(prev).add(messageId));
        setSavingRecipeId(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center">
            <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push("/profile")}
                  className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-600" />
                </button>
                <div>
                   <h1 className="text-xl font-bold text-slate-900">Konsultasi Kesehatan</h1>
                   <p className="text-xs sm:text-sm text-slate-500">Beri tahu kami tentang keluhanmu</p>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-7xl h-[80vh] lg:h-[85vh] grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Panel - Mascot & Info (Bento Style) */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
                {/* Mascot Card */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden relative group p-8 flex flex-col items-center justify-center text-center"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none" />
                    
                    <div className="relative w-64 h-64 mb-6 transition-transform duration-500 group-hover:scale-105">
                        <div className="absolute inset-0 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
                        <Image 
                            src="/Erbis.jpg" 
                            alt="Erbis Mascot" 
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Halo, Saya Erbis!</h2>
                    <p className="text-slate-500 leading-relaxed max-w-xs">
                        Teman pintar tanaman Anda. Ceritakan keluhan Anda, dan saya akan buatkan racikan herbal spesial dari kebun Anda.
                    </p>
                    
                    <div className="mt-8 flex gap-3 flex-wrap justify-center">
                        {["Flu & Batuk", "Masuk Angin", "Sakit Kepala", "Insomnia"].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setInput(`Saya merasa ${tag.toLowerCase()}`)}
                                className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium hover:bg-emerald-100 transition-colors border border-emerald-100"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right Panel - Chat Interface */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="col-span-1 lg:col-span-8 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col overflow-hidden relative"
            >
                {/* Mobile Header with Mascot Thumb */}
                <div className="lg:hidden p-4 border-b border-slate-100 bg-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 relative">
                        <Image src="/Erbis.jpg" alt="Erbis" fill className="object-cover" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Erbis AI</h3>
                        <p className="text-xs text-slate-500">Online</p>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth custom-scrollbar">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                                msg.role === "assistant" 
                                ? "bg-slate-50 border border-slate-100 overflow-hidden p-1" 
                                : "bg-emerald-100 text-emerald-600"
                            }`}>
                                {msg.role === "assistant" ? (
                                    <div className="relative w-full h-full">
                                        <Image src="/Erbis.jpg" alt="Bot" fill className="object-cover rounded-xl" />
                                    </div>
                                ) : (
                                    <User size={20} />
                                )}
                            </div>

                            {/* Content */}
                            <div className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[80%]`}>
                                <div 
                                className={`p-5 rounded-3xl shadow-sm text-sm sm:text-base leading-relaxed ${
                                    msg.role === "user"
                                    ? "bg-emerald-600 text-white rounded-tr-sm"
                                    : "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-sm"
                                }`}
                                >
                                    <p className="whitespace-pre-line">{msg.content}</p>
                                </div>

                                {/* Recipe Card */}
                                {msg.recipe && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-white rounded-3xl p-6 border border-amber-100 shadow-md overflow-hidden relative mt-2 group"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                                        
                                        <div className="flex items-start justify-between mb-4 relative">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center shadow-sm">
                                                    <BookOpen className="w-5 h-5 text-amber-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{msg.recipe.title}</h3>
                                                    <p className="text-xs text-amber-600 font-medium mt-0.5">{msg.recipe.purpose}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6 relative mb-4">
                                            <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100/50">
                                                <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <Leaf className="w-3 h-3" /> Bahan-bahan
                                                </h4>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {msg.recipe.ingredients.map((ing, idx) => (
                                                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                            {ing}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Cara Membuat</h4>
                                                <div className="space-y-4">
                                                    {msg.recipe.steps.map((step, idx) => (
                                                        <div key={idx} className="flex gap-4 text-sm text-slate-700">
                                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs border border-slate-200">
                                                                {idx + 1}
                                                            </span>
                                                            <p className="pt-0.5 leading-relaxed">{step}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-end pt-4 border-t border-slate-100">
                                            <button 
                                            onClick={() => handleSaveRecipe(msg.id)}
                                            disabled={savedRecipeIds.has(msg.id) || savingRecipeId === msg.id}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                                                savedRecipeIds.has(msg.id)
                                                    ? "bg-emerald-100 text-emerald-700 cursor-default"
                                                    : "bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-amber-200"
                                            }`}
                                            >
                                            {savingRecipeId === msg.id ? (
                                                <>
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                    Menyimpan...
                                                </>
                                            ) : savedRecipeIds.has(msg.id) ? (
                                                <>
                                                    <Check className="w-3 h-3" />
                                                    Tersimpan
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-3 h-3" />
                                                    Simpan Racikan
                                                </>
                                            )}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                                
                                <span className={`text-[10px] text-slate-400 font-medium mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                    
                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden p-1 flex-shrink-0">
                                <div className="relative w-full h-full">
                                    <Image src="/Erbis.jpg" alt="Bot" fill className="object-cover rounded-xl" />
                                </div>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-3xl rounded-tl-sm flex items-center gap-3 shadow-sm">
                                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                <span className="text-sm text-slate-600 font-medium">Sedang meracik ramuan...</span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-white border-t border-slate-100">
                    <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                        <button 
                            type="button" 
                            className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors hidden sm:flex"
                            disabled={isLoading}
                        >
                            <Sparkles className="w-5 h-5" />
                        </button>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ketik keluhan Anda (contoh: batuk kering)..."
                                disabled={isLoading}
                                className="w-full pl-5 pr-14 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-70 disabled:cursor-not-allowed font-medium"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-emerald-600 text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200 disabled:shadow-none"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
