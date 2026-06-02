/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { GreetingCardDesign, IndianLanguage } from "../types";
import { Download, Sparkles, Languages, Check, Copy, MessageSquare } from "lucide-react";

export interface SenderDetails {
  name: string;
  designation: string;
  department: string;
  institution: string;
}

export const getSenderDetails = (lang: IndianLanguage): SenderDetails => {
  switch (lang) {
    case IndianLanguage.Hindi:
    case IndianLanguage.Sanskrit:
    case IndianLanguage.Maithili:
    case IndianLanguage.Bodo:
    case IndianLanguage.Dogri:
    case IndianLanguage.Konkani:
    case IndianLanguage.Nepali:
    case IndianLanguage.Sindhi:
    case IndianLanguage.Santali:
      return {
        name: "रमेश केसरवानी",
        designation: "सहायक अनुसंधान अधिकारी",
        department: "लोकसभा सचिवालय",
        institution: "भारत की संसद"
      };
    case IndianLanguage.Odia:
      return {
        name: "ରମେଶ କେଶରୱାନୀ",
        designation: "ସହକାରୀ ଗବେଷଣା ଅଧିକାରୀ",
        department: "ଲୋକସଭା ସଚିବାଳୟ",
        institution: "ଭାରତର ସଂସଦ"
      };
    case IndianLanguage.Tamil:
      return {
        name: "ரமேஷ் கேசர்வானி",
        designation: "உதவி ஆராய்ச்சி அதிகாரி",
        department: "மக்களவை செயலகம்",
        institution: "இந்திய நாடாளுமன்றம்"
      };
    case IndianLanguage.Telugu:
      return {
        name: "రమేష్ కేసర్వాణి",
        designation: "సహాయ పరిశోధనా అధికారి",
        department: "లోక్‌సభ സಚಿವಾಲಯം",
        institution: "భారత పార్లమెంటు"
      };
    case IndianLanguage.Malayalam:
      return {
        name: "രമേഷ് കേസർവാണി",
        designation: "അസിസ്റ്റന്റ് റിസർച്ച് ഓഫീസർ",
        department: "ലോക്സഭാ സെക്രട്ടേറിയറ്റ്",
        institution: "ഇന്ത്യൻ പാർലമെന്റ്"
      };
    case IndianLanguage.Gujarati:
      return {
        name: "રમેશ કેસરવાની",
        designation: "મદદનીશ સંશોધન અધિકારી",
        department: "લોકસભા સચિવાલય",
        institution: "ભારતની સંસદ"
      };
    case IndianLanguage.Bengali:
    case IndianLanguage.Manipuri:
    case IndianLanguage.Assamese:
      return {
        name: "রমেশ কেসরওয়ানি",
        designation: "সহকারী গবেষণা কর্মকর্তা",
        department: "লোকসভা সচিবালয়",
        institution: "ভারতের সংসদ"
      };
    case IndianLanguage.Marathi:
      return {
        name: "रमेश केसरवानी",
        designation: "सहायक संशोधन अधिकारी",
        department: "लोकसभा सचिवालय",
        institution: "भारताची संसद"
      };
    case IndianLanguage.Kannada:
      return {
        name: "ರಮೇಶ್ ಕೇಸರ್ವಾನಿ",
        designation: "ಸಹಾಯಕ ಸಂಶೋಧನಾ ಅಧಿಕಾರಿ",
        department: "ಲೋಕಸಭಾ ಸಚಿವಾಲಯ",
        institution: "ಭಾರತದ ಸಂಸತ್ತು"
      };
    case IndianLanguage.Urdu:
    case IndianLanguage.Kashmiri:
      return {
        name: "رمیش کیسروانی",
        designation: "اسسٹنٹ ریسرچ آفیسر",
        department: "لوک سبھا سیکرٹریٹ",
        institution: "بھارتی پارلیمنٹ"
      };
    case IndianLanguage.Punjabi:
      return {
        name: "ਰਮੇਸ਼ ਕੇਸਰਵਾਨੀ",
        designation: "ਸਹਾਇਕ ਖੋਜ ਅਧਿਕਾਰੀ",
        department: "ਲੋਕ ਸਭਾ ਸਕੱਤਰੇਤ",
        institution: "ਭਾਰਤ ਦੀ ਸੰਸਦ"
      };
    default:
      return {
        name: "Ramesh Kesarwani",
        designation: "Assistant Research Officer",
        department: "Lok Sabha Secretariat",
        institution: "Parliament of India"
      };
  }
};

