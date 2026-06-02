/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  IndianLanguage,
  Relationship,
  GreetingStyle,
  User,
  GreetingCardDesign,
  GreetingRequest,
  DeliveryLog,
  GreetingTemplate
} from "./types";
import VisualCard from "./components/VisualCard";
import {
  Users,
  Calendar,
  Settings,
  LogOut,
  Clock,
  Plus,
  Trash2,
  Play,
  Send,
  Sparkles,
  ShieldCheck,
  Activity,
  FileText,
  Check,
  Search,
  Languages,
  Lock,
  Smartphone,
  Mail,
  RefreshCw,
  Sliders,
  Database,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  ListFilter,
  Layers,
  Award,
  ExternalLink,
  MessageSquare
} from "lucide-react";

// Initial empty profile
const GUEST_ACC: User = {
  id: "u-guest",
  name: "Visitor Account",
  mobile: "9999999999",
  email: "visitor@bbgp.gov.in",
  role: "user",
  createdAt: new Date().toISOString()
};

const formatWhatsAppNumber = (num: string): string => {
  const cleaned = num.replace(/\D/g, "");
  if (!cleaned) return "";
  if (cleaned.length === 10) return `91${cleaned}`;
  return cleaned;
};

const getWhatsAppWebLink = (phone: string, text: string) => {
  const cleanPhone = formatWhatsAppNumber(phone);
  return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
};

