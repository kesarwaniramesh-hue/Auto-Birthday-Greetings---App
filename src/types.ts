/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum IndianLanguage {
  Hindi = "Hindi",
  English = "English",
  Assamese = "Assamese",
  Bengali = "Bengali",
  Bodo = "Bodo",
  Dogri = "Dogri",
  Gujarati = "Gujarati",
  Kannada = "Kannada",
  Kashmiri = "Kashmiri",
  Konkani = "Konkani",
  Maithili = "Maithili",
  Malayalam = "Malayalam",
  Manipuri = "Manipuri",
  Marathi = "Marathi",
  Nepali = "Nepali",
  Odia = "Odia",
  Punjabi = "Punjabi",
  Sanskrit = "Sanskrit",
  Santali = "Santali",
  Sindhi = "Sindhi",
  Tamil = "Tamil",
  Telugu = "Telugu",
  Urdu = "Urdu"
}

export enum Relationship {
  Friend = "Friend",
  Family = "Family",
  Colleague = "Colleague",
  Teacher = "Teacher",
  MP = "MP",
  Minister = "Minister",
  Chief_Minister = "Chief Minister",
  Governor = "Governor",
  President = "President",
  Spiritual_Leader = "Spiritual Leader"
}

export enum GreetingStyle {
  Formal = "Formal",
  Official = "Official",
  Professional = "Professional",
  Personal = "Personal",
  Spiritual = "Spiritual",
  Inspirational = "Inspirational"
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface GreetingCardDesign {
  theme: "sunset" | "ocean" | "lavender" | "emerald" | "aurora" | "royal" | "classic";
  fontFamily: "sans" | "serif" | "mono";
  fontSize: "medium" | "large" | "xlarge";
  accentColor: string;
  emoji: string;
}

export interface GreetingRequest {
  id: string;
  recipientName: string;
  dob: string;
  mobile: string;
  email: string;
  gender: "Male" | "Female" | "Other";
  language: IndianLanguage;
  relationship: Relationship;
  style: GreetingStyle;
  greetingText: string;
  status: "Pending" | "Sent" | "Failed";
  scheduledTime: "12:00 AM" | "03:00 AM" | "06:00 AM" | "08:00 AM" | "09:00 AM" | "Custom";
  customTime?: string; // HH:MM
  deliveryChannels: ("WhatsApp" | "Email")[];
  senderName: string;
  design: GreetingCardDesign;
  createdAt: string;
  attemptsCount: number;
}

export interface DeliveryLog {
  id: string;
  requestId: string;
  recipientName: string;
  channel: "WhatsApp" | "Email";
  status: "Success" | "Failed";
  message: string;
  timestamp: string;
  payload: any;
  response: any;
}

export interface GreetingTemplate {
  id: string;
  language: IndianLanguage;
  style: GreetingStyle;
  relationship: Relationship;
  templateText: string;
  isCustom: boolean;
}

export interface DeliveryStatistics {
  totalSent: number;
  pendingCount: number;
  failedCount: number;
  languageDistribution: Record<IndianLanguage, number>;
  relationshipDistribution: Record<Relationship, number>;
  styleDistribution: Record<GreetingStyle, number>;
  channelDistribution: {
    WhatsApp: number;
    Email: number;
  };
}