const ParliamentLogo = ({ design, language }: { design: GreetingCardDesign; language: IndianLanguage }) => {
  const isClassic = design.theme === "classic";
  const strokeColor = isClassic ? "currentColor" : "#ffd93d"; // gold
  
  return (
    <div className={`mx-auto mb-3 flex flex-col items-center justify-center text-center ${isClassic ? "text-slate-800" : "text-amber-300"}`}>
      <svg 
        viewBox="0 0 100 85" 
        className="w-20 h-16 filter drop-shadow"
        style={{ color: strokeColor }}
      >
        {/* Ground plateau foundation */}
        <path d="M 5,75 L 95,75" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        <path d="M 12,71 L 88,71" stroke={strokeColor} strokeWidth="1.5" />
        
        {/* Hexagonal/Triangular Modern Sloped Roof Architecture of New Parliament Building */}
        <polygon 
          points="50,15 90,53 82,68 18,68 10,53" 
          fill="none" 
          stroke={strokeColor} 
          strokeWidth="2.5" 
          strokeLinejoin="round" 
        />
        
        {/* Inner high security layered walls and columns */}
        <path d="M 50,15 L 50,68" stroke={strokeColor} strokeWidth="1.5" />
        <path d="M 38,26 L 38,68" stroke={strokeColor} strokeWidth="1" strokeDasharray="1,1" />
        <path d="M 62,26 L 62,68" stroke={strokeColor} strokeWidth="1" strokeDasharray="1,1" />
        <path d="M 26,38 L 26,68" stroke={strokeColor} strokeWidth="1" />
        <path d="M 74,38 L 74,68" stroke={strokeColor} strokeWidth="1" />
        
        {/* Ashoka Stambh Pinnacle on Roof Center (State Emblem of India) */}
        <path d="M 50,5 L 50,15" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        {/* Ashoka Sarnath lion mount pedestal */}
        <rect x="47" y="11" width="6" height="4" rx="0.5" fill={strokeColor} />
        <circle cx="50" cy="8" r="2.5" fill={strokeColor} />
        
        {/* National Flag of India atop the pinnacle */}
        <path d="M 50,5 L 50,2" stroke={strokeColor} strokeWidth="1" />
        <path d="M 50,2 L 56,3.5 L 50,5 Z" fill={strokeColor} />
        
        {/* Ashoka Chakra in Center Lobby */}
        <circle cx="50" cy="46" r="8" stroke={strokeColor} strokeWidth="1.5" fill={isClassic ? "#ffffff" : "rgba(0,0,0,0.2)"} />
        <circle cx="50" cy="46" r="1.5" fill={strokeColor} />
        {/* Visual representation of 24 Spokes on Ashoka Chakra */}
        <path d="M 50,38 L 50,54" stroke={strokeColor} strokeWidth="0.5" />
        <path d="M 42,46 L 58,46" stroke={strokeColor} strokeWidth="0.5" />
        <path d="M 44.3,40.3 L 55.7,51.7" stroke={strokeColor} strokeWidth="0.5" />
        <path d="M 44.3,51.7 L 55.7,40.3" stroke={strokeColor} strokeWidth="0.5" />
      </svg>
      <div className="text-[9px] font-mono tracking-[0.25em] font-bold uppercase mt-1 opacity-75">
        {language === IndianLanguage.Hindi ? "भारत की नई संसद" : "New Parliament of India"}
      </div>
      <div className="w-12 h-[1px] bg-amber-400/35 mx-auto my-1.5" />
    </div>
  );
};