const getWhatsAppMobileLink = (phone: string, text: string) => {
  const cleanPhone = formatWhatsAppNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

export default function App() {
  // Current user session & login flows
  const [currentUser, setCurrentUser] = useState<User | null>(GUEST_ACC);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Logged in inside AI Studio by default with visitor account
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  
  // Registration credentials
  const [signUpName, setSignUpName] = useState("");
  const [signUpMobile, setSignUpMobile] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // SignIn coordinates
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sidebar navigation tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "create" | "logs" | "templates" | "admin">("dashboard");

  // Core business lists synced from /server
  const [greetings, setGreetings] = useState<GreetingRequest[]>([]);
  const [templates, setTemplates] = useState<GreetingTemplate[]>([]);
  const [deliveryLogs, setDeliveryLogs] = useState<DeliveryLog[]>([]);
  const [systemStats, setSystemStats] = useState({
    totalSent: 0,
    pendingCount: 0,
    failedCount: 0,
    usersCount: 1,
    templatesCount: 7,
    languageDistribution: {} as Record<string, number>,
    relationshipDistribution: {} as Record<string, number>,
    styleDistribution: {} as Record<string, number>,
    channelDistribution: { WhatsApp: 0, Email: 0 }
  });

  // Request Form States
  const [recipientName, setRecipientName] = useState("");
  const [dob, setDob] = useState("");
  const [mobileNum, setMobileNum] = useState("");
  const [emailId, setEmailId] = useState("");
  const [genderState, setGenderState] = useState<"Male" | "Female" | "Other">("Male");
  const [languageState, setLanguageState] = useState<IndianLanguage>(IndianLanguage.Hindi);
  const [relationshipState, setRelationshipState] = useState<Relationship>(Relationship.Friend);
  const [styleState, setStyleState] = useState<GreetingStyle>(GreetingStyle.Personal);
  const [customMsg, setCustomMsg] = useState("");
  const [scheduledSlot, setScheduledSlot] = useState<"12:00 AM" | "03:00 AM" | "06:00 AM" | "08:00 AM" | "09:00 AM" | "Custom">("08:00 AM");
  const [customHourMin, setCustomHourMin] = useState("10:00");
  const [deliveryChannels, setDeliveryChannels] = useState<("WhatsApp" | "Email")[]>(["WhatsApp", "Email"]);

  // Visual card styles customizer state
  const [cardDesign, setCardDesign] = useState<GreetingCardDesign>({
    theme: "sunset",
    fontFamily: "sans",
    fontSize: "medium",
    accentColor: "#f59e0b",
    emoji: "🎂"
  });

  // Dynamic search/filters
  const [logsSearchTerm, setLogsSearchTerm] = useState("");
  const [templateSearchTerm, setTemplateSearchTerm] = useState("");
  const [templateLangFilter, setTemplateLangFilter] = useState<string>("All");
  
  // Custom templates form state
  const [newTemplateText, setNewTemplateText] = useState("");
  const [newTemplateLang, setNewTemplateLang] = useState<IndianLanguage>(IndianLanguage.Hindi);
  const [newTemplateRel, setNewTemplateRel] = useState<Relationship>(Relationship.Friend);
  const [newTemplateStyle, setNewTemplateStyle] = useState<GreetingStyle>(GreetingStyle.Personal);

  // States for loaders
  const [loadingAI, setLoadingAI] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cronRunning, setCronRunning] = useState(false);
  const [expandPayloadId, setExpandPayloadId] = useState<string | null>(null);
  const [whatsappPendingDispatch, setWhatsappPendingDispatch] = useState<{
    phone: string;
    recipientName: string;
    text: string;
  } | null>(null);

  // Fetch all core system states from server APIs on start up
  const syncSystemState = async () => {
    try {
      setRefreshing(true);
      
      const resGreetings = await fetch("/api/greetings");
      if (resGreetings.ok) {
        const data = await resGreetings.json();
        setGreetings(data);
      }

      const resTemplates = await fetch("/api/templates");
      if (resTemplates.ok) {
        const data = await resTemplates.json();
        setTemplates(data);
      }

      const resLogs = await fetch("/api/logs");
      if (resLogs.ok) {
        const data = await resLogs.json();
        setDeliveryLogs(data);
      }

      const resStats = await fetch("/api/stats");
      if (resStats.ok) {
        const data = await resStats.json();
        setSystemStats(data);
      }

    } catch (e) {
      console.warn("Failed to retrieve real-time Express endpoints, using local defaults.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    syncSystemState();
  }, []);

  // Register Form action
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!signUpName || !signUpMobile || !signUpEmail || !signUpPassword) {
      setAuthError("All fields are mandatory to proceed.");
      return;
    }

    if (signUpPassword !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpName,
          mobile: signUpMobile,
          email: signUpEmail,
          password: signUpPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
         setAuthError(data.error || "Failed to issue registration.");
      } else {
         setOtpSent(true);
         setOtpCode(data.otpCode || "123456");
         setAuthSuccess(data.message || "OTP code transmitted successfully via SMS simulation.");
      }
    } catch (error) {
      setAuthError("Network error matching sign up endpoint.");
    }
  };

  // OTP confirmation action
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!otpInput) {
      setAuthError("Please supply the 6-digit OTP code.");
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           name: signUpName,
           mobile: signUpMobile,
           email: signUpEmail,
           otp: otpInput,
           password: signUpPassword
         })
      });
      const data = await res.json();

      if (!res.ok) {
         setAuthError(data.error || "OTP verification failed.");
      } else {
         setCurrentUser(data.user);
         setIsLoggedIn(true);
         setAuthSuccess("Registration verified! Welcome to the portal.");
         // Reset flows
         setOtpSent(false);
         setOtpInput("");
         setSignUpName("");
         setSignUpMobile("");
         setSignUpEmail("");
         setSignUpPassword("");
         setConfirmPassword("");
         syncSystemState();
      }
    } catch (error) {
      setAuthError("Error verifying registration token.");
    }
  };

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!loginIdentifier || !loginPassword) {
      setAuthError("Please enter your Mobile number or Email.");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: loginIdentifier,
          password: loginPassword
        })
      });
      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || "Invalid username or password.");
      } else {
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setAuthSuccess(data.message || "Access authorized successfully!");
        setLoginIdentifier("");
        setLoginPassword("");
        syncSystemState();
      }
    } catch (error) {
       setAuthError("Failed contacting authentication microservice.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  // Form helper: generate template text directly from DB or utilize Gemini AI!
  const generateAIGreet = async () => {
    if (!recipientName) {
      alert("Please designate a Recipient Name first to tailor the AI copy!");
      return;
    }

    setLoadingAI(true);
    try {
      const response = await fetch("/api/greetings/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName,
          relationship: relationshipState,
          style: styleState,
          language: languageState,
          gender: genderState,
          senderName: currentUser?.name || "Ramesh Kesarwani"
        })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setCustomMsg(result.text);
      } else {
        console.error("Failed model response, setting custom default fallback.");
      }
    } catch (err) {
      console.warn("AI service failure, crafting native template.");
    } finally {
      setLoadingAI(false);
    }
  };

  // Submit new birthday greeting scheduling request to Express mock pipeline
  const submitGreetingRequest = async (immediate = false) => {
    if (!recipientName || !dob || !mobileNum) {
       alert("Recipient Name, Date of Birth, and Mobile Number are required.");
       return;
    }

    if (deliveryChannels.length === 0) {
       alert("Select at least 1 dispatch channel (WhatsApp / Email).");
       return;
    }

    setSubmittingRequest(true);
    try {
      const requestPayload: Partial<GreetingRequest> = {
        recipientName,
        dob,
        mobile: mobileNum,
        email: emailId,
        gender: genderState,
        language: languageState,
        relationship: relationshipState,
        style: styleState,
        greetingText: customMsg || `Wishing a joyful birthday, ${recipientName}!`,
        status: immediate ? "Sent" : "Pending",
        scheduledTime: scheduledSlot,
        customTime: scheduledSlot === "Custom" ? customHourMin : undefined,
        deliveryChannels: deliveryChannels,
        senderName: currentUser?.name || "Ramesh Kesarwani",
        design: cardDesign
      };

      const res = await fetch("/api/greetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload)
      });

      const data = await res.json();
      if (res.ok) {
        if (deliveryChannels.includes("WhatsApp")) {
          setWhatsappPendingDispatch({
            phone: mobileNum,
            recipientName: recipientName,
            text: customMsg || `जन्मदिन की हार्दिक शुभकामनाएं ${recipientName} जी!`
          });
        }
         // Reset input form values on success
         setRecipientName("");
         setDob("");
         setMobileNum("");
         setEmailId("");
         setCustomMsg("");
         // Transition tab
         setActiveTab("dashboard");
         syncSystemState();
      } else {
         alert("Error registered: " + data.error);
      }

    } catch (e) {
       alert("Transmission failed, please try again.");
    } finally {
       setSubmittingRequest(false);
    }
  };

  // Admin template adding action
  const createCustomTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateText) {
      alert("Template body cannot be left blank.");
      return;
    }

    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: newTemplateLang,
          style: newTemplateStyle,
          relationship: newTemplateRel,
          templateText: newTemplateText
        })
      });

      if (res.ok) {
        setNewTemplateText("");
        syncSystemState();
        alert("Template successfully logged into Bharat database!");
      }
    } catch(err) {
      alert("Error logging template.");
    }
  };

  // Trigger immediate scheduler evaluation tick on the server
  const triggerSchedulerTick = async () => {
    setCronRunning(true);
    try {
      const res = await fetch("/api/simulate-tick", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        syncSystemState();
        alert(data.message || "Scheduler tick simulated successfully!");
      }
    } catch(e) {
      alert("Error calling scheduler tick.");
    } finally {
      setCronRunning(false);
    }
  };

  // Deletion logic
  const deleteGreeting = async (id: string) => {
    if (!window.confirm("Are you sure you want to retract/delete this scheduled greeting?")) return;
    try {
      const res = await fetch(`/api/greetings/${id}`, { method: "DELETE" });
      if (res.ok) {
        syncSystemState();
      }
    } catch (e) {
      console.error("Delete error", e);
    }
  };

  // Quick preset loader when changing Language/Style/Relationship
  useEffect(() => {
    // If user has not typed anything custom yet, or we explicitly change, find active template matching coordinate
    const matched = templates.find(
      t => t.language === languageState && t.style === styleState && t.relationship === relationshipState
    ) || templates.find(
      t => t.language === languageState && t.style === styleState
    ) || templates.find(
      t => t.language === languageState
    );

    if (matched && !customMsg) {
      setCustomMsg(matched.templateText.replace("{{Recipient Name}}", recipientName || "[[Recipient]]"));
    }
  }, [languageState, styleState, relationshipState, templates]);

  // Handle auto replacement inside active draft as visitor input changes
  const handleRecipientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRecipientName(val);
    
    // Auto replace dynamic placeholders in input for active flow if matching standard
    const matched = templates.find(t => t.language === languageState);
    if (matched && (!customMsg || customMsg.includes("Recipient") || customMsg === "")) {
      setCustomMsg(matched.templateText.replace("{{Recipient Name}}", val || "[[Recipient]]"));
    }
  };

  // Filter lists for tabs
  const filteredLogs = deliveryLogs.filter(l => 
    l.recipientName.toLowerCase().includes(logsSearchTerm.toLowerCase()) ||
    l.message.toLowerCase().includes(logsSearchTerm.toLowerCase()) ||
    l.channel.toLowerCase().includes(logsSearchTerm.toLowerCase())
  );

  const filteredTemplates = templates.filter(t => {
    const termMatches = t.templateText.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
                         t.style.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
                         t.relationship.toLowerCase().includes(templateSearchTerm.toLowerCase());
    const langMatches = templateLangFilter === "All" || t.language === templateLangFilter;
    return termMatches && langMatches;
  });

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col md:flex-row font-sans">
      
      {/* 1. MAIN PORTAL BACKGROUND WRAPPER WITH DARK ASYMMETRIC SIDEBAR */}
      {isLoggedIn && (
        <aside id="portal-sidebar-nav" className="w-full md:w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
          <div>
            {/* Header / Logo */}
            <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-saffron via-white to-green-bharat rounded-xl flex items-center justify-center font-bold text-lg text-slate-900 shadow-sm border border-slate-700">
                🇮🇳
              </div>
              <div>
                <h1 className="font-display font-extrabold text-white text-base tracking-tight leading-none">BBGP Portal</h1>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Govt. Automation</span>
              </div>
            </div>

            {/* User credentials identifier */}
            <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center font-bold text-white text-xs">
                  {currentUser?.name.charAt(0) || "U"}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-xs font-semibold text-white truncate leading-none mb-1">{currentUser?.name}</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[9px] font-mono text-slate-400 uppercase leading-none capitalize">{currentUser?.role} Mode</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation options */}
            <nav className="p-4 space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                id="tab-btn-dashboard"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-indigo-600/20 text-white border-l-4 border-indigo-500 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Layers className="w-4.5 h-4.5" />
                <span>Dashboard Home</span>
              </button>

              <button
                onClick={() => setActiveTab("create")}
                id="tab-btn-create"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "create"
                    ? "bg-indigo-600/20 text-white border-l-4 border-indigo-500 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Plus className="w-4.5 h-4.5 text-emerald-400" />
                <span>New Greeting</span>
              </button>

              <button
                onClick={() => setActiveTab("logs")}
                id="tab-btn-logs"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "logs"
                    ? "bg-indigo-600/20 text-white border-l-4 border-indigo-500 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Activity className="w-4.5 h-4.5 text-amber-400" />
                <span>Automation Logs</span>
              </button>

              <button
                onClick={() => setActiveTab("templates")}
                id="tab-btn-templates"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "templates"
                    ? "bg-indigo-600/20 text-white border-l-4 border-indigo-500 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <BookOpen className="w-4.5 h-4.5 text-blue-400" />
                <span>Templates Library</span>
              </button>

              <button
                onClick={() => setActiveTab("admin")}
                id="tab-btn-admin"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "admin"
                    ? "bg-indigo-600/20 text-white border-l-4 border-indigo-500 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Settings className="w-4.5 h-4.5 text-indigo-400" />
                <span>System Console</span>
              </button>
            </nav>
          </div>

          {/* Infrastructure Health Status Sidebar block */}
          <div className="p-4 m-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3.5">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                <span>Infrastructure Status</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
              
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">WhatsApp API:</span>
                  <span className="text-green-400 font-medium">Connected (v19)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">SMTP Gateway:</span>
                  <span className="text-green-400 font-medium font-mono">Dispatched</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 text-[11px]">Database Engine:</span>
                  <span className="text-slate-300 font-mono text-[11.5px]">JSON FileDB</span>
                </div>
              </div>
            </div>

            <div className="flex gap-1.5 pt-1 border-t border-slate-800">
              <div className="h-1 flex-1 bg-green-500 rounded"></div>
              <div className="h-1 flex-1 bg-green-500 rounded"></div>
              <div className="h-1 flex-1 bg-indigo-500 rounded animate-pulse"></div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full py-1.5 text-xs text-center border border-red-900/30 bg-red-950/20 text-red-400 rounded-xl hover:bg-red-950/40 hover:text-red-300 cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </aside>
      )}

      {/* 2. AUTHENTICATION SCREENS (REGISTER, LOG IN & VERIFY IN-APP OTP SIMULATOR) */}
      {!isLoggedIn && (
        <main className="flex-1 flex items-center justify-center p-4 min-h-screen relative overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-950"></div>
          
          <div className="w-full max-w-md bg-slate-900/95 p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
            {/* National emblem display */}
            <div className="text-center mb-6">
              <div className="inline-flex w-14 h-14 bg-gradient-to-tr from-saffron via-white to-green-bharat p-[2px] rounded-2xl shadow-lg mb-3">
                <div className="bg-slate-950 w-full h-full rounded-2xl flex items-center justify-center font-bold text-xl">
                  🇮🇳
                </div>
              </div>
              <h2 className="font-display font-extrabold text-2xl tracking-tight text-white mb-1">
                Bharat Greetings Portal
              </h2>
              <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">
                Multilingual Birthday Automation Hub
              </p>
            </div>

            {/* Error / Success Notifications */}
            {authError && (
              <div className="p-3 mb-4 text-xs bg-red-950/50 border border-red-900/50 text-red-300 rounded-xl flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="p-3 mb-4 text-xs bg-emerald-950/50 border border-emerald-900/50 text-emerald-300 rounded-xl flex gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{authSuccess}</span>
              </div>
            )}

            {!otpSent && (
              <>
                {/* Visual tabs switcher */}
                <div className="flex border-b border-slate-800/80 mb-6">
                  <button
                    onClick={() => { setAuthTab("signin"); setAuthError(""); }}
                    className={`flex-1 pb-2.5 text-sm font-semibold border-b-2 text-center cursor-pointer transition-all ${
                      authTab === "signin" ? "border-indigo-500 text-white" : "border-transparent text-slate-500 hover:text-slate-400"
                    }`}
                  >
                    Login to BBGP
                  </button>
                  <button
                    onClick={() => { setAuthTab("signup"); setAuthError(""); }}
                    className={`flex-1 pb-2.5 text-sm font-semibold border-b-2 text-center cursor-pointer transition-all ${
                      authTab === "signup" ? "border-indigo-500 text-white" : "border-transparent text-slate-500 hover:text-slate-400"
                    }`}
                  >
                    Register Account
                  </button>
                </div>

                {authTab === "signin" ? (
                  /* Login Block */
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">Mobile Number or Email</label>
                      <div className="relative">
                        <Smartphone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          placeholder="e.g. 9876543210 or ramesh@mail.com"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">Interactive Passcode</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Your security passcode"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl tracking-wide transition-all shadow-lg shadow-indigo-600/25 active:scale-95 text-sm cursor-pointer"
                    >
                      Authenticate Account
                    </button>
                  </form>
                ) : (
                  /* Sign Up Block */
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">Full Legal Name</label>
                      <input
                        type="text"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="Shri Ramesh Kesarwani"
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">Mobile Number</label>
                        <input
                          type="tel"
                          value={signUpMobile}
                          onChange={(e) => setSignUpMobile(e.target.value)}
                          placeholder="9876543210"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">Email Address</label>
                        <input
                          type="email"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          placeholder="mail@bbgp.in"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">Password</label>
                        <input
                          type="password"
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="********"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">Confirm Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="********"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl tracking-wide transition-all shadow-lg active:scale-95 text-sm mt-2 cursor-pointer"
                    >
                      Process & Send Validation OTP
                    </button>
                  </form>
                )}
              </>
            )}

            {/* OTP Validation Panel (Simulated Gateway directly reveals verification key inside app) */}
            {otpSent && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3.5 bg-indigo-950/50 border border-indigo-900/50 rounded-2xl text-center">
                  <span className="text-[11px] font-mono uppercase text-indigo-400 block mb-1">Simulated SMS Verification Gateway</span>
                  <div className="flex justify-center items-center gap-1">
                     <span className="text-slate-400 text-xs">Verification Code Sent:</span>
                     <span id="revealed-otp" className="font-mono text-base font-bold text-amber-300 tracking-widest">{otpCode}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">Enter Received 6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Type the registration OTP"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-center font-mono text-lg tracking-widest text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setAuthError(""); }}
                    className="flex-1 py-2.5 border border-slate-800 hover:bg-slate-800/50 text-slate-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold active:scale-95 cursor-pointer"
                  >
                    Confirm & Complete Sign Up
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
               <button 
                 onClick={() => { setIsLoggedIn(true); setCurrentUser(GUEST_ACC); }}
                 className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline"
               >
                 No account? Access as pre-configured admin profile
               </button>
            </div>
          </div>
        </main>
      )}

      {/* 3. CORE ROUTED SYSTEM LAYOUT SCREENS */}
      {isLoggedIn && (
        <main className="flex-1 flex flex-col min-h-0 bg-[#F1F5F9]">
          
          {/* Top Navbar */}
          <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">SarvBhasha System</span>
              <span className="text-slate-300">/</span>
              <span id="route-indicator-title" className="text-sm font-bold capitalize text-slate-800">
                {activeTab === "create" ? "Create Birthday Greeting Request" : activeTab}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Dynamic Scheduler state manual override utility */}
              <button
                id="btn-manual-sync-stats"
                onClick={syncSystemState}
                disabled={refreshing}
                title="Sync core database"
                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              </button>

              <button
                id="btn-manual-cron-tick"
                onClick={triggerSchedulerTick}
                disabled={cronRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 text-amber-400 border border-slate-800 rounded-lg hover:bg-slate-800 cursor-pointer transition-all disabled:opacity-50"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Trigger Scheduler Sweep</span>
              </button>

              <div className="h-6 w-[1px] bg-slate-200"></div>

              {/* National symbols badge */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                 <span className="text-sm font-bold">🇮🇳</span>
                 <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">Bharat DB Ready</span>
              </div>
            </div>
          </header>

          {/* Main Content Areas with fluid grid and aesthetic Professional colors */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            
            {/* TAB 1: DASHBOARD HOME SCREEN */}
            {activeTab === "dashboard" && (
              <div id="tab-panel-dashboard" className="space-y-6">
                
                {/* Visual statistics grid list */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Transmitted</span>
                      <h4 id="stat-total-sent" className="text-2xl font-extrabold text-slate-900 mt-1">{systemStats.totalSent}</h4>
                      <p className="text-[10px] text-green-600 font-medium mt-1">● WhatsApp & Email Gateways</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                      <Send className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Scheduled Queue</span>
                      <h4 id="stat-pending-count" className="text-2xl font-extrabold text-slate-900 mt-1">{systemStats.pendingCount}</h4>
                      <p className="text-[10px] text-indigo-600 font-medium mt-1">● Waiting in automated thread</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Saved Presets</span>
                      <h4 id="stat-templates-count" className="text-2xl font-extrabold text-slate-900 mt-1">{systemStats.templatesCount}</h4>
                      <p className="text-[10px] text-amber-600 font-medium mt-1">● Supporting 22 Scheduled Langs</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                      <Languages className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Users Status</span>
                      <h4 id="stat-active-users" className="text-2xl font-extrabold text-slate-900 mt-1">{systemStats.usersCount}</h4>
                      <p className="text-[10px] text-blue-600 font-medium mt-1">● Database Registered</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Main Dashboard Rows */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  
                  {/* Left Scheduled queue list table */}
                  <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-display font-bold text-slate-800 text-base">Automatic Dispatch Calendar queue</h3>
                      </div>
                      <button
                        onClick={() => setActiveTab("create")}
                        className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Schedule Greet
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 uppercase font-mono tracking-wider text-[10px]">
                            <th className="pb-3 font-semibold">Recipient details</th>
                            <th className="pb-3 font-semibold">Culture coordinates</th>
                            <th className="pb-3 font-semibold">Timing</th>
                            <th className="pb-3 font-semibold">Channels</th>
                            <th className="pb-3 font-semibold">Status</th>
                            <th className="pb-3 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-slate-700">
                          {greetings.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-400">
                                No greeting schedule requests found. Open "New Greeting" to generate one.
                              </td>
                            </tr>
                          ) : (
                            greetings.map((greet) => (
                              <tr key={greet.id} className="hover:bg-slate-50/50">
                                <td className="py-3.5">
                                  <div className="font-semibold text-slate-800 font-display">{greet.recipientName}</div>
                                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">DOB: {greet.dob} | {greet.gender}</div>
                                </td>
                                <td className="py-3.5">
                                  <div className="flex items-center gap-1.5">
                                     <span className="bg-slate-100 text-slate-600 font-medium px-1.5 py-0.5 rounded text-[10px]">
                                       {greet.language}
                                     </span>
                                     <span className="bg-indigo-50 text-indigo-600 font-semibold px-1.5 py-0.5 rounded text-[10px]">
                                       {greet.relationship}
                                     </span>
                                  </div>
                                </td>
                                <td className="py-3.5 font-mono">
                                  <div>{greet.scheduledTime}</div>
                                  {greet.customTime && <div className="text-[10px] text-slate-400">At {greet.customTime}</div>}
                                </td>
                                <td className="py-3.5">
                                  <div className="flex items-center gap-1 text-[11px]">
                                    {greet.deliveryChannels.map(c => (
                                      <span key={c} className="flex items-center gap-0.5 bg-slate-50 border border-slate-200 text-slate-600 px-1 py-0.5 rounded text-[10px]">
                                        {c === "WhatsApp" ? "💬 WA" : "✉ Mail"}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="py-3.5">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    greet.status === "Sent" 
                                      ? "bg-green-100 text-green-700 font-bold" 
                                      : greet.status === "Failed"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-amber-100 text-amber-700"
                                  }`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${
                                      greet.status === "Sent" ? "bg-green-600" : greet.status === "Failed" ? "bg-red-600" : "bg-amber-500 animate-pulse"
                                    }`} />
                                    {greet.status}
                                  </span>
                                </td>
                                <td className="py-3.5 text-right">
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      title="Open & Send via WhatsApp Web"
                                      onClick={() => {
                                        setWhatsappPendingDispatch({
                                          phone: greet.mobile,
                                          recipientName: greet.recipientName,
                                          text: greet.greetingText
                                        });
                                      }}
                                      className="p-1 rounded text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer flex items-center justify-center border border-transparent hover:border-emerald-100 transition-all"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      title="Delete Request"
                                      onClick={() => deleteGreeting(greet.id)}
                                      className="p-1 rounded text-red-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Side Column: Dynamic stats charts on language and templates distribution */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Languages className="w-4.5 h-4.5 text-indigo-600" />
                          <h3 className="font-display font-bold text-slate-800 text-sm">Scheduled Languages Stats</h3>
                        </div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Metrics</span>
                      </div>

                      {/* Multilingual scheduled distribution breakdown lists matching 22 languages and cultural context */}
                      <div className="space-y-3">
                         {Object.keys(systemStats.languageDistribution).length === 0 ? (
                           <div className="text-center py-4 text-xs text-slate-400">
                             Assemble requests to paint language utilization stats.
                           </div>
                         ) : (
                           Object.entries(systemStats.languageDistribution).map(([lang, count]) => {
                             const pct = Math.min(((count as number) / Math.max(greetings.length, 1)) * 100, 100);
                             return (
                               <div key={lang} className="text-xs">
                                 <div className="flex justify-between items-center text-slate-700 font-medium mb-1">
                                   <span>{lang}</span>
                                   <span>{count as number} ({(pct).toFixed(0)}%)</span>
                                 </div>
                                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div style={{ width: `${pct}%` }} className="h-full bg-indigo-600 rounded-full" />
                                 </div>
                               </div>
                             );
                           })
                         )}
                      </div>
                    </div>

                    {/* Meta WhatsApp and SMTP Delivery simulator live monitoring feeds */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Activity className="w-4.5 h-4.5 text-emerald-500" />
                          <h3 className="font-display font-medium text-slate-800 text-sm">Network Gateways Live Feed</h3>
                        </div>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 px-1.5 py-0.5 rounded-full font-mono">Live</span>
                      </div>

                      <div className="divide-y divide-slate-100 max-h-[185px] overflow-y-auto space-y-2 pr-1 text-xs">
                        {deliveryLogs.slice(0, 3).map((log) => (
                          <div key={log.id} className="pt-2 text-[11px] leading-relaxed">
                            <div className="flex justify-between font-semibold">
                              <span className="text-slate-800">{log.recipientName}</span>
                              <span className={`text-[9px] font-mono ${log.channel === "WhatsApp" ? "text-emerald-600" : "text-blue-500"}`}>{log.channel}</span>
                            </div>
                            <p className="text-slate-500 mt-0.5 truncate">{log.message}</p>
                            <span className="text-[9px] text-slate-400 font-mono block mt-1">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                        ))}
                        {deliveryLogs.length === 0 && (
                          <div className="text-center py-4 text-slate-400 text-xs">No active audits reported.</div>
                        )}
                      </div>

                      <button
                        onClick={() => setActiveTab("logs")}
                        className="w-full text-center py-1.5 border border-slate-200 hover:bg-slate-50 text-indigo-600 text-[11px] font-bold rounded-xl transition-all cursor-pointer block mt-1"
                      >
                        View Comprehensive Auditing Dashboard
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: REQUEST GREETING FORM BLOCK WITH LIVE PREVIEW */}
            {activeTab === "create" && (
              <div id="tab-panel-create">
                
                {/* 2-Column layout for styling based on professional polish config */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Section Form Inputs */}
                  <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h2 className="font-display font-extrabold text-slate-800 text-lg">Assemble Birthday Customization</h2>
                      <p className="text-xs text-slate-400 mt-1">Provide exact coordinates of the Indian recipient, select the style, tone, and generate tailored wishes with Google Gemini AI.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">Recipient Name</label>
                        <input
                          type="text"
                          id="input-recipient-name"
                          value={recipientName}
                          onChange={handleRecipientNameChange}
                          placeholder="e.g. Shri Rajesh Kumar Ji"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">Date of Birth</label>
                        <input
                          type="date"
                          id="input-recipient-dob"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">Phone (WhatsApp Delivery)</label>
                        <input
                          type="tel"
                          id="input-recipient-phone"
                          value={mobileNum}
                          onChange={(e) => setMobileNum(e.target.value)}
                          placeholder="e.g. +91 99887 76655"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">Email ID (PDF Attachment Dispatch)</label>
                        <input
                          type="email"
                          id="input-recipient-email"
                          value={emailId}
                          onChange={(e) => setEmailId(e.target.value)}
                          placeholder="e.g. rajesh.kumar@gov.in"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Gender Coordinate dropdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">Gender Coordinate</label>
                        <div className="flex gap-4 p-2 bg-slate-50 rounded-xl border border-slate-200">
                          {["Male", "Female", "Other"].map(g => (
                            <label key={g} className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                              <input
                                type="radio"
                                name="gender-sel"
                                checked={genderState === g}
                                onChange={() => setGenderState(g as any)}
                                className="accent-indigo-600"
                              />
                              <span>{g}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">Multilingual Scheduled Language (22 Indian)</label>
                        <select
                          id="select-language-scheduled"
                          value={languageState}
                          onChange={(e) => setLanguageState(e.target.value as IndianLanguage)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value={IndianLanguage.Hindi}>{IndianLanguage.Hindi} (हिन्दी)</option>
                          <option value={IndianLanguage.English}>{IndianLanguage.English} (Standard English)</option>
                          <option value={IndianLanguage.Assamese}>{IndianLanguage.Assamese} (অসমীয়া)</option>
                          <option value={IndianLanguage.Bengali}>{IndianLanguage.Bengali} (বাংলা)</option>
                          <option value={IndianLanguage.Bodo}>{IndianLanguage.Bodo} (बर')</option>
                          <option value={IndianLanguage.Dogri}>{IndianLanguage.Dogri} (डोगरी)</option>
                          <option value={IndianLanguage.Gujarati}>{IndianLanguage.Gujarati} (ગુજરાતી)</option>
                          <option value={IndianLanguage.Kannada}>{IndianLanguage.Kannada} (ಕನ್ನಡ)</option>
                          <option value={IndianLanguage.Kashmiri}>{IndianLanguage.Kashmiri} (कॉशुर)</option>
                          <option value={IndianLanguage.Konkani}>{IndianLanguage.Konkani} (कोंकणी)</option>
                          <option value={IndianLanguage.Maithili}>{IndianLanguage.Maithili} (मैथिली)</option>
                          <option value={IndianLanguage.Malayalam}>{IndianLanguage.Malayalam} (മലയാളം)</option>
                          <option value={IndianLanguage.Manipuri}>{IndianLanguage.Manipuri} (Manipuri)</option>
                          <option value={IndianLanguage.Marathi}>{IndianLanguage.Marathi} (मराठी)</option>
                          <option value={IndianLanguage.Nepali}>{IndianLanguage.Nepali} (नेपाली)</option>
                          <option value={IndianLanguage.Odia}>{IndianLanguage.Odia} (ଓଡ଼ିଆ)</option>
                          <option value={IndianLanguage.Punjabi}>{IndianLanguage.Punjabi} (ਪੰਜਾਬੀ)</option>
                          <option value={IndianLanguage.Sanskrit}>{IndianLanguage.Sanskrit} (संस्कृतम्)</option>
                          <option value={IndianLanguage.Santali}>{IndianLanguage.Santali} (Santali)</option>
                          <option value={IndianLanguage.Sindhi}>{IndianLanguage.Sindhi} (سنڌي)</option>
                          <option value={IndianLanguage.Tamil}>{IndianLanguage.Tamil} (தமிழ்)</option>
                          <option value={IndianLanguage.Telugu}>{IndianLanguage.Telugu} (తెలుగు)</option>
                          <option value={IndianLanguage.Urdu}>{IndianLanguage.Urdu} (اُردُو)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Relationship selection coordinate */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">Cultural Relationship</label>
                        <select
                          id="select-relationship-coordinate"
                          value={relationshipState}
                          onChange={(e) => setRelationshipState(e.target.value as Relationship)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer"
                        >
                          <option value={Relationship.Friend}>{Relationship.Friend}</option>
                          <option value={Relationship.Family}>{Relationship.Family}</option>
                          <option value={Relationship.Colleague}>{Relationship.Colleague}</option>
                          <option value={Relationship.Teacher}>{Relationship.Teacher}</option>
                          <option value={Relationship.MP}>{Relationship.MP} / MLA Representative</option>
                          <option value={Relationship.Minister}>{Relationship.Minister} / Cabinet Member</option>
                          <option value={Relationship.Chief_Minister}>{Relationship.Chief_Minister}</option>
                          <option value={Relationship.Governor}>{Relationship.Governor}</option>
                          <option value={Relationship.President}>{Relationship.President}</option>
                          <option value={Relationship.Spiritual_Leader}>{Relationship.Spiritual_Leader}</option>
                        </select>
                      </div>

                      {/* Style selection parameters */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">Greeting Style / Tone</label>
                        <select
                          id="select-greeting-style-tone"
                          value={styleState}
                          onChange={(e) => setStyleState(e.target.value as GreetingStyle)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer"
                        >
                          <option value={GreetingStyle.Formal}>{GreetingStyle.Formal}</option>
                          <option value={GreetingStyle.Official}>{GreetingStyle.Official} & Protocol Oriented</option>
                          <option value={GreetingStyle.Professional}>{GreetingStyle.Professional}</option>
                          <option value={GreetingStyle.Personal}>{GreetingStyle.Personal}</option>
                          <option value={GreetingStyle.Spiritual}>{GreetingStyle.Spiritual}</option>
                          <option value={GreetingStyle.Inspirational}>{GreetingStyle.Inspirational}</option>
                        </select>
                      </div>
                    </div>

                    {/* Integrated AI Message Generator powered by Gemini */}
                    <div className="space-y-2.5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex justify-between items-center sm:flex-row flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <Sparkles className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                          <span className="text-xs font-bold">Autogenerate Tailored Greeting with Gemini AI</span>
                        </div>
                        <button
                          type="button"
                          onClick={generateAIGreet}
                          disabled={loadingAI}
                          id="btn-trigger-ai-generation"
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer self-end"
                        >
                          <Plus className="w-3 h-3" />
                          {loadingAI ? "Crafting native language copy..." : "Generate Greet"}
                        </button>
                      </div>

                      <div className="space-y-1">
                         <label className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">Visual Text Body Content Draft</label>
                         <textarea
                           id="text-greeting-body-draft"
                           rows={4}
                           value={customMsg}
                           onChange={(e) => setCustomMsg(e.target.value)}
                           className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                           placeholder="Tailor native regional greetings for WhatsApp and card prints here..."
                         />
                      </div>
                    </div>

                    {/* Delivery channels & auto-scheduling */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">Automatic Scheduler Time</label>
                        <div className="flex gap-2">
                          <select
                            value={scheduledSlot}
                            onChange={(e) => setScheduledSlot(e.target.value as any)}
                            id="select-scheduler-slot"
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 cursor-pointer"
                          >
                            <option value="12:00 AM">12:00 AM Midnight</option>
                            <option value="03:00 AM">03:00 AM Dawn</option>
                            <option value="06:00 AM">06:00 AM Morning</option>
                            <option value="08:00 AM">08:00 AM Morning</option>
                            <option value="09:00 AM">09:00 AM Standard</option>
                            <option value="Custom">Custom Slot Selector</option>
                          </select>

                          {scheduledSlot === "Custom" && (
                            <input
                              type="time"
                              value={customHourMin}
                              onChange={(e) => setCustomHourMin(e.target.value)}
                              className="w-24 bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 cursor-pointer"
                            />
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                         <label className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">Distribution Channels</label>
                         <div className="flex gap-4 pt-1">
                           <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                             <input
                               type="checkbox"
                               checked={deliveryChannels.includes("WhatsApp")}
                               onChange={(e) => {
                                 if (e.target.checked) setDeliveryChannels([...deliveryChannels, "WhatsApp"]);
                                 else setDeliveryChannels(deliveryChannels.filter(c => c !== "WhatsApp"));
                               }}
                               className="accent-indigo-600 rounded"
                             />
                             <span>WhatsApp API</span>
                           </label>
                           <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                             <input
                               type="checkbox"
                               checked={deliveryChannels.includes("Email")}
                               onChange={(e) => {
                                 if (e.target.checked) setDeliveryChannels([...deliveryChannels, "Email"]);
                                 else setDeliveryChannels(deliveryChannels.filter(c => c !== "Email"));
                               }}
                               className="accent-indigo-600 rounded"
                             />
                             <span>Email Automation</span>
                           </label>
                         </div>
                      </div>
                    </div>

                    {/* Dispatch Options buttons */}
                    <div className="flex items-center gap-3 pt-2">
                       <button
                         type="button"
                         onClick={() => submitGreetingRequest(false)}
                         disabled={submittingRequest}
                         id="btn-schedule-request-submit"
                         className="flex-1 py-3 bg-slate-900 text-white font-semibold text-xs tracking-wider uppercase rounded-xl hover:bg-slate-800 cursor-pointer hover:shadow active:scale-[0.98] disabled:opacity-50 transition-all border border-slate-800"
                       >
                         {submittingRequest ? "Scheduling..." : "Schedule in Calendar"}
                       </button>

                       <button
                         type="button"
                         onClick={() => submitGreetingRequest(true)}
                         disabled={submittingRequest}
                         id="btn-immediate-dispatch-submit"
                         className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs tracking-wider uppercase rounded-xl cursor-pointer hover:shadow hover:shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                       >
                         <Send className="w-3.5 h-3.5" />
                         <span>Immediate Delivery Now</span>
                       </button>
                    </div>

                  </div>

                  {/* Right Section Styling Card Customizer and Real-time Render Component */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* Visual customizer fields */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
                      <div className="flex items-center gap-1.5 text-slate-800">
                        <Sliders className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold uppercase tracking-wider">Style Card Designer</span>
                      </div>

                      {/* Card Customizer Parameters */}
                      <div className="space-y-4 text-xs">
                        {/* Theme selectors */}
                        <div>
                          <label className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Canvas Gradient Preset</label>
                          <div className="grid grid-cols-4 gap-2">
                             {["sunset", "ocean", "lavender", "emerald", "aurora", "royal", "classic"].map((themeKey) => (
                               <button
                                 key={themeKey}
                                 onClick={() => setCardDesign({ ...cardDesign, theme: themeKey as any })}
                                 className={`p-1.5 rounded-lg border text-[10px] uppercase font-bold text-center capitalize transition-all cursor-pointer ${
                                   cardDesign.theme === themeKey ? "border-indigo-600 bg-indigo-50/50 text-indigo-700" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                                 }`}
                               >
                                 {themeKey}
                               </button>
                             ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Typography families */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-400 font-semibold uppercase block">Font Family</label>
                            <select
                              value={cardDesign.fontFamily}
                              onChange={(e) => setCardDesign({ ...cardDesign, fontFamily: e.target.value as any })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px] font-medium"
                            >
                              <option value="sans">Clean Display (Sans-serif)</option>
                              <option value="serif">Heritage Editorial (Serif)</option>
                              <option value="mono">Official Telex (Mono)</option>
                            </select>
                          </div>

                          {/* Typography sizes */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-400 font-semibold uppercase block">Font Size Scale</label>
                            <select
                              value={cardDesign.fontSize}
                              onChange={(e) => setCardDesign({ ...cardDesign, fontSize: e.target.value as any })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px] font-medium"
                            >
                              <option value="medium">Standard size</option>
                              <option value="large">Spacious large</option>
                              <option value="xlarge">Bold display (Extra-large)</option>
                            </select>
                          </div>
                        </div>

                        {/* Card icons/emojis customization */}
                        <div>
                          <label className="text-[10px] font-mono text-slate-400 font-semibold uppercase block mb-1">Corner Motif Emoji</label>
                          <div className="flex gap-2">
                             {["🎂", "🌸", "✨", "🎉", "🎈", "🌟", "👑", "🕊️"].map(emojiChar => (
                               <button
                                 key={emojiChar}
                                 onClick={() => setCardDesign({ ...cardDesign, emoji: emojiChar })}
                                 className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center cursor-pointer transition-all border ${
                                   cardDesign.emoji === emojiChar ? "bg-indigo-50 border-indigo-500" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                                 }`}
                               >
                                 {emojiChar}
                               </button>
                             ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Highly customizable, beautiful preview card element */}
                    <VisualCard
                      recipientName={recipientName}
                      senderName={currentUser?.name || "Ramesh Kesarwani"}
                      greetingText={customMsg}
                      language={languageState}
                      design={cardDesign}
                      phone={mobileNum}
                      onWhatsAppClick={(phone, text) => {
                        setWhatsappPendingDispatch({
                          phone,
                          recipientName: recipientName || "Recipient",
                          text
                        });
                      }}
                    />

                  </div>

                </div>

              </div>
            )}

            {/* TAB 3: MASTER AUTOMATION AUDITING LOGS */}
            {activeTab === "logs" && (
              <div id="tab-panel-logs" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h2 className="font-display font-extrabold text-slate-800 text-lg">System Automation Auditing Trail</h2>
                    <p className="text-xs text-slate-400 mt-1">Review raw network requests, payloads targeting Meta Platforms graph API endpoints, SMTP logs, and attachment signatures.</p>
                  </div>

                  <div className="relative w-full sm:w-64 shrink-0">
                     <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                     <input
                       type="text"
                       value={logsSearchTerm}
                       onChange={(e) => setLogsSearchTerm(e.target.value)}
                       placeholder="Search recipient logs..."
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                     />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredLogs.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">No matching system audit logs found.</div>
                  ) : (
                    filteredLogs.map((log) => (
                      <div key={log.id} className="border border-slate-200 rounded-2xl overflow-hidden transition-all text-xs bg-slate-50/50">
                        <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 text-sm font-display">{log.recipientName}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider ${
                                log.channel === "WhatsApp" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-blue-100 text-blue-800 border border-blue-200"
                              }`}>
                                {log.channel}
                              </span>
                            </div>
                            <p className="text-slate-500 text-[11px] mt-1">{log.message}</p>
                          </div>

                          <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                            <span className="text-[10px] text-slate-400 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-700 border border-green-500/15 rounded font-bold font-mono text-[10px]">
                              ● {log.status}
                            </span>
                            <button
                              onClick={() => setExpandPayloadId(expandPayloadId === log.id ? null : log.id)}
                              className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg cursor-pointer"
                            >
                              {expandPayloadId === log.id ? "Minimize Body" : "Expand JSON Payload"}
                            </button>
                          </div>
                        </div>

                        {expandPayloadId === log.id && (
                          <div className="p-4 bg-slate-900 text-slate-300 font-mono text-[11px] space-y-4 overflow-x-auto border-t border-slate-800">
                            <div>
                              <div className="text-indigo-400 font-bold border-b border-indigo-900 pb-1 mb-2">🚀 NETWORK REQUEST OUTBOUND PAYLOAD</div>
                              <pre className="whitespace-pre">{JSON.stringify(log.payload, null, 2)}</pre>
                            </div>
                            <div>
                              <div className="text-emerald-400 font-bold border-b border-emerald-900 pb-1 mb-2">📩 MIDDLEWARE CONTAINER GATEWAY RESPONSE</div>
                              <pre className="whitespace-pre">{JSON.stringify(log.response, null, 2)}</pre>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* TAB 4: TEMPLATES LIBRARY */}
            {activeTab === "templates" && (
              <div id="tab-panel-templates" className="space-y-6">
                
                {/* Search & Add presets filter blocks */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="font-display font-extrabold text-slate-800 text-base">Multilingual JSON Preset Templates</h2>
                    <p className="text-xs text-slate-400">Supporting all 22 scheduled regional dialects. Search, filter, or append custom copywriting items.</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={templateSearchTerm}
                        onChange={(e) => setTemplateSearchTerm(e.target.value)}
                        placeholder="Search templates..."
                        className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>

                    <select
                      value={templateLangFilter}
                      onChange={(e) => setTemplateLangFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium cursor-pointer"
                    >
                      <option value="All">All Languages ({templates.length})</option>
                      {Object.keys(IndianLanguage).map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Templates Grid List */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTemplates.map((tpl) => (
                    <div key={tpl.id} className="bg-white p-5 rounded-2xl border border-slate-200/85 hover:border-indigo-400/50 shadow-sm hover:shadow transition-all flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                            {tpl.language}
                          </span>
                          
                          <div className="flex gap-1.5">
                             <span className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded text-[9px]">
                               {tpl.style}
                             </span>
                             <span className="bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded text-[9px]">
                               {tpl.relationship}
                             </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed italic text-center py-1">
                          "{tpl.templateText}"
                        </p>
                      </div>

                      <div className="border-t border-slate-100 pt-3.5 mt-4 flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Source: {tpl.isCustom ? "User custom" : "Bharat Core Library"}</span>
                        <button
                          onClick={() => {
                            setLanguageState(tpl.language);
                            setStyleState(tpl.style);
                            setRelationshipState(tpl.relationship);
                            setCustomMsg(tpl.templateText.replace("{{Recipient Name}}", recipientName || "[[Recipient]]"));
                            setActiveTab("create");
                          }}
                          className="text-indigo-600 font-bold hover:underline cursor-pointer"
                        >
                          Use drafting preset →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Custom Presets form for administrators */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm max-w-2xl">
                  <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-3 mb-4">
                    <Database className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-display font-extrabold text-base">Append Custom JSON Drafting Template</h3>
                  </div>

                  <form onSubmit={createCustomTemplate} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Target Language</label>
                        <select
                          value={newTemplateLang}
                          onChange={(e) => setNewTemplateLang(e.target.value as IndianLanguage)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                        >
                          {Object.keys(IndianLanguage).map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Relationship Context</label>
                        <select
                          value={newTemplateRel}
                          onChange={(e) => setNewTemplateRel(e.target.value as Relationship)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                        >
                          {Object.keys(Relationship).map(rel => (
                            <option key={rel} value={rel}>{rel}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Aesthetic style</label>
                        <select
                          value={newTemplateStyle}
                          onChange={(e) => setNewTemplateStyle(e.target.value as GreetingStyle)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                        >
                          {Object.keys(GreetingStyle).map(style => (
                            <option key={style} value={style}>{style}</option>
                          ))}
                        </select>
                      </div>

                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Template text body content</label>
                      <textarea
                        rows={3}
                        value={newTemplateText}
                        onChange={(e) => setNewTemplateText(e.target.value)}
                        placeholder="Write dynamic copy including placeholder tag {{Recipient Name}}..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      Log Template to Core Sandbox DB
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 5: USER PROFILE AND DEV CONSOLE VIEW */}
            {activeTab === "admin" && (
              <div id="tab-panel-admin" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div>
                  <h2 className="font-display font-extrabold text-slate-800 text-lg">Govt. Administration System Console</h2>
                  <p className="text-xs text-slate-400 mt-1">Configure global routing endpoints, adjust distribution protocols, and simulate alternative roles for sandbox compliance verification.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* Account detail console */}
                  <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50 space-y-4 text-xs">
                     <div className="flex items-center gap-2">
                       <ShieldCheck className="w-5 h-5 text-indigo-600" />
                       <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Active Profile Authorization</span>
                     </div>
                     
                     <div className="space-y-2">
                       <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                          <span className="text-slate-400">Legal Name:</span>
                          <span className="font-semibold text-slate-800">{currentUser?.name}</span>
                       </div>
                       <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                          <span className="text-slate-400">Identity Mobile:</span>
                          <span className="font-mono text-slate-800">{currentUser?.mobile}</span>
                       </div>
                       <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                          <span className="text-slate-400">Gateway Email:</span>
                          <span className="font-mono text-slate-800">{currentUser?.email}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-slate-400">Clearance Classification:</span>
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-bold uppercase font-mono text-[9px] uppercase tracking-wider">
                            {currentUser?.role} Mode
                          </span>
                       </div>
                     </div>

                     <div className="pt-2 border-t border-slate-200/60 font-mono text-[10px] text-slate-500 leading-relaxed">
                        Administrators can toggle execution credentials seamlessly inside the panel for audit testing purposes.
                     </div>
                  </div>

                  {/* Sandbox role switcher */}
                  <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50 space-y-4 text-xs">
                     <div className="flex items-center gap-2">
                       <Award className="w-5 h-5 text-indigo-600" />
                       <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Sandbox Regulatory Switch</span>
                     </div>

                     <p className="text-slate-500 leading-relaxed text-[11px]">
                       Choose an active authority role for sandbox demonstrations, highlighting different permission rules on greeting actions.
                     </p>

                     <div className="flex gap-2">
                       <button
                         onClick={() => {
                           if (currentUser) {
                             const updated = { ...currentUser, role: "user" as const };
                             setCurrentUser(updated);
                           }
                         }}
                         className={`flex-1 py-2 rounded-xl text-center font-bold border transition-all cursor-pointer ${
                           currentUser?.role === "user" ? "bg-amber-100 border-amber-300 text-amber-800" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
                         }`}
                       >
                         Regular User Role
                       </button>

                       <button
                         onClick={() => {
                           if (currentUser) {
                             const updated = { ...currentUser, role: "admin" as const };
                             setCurrentUser(updated);
                           }
                         }}
                         className={`flex-1 py-2 rounded-xl text-center font-bold border transition-all cursor-pointer ${
                           currentUser?.role === "admin" ? "bg-indigo-600 border-indigo-700 text-white shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
                         }`}
                       >
                         Government Admin Mode
                       </button>
                     </div>
                  </div>

                </div>

                <div className="p-5 border border-amber-100 bg-amber-50 rounded-2xl text-xs text-amber-800 space-y-2">
                   <div className="flex items-center gap-1.5 font-bold">
                     <AlertCircle className="w-4 h-4 text-amber-600" />
                     <span>National Sandbox Protocol Alert</span>
                   </div>
                   <p className="leading-relaxed text-[11px]">
                     All WhatsApp dispatches utilize the mock endpoint targeting <code>https://graph.facebook.com/v19.0/</code>. SMTP logs contain fully styled HTML preview cards compiled using the custom Canvas drawing buffer. Live Gemini completions prioritize actual credentials stored inside AI Studio Settings context securely.
                   </p>
                </div>
              </div>
            )}

          </div>

        </main>
      )}

      {whatsappPendingDispatch && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-100 shadow-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100 animate-pulse">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-slate-800 text-sm">WhatsApp Web Dispatch Center</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Redirect instantly to WhatsApp Web to deliver this greeting</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWhatsappPendingDispatch(null)}
                className="p-1 px-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg text-xs transition-all cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                <span>To: {whatsappPendingDispatch.recipientName}</span>
                <span>Phone: {whatsappPendingDispatch.phone}</span>
              </div>
              <p className="text-xs text-slate-700 bg-white border border-slate-200 p-3 rounded-xl font-sans leading-relaxed max-h-[120px] overflow-y-auto whitespace-pre-wrap">
                {whatsappPendingDispatch.text}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const url = getWhatsAppWebLink(whatsappPendingDispatch.phone, whatsappPendingDispatch.text);
                  window.open(url, "_blank");
                }}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Send to Recipient (WhatsApp Web)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = getWhatsAppWebLink(currentUser?.mobile || "9999999999", whatsappPendingDispatch.text);
                  window.open(url, "_blank");
                }}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Send to Requester (Forward copy)</span>
              </button>

              <div className="grid grid-cols-2 gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    const url = getWhatsAppMobileLink(whatsappPendingDispatch.phone, whatsappPendingDispatch.text);
                    window.open(url, "_blank");
                  }}
                  className="py-2.5 px-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>WA.me Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(whatsappPendingDispatch.text);
                    alert("Raw greeting text successfully copied to clipboard!");
                  }}
                  className="py-2.5 px-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span>Copy Body Copy</span>
                </button>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center leading-relaxed">
              * Note: web.whatsapp.com requires a desktop login. WA.me link works perfectly on mobile phone apps.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
