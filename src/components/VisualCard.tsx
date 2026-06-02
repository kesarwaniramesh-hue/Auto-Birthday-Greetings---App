/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { GreetingCardDesign, IndianLanguage } from "../types";
import { Download, Sparkles, Languages, Check, Copy, MessageSquare } from "lucide-react";

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

    // 1. App Emoji / Icon
    ctx.font = "40px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(design.emoji || "🎂", canvas.width / 2, 75);

    // 2. Birthday Title
    ctx.fillStyle = secondaryColor;
    ctx.font = `bold 32px ${titleFont}`;
    ctx.fillText("🎂 HAPPY BIRTHDAY 🎂", canvas.width / 2, 135);

    // 3. Recipient Name
    ctx.fillStyle = primaryColor;
    ctx.font = `bold 38px ${titleFont}`;
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
    const bottomY = canvas.height - 85;
    ctx.fillStyle = subtleColor;
    ctx.font = `italic 18px ${bodyFont}`;
    ctx.fillText("Warm Regards & Best Wishes:", canvas.width / 2, bottomY - 30);

    ctx.fillStyle = secondaryColor;
    ctx.font = `bold 24px ${titleFont}`;
    ctx.fillText(senderName || "Sender Name", canvas.width / 2, bottomY);

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

        {/* Card Content Header */}
        <div className="relative">
          <div className="text-4xl md:text-5xl mb-2 filter drop-shadow">
            {design.emoji || "🎂"}
          </div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-wider text-amber-300 drop-shadow-sm uppercase">
            🎂 Happy Birthday 🎂
          </h1>
        </div>

        {/* Card Message Body */}
        <div className="my-5 relative max-w-lg mx-auto">
          <h2 className={`font-display font-bold text-xl md:text-3xl mb-3 tracking-tight ${design.theme === "classic" ? "text-slate-950" : "text-white"}`}>
            {recipientName || "Recipient Name"}
          </h2>
          <p className={`${getFontFamilyClass()} ${getFontSizeClass()} leading-loose ${design.theme === "classic" ? "text-slate-800" : "text-white/95"}`}>
            {greetingText || "Wishing you happiness, good health, success and prosperity. May your year ahead be filled with joy and achievements."}
          </p>
        </div>

        {/* Card Sender Footer */}
        <div className="border-t border-white/10 pt-3 relative">
          <p className={`text-xs uppercase tracking-widest mb-1 ${design.theme === "classic" ? "text-slate-500" : "text-white/70"}`}>
            Best Wishes & Regards
          </p>
          <h3 className={`font-display font-bold text-lg md:text-xl ${design.theme === "classic" ? "text-slate-800" : "text-amber-300"}`}>
            {senderName || "Ramesh Kesarwani"}
          </h3>
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