const drawParliamentLogo = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  color: string,
  isClassic: boolean
) => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Base ground line at cy + 30
  ctx.beginPath();
  ctx.moveTo(cx - 40, cy + 30);
  ctx.lineTo(cx + 40, cy + 30);
  ctx.lineWidth = 3;
  ctx.stroke();

  // Ground step two
  ctx.beginPath();
  ctx.moveTo(cx - 32, cy + 26);
  ctx.lineTo(cx + 32, cy + 26);
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Sloped modern hexagonal roof outline
  ctx.beginPath();
  ctx.moveTo(cx, cy - 25);     // Top apex
  ctx.lineTo(cx + 35, cy + 8);  // Down right
  ctx.lineTo(cx + 28, cy + 23); // Inner baseline right
  ctx.lineTo(cx - 28, cy + 23); // Inner baseline left
  ctx.lineTo(cx - 35, cy + 8);  // Up left
  ctx.closePath();
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Center pillar vertical lines
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 25);
  ctx.lineTo(cx, cy + 23);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - 10, cy - 14);
  ctx.lineTo(cx - 10, cy + 23);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 10, cy - 14);
  ctx.lineTo(cx + 10, cy + 23);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - 20, cy - 3);
  ctx.lineTo(cx - 20, cy + 23);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 20, cy - 3);
  ctx.lineTo(cx + 20, cy + 23);
  ctx.stroke();

  // Pinnacle shaft (Pillar)
  ctx.beginPath();
  ctx.moveTo(cx, cy - 35);
  ctx.lineTo(cx, cy - 25);
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Pedestal for Lion Capital
  ctx.fillRect(cx - 4, cy - 29, 8, 4);

  // Capital ball
  ctx.beginPath();
  ctx.arc(cx, cy - 32, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Flag mount
  ctx.beginPath();
  ctx.moveTo(cx, cy - 35);
  ctx.lineTo(cx, cy - 38);
  ctx.lineWidth = 1;
  ctx.stroke();

  // Little flag wave
  ctx.beginPath();
  ctx.moveTo(cx, cy - 38);
  ctx.lineTo(cx + 6, cy - 36.5);
  ctx.lineTo(cx, cy - 35);
  ctx.closePath();
  ctx.fill();

  // Ashok Chakra Circle
  ctx.beginPath();
  ctx.arc(cx, cy + 5, 7, 0, Math.PI * 2);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  if (isClassic) {
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.fillStyle = color;
  }
  
  // Outer circle center core dot
  ctx.beginPath();
  ctx.arc(cx, cy + 5, 1, 0, Math.PI * 2);
  ctx.fill();

  // Visual Spokes
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 2);
  ctx.lineTo(cx, cy + 12);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - 7, cy + 5);
  ctx.lineTo(cx + 7, cy + 5);
  ctx.stroke();

  ctx.restore();
};

interface VisualCardProps {
  recipientName: string;
  senderName: string;
  greetingText: string;
  language: IndianLanguage;
  design: GreetingCardDesign;
  phone?: string;
  onWhatsAppClick?: (phone: string, text: string) => void;
}

export const VISUAL_THEMES = {
  sunset: {
    bg: "background: linear-gradient(135deg, #ff6b6b, #ffd93d, #ec4899, #a66cff)",
    colors: ["#ff6b6b", "#ffd93d", "#ec4899", "#a66cff"],
    textColor: "text-white",
    cardClass: "bg-gradient-to-br from-red-500 via-orange-400 to-pink-500 text-white"
  },
  ocean: {
    bg: "background: linear-gradient(135deg, #0ea5e9, #10b981, #06b6d4)",
    colors: ["#0ea5e9", "#10b981", "#06b6d4"],
    textColor: "text-white",
    cardClass: "bg-gradient-to-br from-sky-500 via-teal-400 to-emerald-500 text-white"
  },
  lavender: {
    bg: "background: linear-gradient(135deg, #8b5cf6, #ec4899, #6366f1)",
    colors: ["#8b5cf6", "#ec4899", "#6366f1"],
    textColor: "text-white",
    cardClass: "bg-gradient-to-br from-violet-600 via-pink-500 to-indigo-500 text-white"
  },
  emerald: {
    bg: "background: linear-gradient(135deg, #111827, #15803d, #eab308)",
    colors: ["#111827", "#15803d", "#eab308"],
    textColor: "text-white",
    cardClass: "bg-gradient-to-br from-slate-900 via-emerald-800 to-amber-500 text-white"
  },
  aurora: {
    bg: "background: linear-gradient(135deg, #059669, #3b82f6, #06b6d4)",
    colors: ["#059669", "#3b82f6", "#06b6d4"],
    textColor: "text-white",
    cardClass: "bg-gradient-to-br from-emerald-600 via-blue-500 to-cyan-500 text-white"
  },
  royal: {
    bg: "background: linear-gradient(135deg, #1e3a8a, #4f46e5, #dc2626)",
    colors: ["#1e3a8a", "#4f46e5", "#dc2626"],
    textColor: "text-white",
    cardClass: "bg-gradient-to-br from-blue-900 via-indigo-600 to-red-600 text-white"
  },
  classic: {
    bg: "background: linear-gradient(135deg, #ff9933, #ffffff, #128807)",
    colors: ["#ff9933", "#ffffff", "#128807"],
    textColor: "text-slate-900",
    cardClass: "bg-gradient-to-tr from-orange-100 via-white to-emerald-100 text-slate-800 border-2 border-orange-200"
  }
};

export default function VisualCard({
  recipientName = "Shri Rajesh Kumar Ji",
  senderName = "Ramesh Kesarwani",
  greetingText = "Wishing you happiness, good health, success and prosperity.",
  language = IndianLanguage.English,
  design,
  phone = "",
  onWhatsAppClick
}: VisualCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeTheme = VISUAL_THEMES[design.theme] || VISUAL_THEMES.sunset;
  
  const getFontFamilyClass = () => {
    if (design.fontFamily === "serif") return "font-serif";
    if (design.fontFamily === "mono") return "font-mono";
    return "font-sans";
  };

  const getFontSizeClass = () => {
    if (design.fontSize === "large") return "text-lg md:text-xl";
    if (design.fontSize === "xlarge") return "text-xl md:text-2xl";
    return "text-sm md:text-base";
  };

  const copyToClipboard = () => {
    const fullText = `🎂 Happy Birthday ${recipientName} 🎂\n\n${greetingText}\n\nBest Wishes,\n${senderName}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Canvas drawing routine to compile high quality PNG cards directly in browser
  const triggerImageDownload = () => {
    setDownloading(true);
    const canvas = canvasRef.current;
    if (!canvas) {
      setDownloading(false);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setDownloading(false);
      return;
    }

    // Canvas settings for high-resolution card (750 x 500)
    canvas.width = 800;
    canvas.height = 550;

    // Draw Theme Gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const stopColors = activeTheme.colors;
    
    if (stopColors.length === 4) {
      grad.addColorStop(0, stopColors[0]);
      grad.addColorStop(0.3, stopColors[1]);
      grad.addColorStop(0.7, stopColors[2]);
      grad.addColorStop(1, stopColors[3]);
    } else {
      grad.addColorStop(0, stopColors[0]);
      grad.addColorStop(0.5, stopColors[1]);
      grad.addColorStop(1, stopColors[2]);
    }
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Borders
    ctx.strokeStyle = design.theme === "classic" ? "rgba(0,128,0,0.15)" : "rgba(255,255,255,0.2)";
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Fill Inner Card Box
    ctx.fillStyle = design.theme === "classic" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.15)";
    ctx.roundRect ? ctx.roundRect(30, 30, canvas.width - 60, canvas.height - 60, 16) : ctx.fillRect(30, 30, canvas.width - 60, canvas.height - 60);
    ctx.fill();

    // Setup Text Color
    const isClassic = design.theme === "classic";
    const primaryColor = isClassic ? "#0f172a" : "#ffffff";
    const secondaryColor = isClassic ? "#ec4899" : "#ffd93d";
    const subtleColor = isClassic ? "#475569" : "rgba(255,255,255,0.8)";

    // Set Font Families
    let titleFont = "Space Grotesk, sans-serif";
    let bodyFont = "Inter, sans-serif";
    if (design.fontFamily === "serif") {
      titleFont = "Playfair Display, Georgia, serif";
      bodyFont = "Playfair Display, Georgia, serif";
    } else if (design.fontFamily === "mono") {
      titleFont = "Courier New, Fira Code, monospace";
      bodyFont = "Fira Code, Courier New, monospace";
    }

    // 1. App Logo (New Parliament of India)
    drawParliamentLogo(ctx, canvas.width / 2, 60, secondaryColor, isClassic);

    // 2. Birthday Title
    ctx.fillStyle = secondaryColor;
    ctx.font = `bold 30px ${titleFont}`;
    ctx.fillText("🎂 HAPPY BIRTHDAY 🎂", canvas.width / 2, 135);

    // 3. Recipient Name
    ctx.fillStyle = primaryColor;
    ctx.font = `bold 36px ${titleFont}`;
    ctx.fillText(recipientName || "Recipient Name", canvas.width / 2, 195);

    // 4. Greeting Text (With Wrap Support for multiple regional scripts!)
    ctx.fillStyle = primaryColor;
    let baseFontSize = 21;
    if (design.fontSize === "large") baseFontSize = 23;
    if (design.fontSize === "xlarge") baseFontSize = 26;

    ctx.font = `medium ${baseFontSize}px ${bodyFont}`;
    
    // Auto-wrapping function
    const textToWrap = greetingText || "Wishing you happiness, good health, success and prosperity.";
    const maxWidth = canvas.width - 140;
    const words = textToWrap.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    // For Indian language scripts like Hindi, split characters as well or standard spacing
    words.forEach(word => {
      const testLine = currentLine + word + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && currentLine !== "") {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) {
      lines.push(currentLine.trim());
    }

    // Print lines
    let startY = 245;
    const lineHeight = baseFontSize + 11;
    lines.forEach((line, idx) => {
      ctx.fillText(line, canvas.width / 2, startY + (idx * lineHeight));
    });

    // 5. Sender Name Block
    const isRamesh = !senderName || senderName.toLowerCase().includes("ramesh") || senderName.toLowerCase().includes("kesarwani");
    const senderDetails = getSenderDetails(language);
    
    // Position signature box beautifully
    const bottomY = canvas.height - 75;
    
    ctx.fillStyle = subtleColor;
    ctx.font = `italic 15px ${bodyFont}`;
    ctx.fillText(language === IndianLanguage.Hindi ? "शुभकामनाएँ एवं सादर" : "Warm Regards & Best Wishes", canvas.width / 2, bottomY - 45);

    if (isRamesh) {
      ctx.fillStyle = secondaryColor;
      ctx.font = `bold 21px ${titleFont}`;
      ctx.fillText(senderDetails.name, canvas.width / 2, bottomY - 22);

      ctx.fillStyle = primaryColor;
      ctx.font = `bold 14px ${bodyFont}`;
      ctx.fillText(senderDetails.designation, canvas.width / 2, bottomY - 3);

      ctx.fillStyle = subtleColor;
      ctx.font = `12px ${bodyFont}`;
      ctx.fillText(`${senderDetails.department}, ${senderDetails.institution}`, canvas.width / 2, bottomY + 14);
    } else {
      ctx.fillStyle = secondaryColor;
      ctx.font = `bold 22px ${titleFont}`;
      ctx.fillText(senderName || "Sender Name", canvas.width / 2, bottomY - 10);
    }

    // Create anchor trigger
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const safeName = recipientName.replace(/[^a-zA-Z0-9]/g, "");
      link.download = `BBGP_Greeting_${safeName || "Card"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Canvas export failed:", e);
    }

    setDownloading(false);
  };

  return (
    <div id="greeting-visual-styler" className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm transition-all text-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 fill-amber-100" />
          <h4 className="font-display font-bold text-slate-800 text-sm tracking-wide uppercase">Real-Time Greeting Card Preview</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
            <Languages className="w-3 h-3" /> {language}
          </span>
        </div>
      </div>

      {/* Styled Card Container */}
      <div 
        id="live-birthday-card"
        style={{
          borderBottomRightRadius: "30px",
          borderTopLeftRadius: "30px",
          borderBottomLeftRadius: "8px",
          borderTopRightRadius: "8px"
        }}
        className={`w-full ${activeTheme.cardClass} relative p-6 md:p-8 text-center shadow-lg transform transition-all hover:scale-[1.01] overflow-hidden min-h-[340px] flex flex-col justify-between`}
      >
        {/* Subtle decorative circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-44 h-44 bg-white/5 rounded-full translate-x-20 translate-y-20 pointer-events-none" />

        {/* Card Content Header with New Parliament Building Logo */}
        <div className="relative flex flex-col items-center">
          <ParliamentLogo design={design} language={language} />
          <h1 className="font-display font-extrabold text-xl md:text-2xl tracking-wider text-amber-300 drop-shadow-sm uppercase mt-1">
            🎂 Happy Birthday 🎂
          </h1>
        </div>

        {/* Card Message Body */}
        <div className="my-4 relative max-w-lg mx-auto">
          <h2 className={`font-display font-bold text-xl md:text-2xl mb-2 tracking-tight ${design.theme === "classic" ? "text-slate-950" : "text-white"}`}>
            {recipientName || "Recipient Name"}
          </h2>
          <p className={`${getFontFamilyClass()} ${getFontSizeClass()} leading-relaxed ${design.theme === "classic" ? "text-slate-800" : "text-white/95"}`}>
            {greetingText || "Wishing you happiness, good health, success and prosperity. May your year ahead be filled with joy and achievements."}
          </p>
        </div>

        {/* Card Sender Footer with Localized Designation Block */}
        <div className="border-t border-white/10 pt-3 relative flex flex-col items-center">
          <p className={`text-[10px] md:text-xs uppercase tracking-widest mb-1.5 ${design.theme === "classic" ? "text-slate-500" : "text-white/70"}`}>
            {language === IndianLanguage.Hindi ? "॥ शुभकामनाएँ एवं सादर ॥" : "Best Wishes & Warm Regards"}
          </p>
          
          {(() => {
            const isRamesh = !senderName || senderName.toLowerCase().includes("ramesh") || senderName.toLowerCase().includes("kesarwani");
            const senderDetails = getSenderDetails(language);
            if (isRamesh) {
              return (
                <div className="space-y-0.5">
                  <h3 className={`font-display font-extrabold text-base md:text-lg tracking-wide ${design.theme === "classic" ? "text-slate-900" : "text-amber-300"}`}>
                    {senderDetails.name}
                  </h3>
                  <p className={`text-[11px] md:text-xs font-semibold ${design.theme === "classic" ? "text-indigo-600" : "text-amber-200/90"}`}>
                    {senderDetails.designation}
                  </p>
                  <p className={`text-[9px] md:text-[11px] font-mono tracking-wide opacity-80 ${design.theme === "classic" ? "text-slate-600" : "text-slate-200"}`}>
                    {senderDetails.department}, {senderDetails.institution}
                  </p>
                </div>
              );
            } else {
              return (
                <h3 className={`font-display font-bold text-base md:text-lg ${design.theme === "classic" ? "text-slate-800" : "text-amber-300"}`}>
                  {senderName}
                </h3>
              );
            }
          })()}
        </div>
      </div>

      {/* Hidden Canvas used for high fidelity export */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Actions Toolbar */}
      <div className="mt-4 flex flex-wrap gap-2 justify-end">
        {phone && (
          <button
            type="button"
            onClick={() => {
              if (onWhatsAppClick) {
                onWhatsAppClick(phone, greetingText);
              } else {
                const cleaned = phone.replace(/\D/g, "");
                const formatted = (cleaned.length === 10 && !cleaned.startsWith("91")) ? `91${cleaned}` : cleaned;
                const link = `https://web.whatsapp.com/send?phone=${formatted}&text=${encodeURIComponent(greetingText)}`;
                window.open(link, "_blank");
              }
            }}
            id="btn-whatsapp-styler-dispatch"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 rounded-xl transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open WA Web</span>
          </button>
        )}

        <button
          onClick={copyToClipboard}
          id="btn-copy-card-text"
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600" /> Copied Text
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copy Message
            </>
          )}
        </button>

        <button
          onClick={triggerImageDownload}
          disabled={downloading}
          id="btn-download-card-png"
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          {downloading ? "Drawing Image..." : "Download Card PNG"}
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-[11px] text-slate-400 bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-2">
        <span className="text-amber-500 text-sm font-bold">ℹ</span>
        <p className="leading-relaxed">
          The <strong>Download PNG</strong> compiles of your custom gradient background, multilingual scripts, chosen fonts, and custom styling parameters into a premium printable social graphic file.
        </p>
      </div>
    </div>
  );
}
