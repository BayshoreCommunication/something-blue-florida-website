"use client";

import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Heart,
  Loader2,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Camera,
  Video,
  Users,
  Image as ImageIcon,
  BookOpen,
  Utensils,
  CalendarRange,
} from "lucide-react";

// EmailJS credentials — fill these in from https://dashboard.emailjs.com
// (Email Services → Service ID, Email Templates → Template ID, Account → Public Key).
// Until all three are set, submitting the form shows an error.
const EMAILJS_SERVICE_ID: string = "";
const EMAILJS_TEMPLATE_ID: string = "";
const EMAILJS_PUBLIC_KEY: string = "";

const SEND_ERROR_MESSAGE =
  "Sorry, we couldn't send your inquiry right now. Please try again, or call us at (509) 592-1745.";

// Tells Google Tag Manager a real inquiry was sent, so it can count the lead.
const trackLead = (email: string, phone: string) => {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "generate_lead", email, phone });
};

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Toggle checkbox selections
  const handleServiceChange = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  const showError = (message: string) => {
    setError(message);
    statusRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    if (selectedServices.length === 0) {
      showError("Please select at least one service you are interested in.");
      return;
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error(
        "EmailJS is not configured. Fill in EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID and EMAILJS_PUBLIC_KEY in ContactForm.tsx.",
      );
      showError(SEND_ERROR_MESSAGE);
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(formRef.current);
    const leadEmail = String(formData.get("email") ?? "");
    const leadPhone = String(formData.get("phone") ?? "");

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
      trackLead(leadEmail, leadPhone);
      formRef.current?.reset();
      setSelectedServices([]);
      setShowSuccess(true);
    } catch (err) {
      console.error("EmailJS Error:", err);
      showError(SEND_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 py-12"
    >
      {/* Header divider decor */}
      <div className="text-center mb-12">
        {/* Top Gold Divider */}
        <div className="flex items-center justify-center gap-4 mb-4 select-none">
          <div className="h-[1px] w-24 bg-[#BF9F72]/50" />
          <span className="text-[#BF9F72] text-[10px] transform rotate-45">
            ◆
          </span>
          <div className="h-[1px] w-24 bg-[#BF9F72]/50" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-normal text-[#0b0c10] tracking-wide font-serif mb-3">
          Connect With Us
        </h2>
        <p className="text-[11px] sm:text-[12px] font-medium tracking-[0.25em] text-[#0b0c10]/70 uppercase font-serif">
          We&rsquo;d Love To Hear All About Your Dream Day
        </p>

        {/* Bottom Gold Divider */}
        <div className="flex items-center justify-center gap-4 mt-4 select-none">
          <div className="h-[1px] w-24 bg-[#BF9F72]/50" />
          <span className="text-[#BF9F72] text-[10px] transform rotate-45">
            ◆
          </span>
          <div className="h-[1px] w-24 bg-[#BF9F72]/50" />
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
        {/* 2-Column Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* First Name */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#0b0c10] mb-2 uppercase">
              Your Name<span className="text-[#BF9F72] ml-0.5">*</span>
            </label>
            <div className="relative flex items-center bg-[#FAF8F5] border border-[#BF9F72]/30 rounded-lg overflow-hidden focus-within:border-[#BF9F72] transition-colors duration-300">
              <span className="pl-4 text-[#BF9F72]">
                <User size={18} />
              </span>
              <input
                required
                type="text"
                name="first_name"
                placeholder="Please provide your first name"
                className="w-full py-3.5 pl-3 pr-4 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none font-serif"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#0b0c10] mb-2 uppercase">
              Email<span className="text-[#BF9F72] ml-0.5">*</span>
            </label>
            <div className="relative flex items-center bg-[#FAF8F5] border border-[#BF9F72]/30 rounded-lg overflow-hidden focus-within:border-[#BF9F72] transition-colors duration-300">
              <span className="pl-4 text-[#BF9F72]">
                <Mail size={18} />
              </span>
              <input
                required
                type="email"
                name="email"
                placeholder="Please provide your email address"
                className="w-full py-3.5 pl-3 pr-4 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none font-serif"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#0b0c10] mb-2 uppercase">
              Phone Number<span className="text-[#BF9F72] ml-0.5">*</span>
            </label>
            <div className="relative flex items-center bg-[#FAF8F5] border border-[#BF9F72]/30 rounded-lg overflow-hidden focus-within:border-[#BF9F72] transition-colors duration-300">
              <span className="pl-4 text-[#BF9F72]">
                <Phone size={18} />
              </span>
              <input
                required
                type="tel"
                name="phone"
                placeholder="Please provide your phone number"
                className="w-full py-3.5 pl-3 pr-4 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none font-serif"
              />
            </div>
          </div>

          {/* Event Date */}
          <div className="flex flex-col">
            <label className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#0b0c10] mb-2 uppercase">
              Event Date<span className="text-[#BF9F72] ml-0.5">*</span>
            </label>
            <div className="relative flex items-center bg-[#FAF8F5] border border-[#BF9F72]/30 rounded-lg overflow-hidden focus-within:border-[#BF9F72] transition-colors duration-300">
              <span className="pl-4 text-[#BF9F72] pointer-events-none">
                <Calendar size={18} />
              </span>
              <input
                required
                type="date"
                name="event_date"
                className="w-full py-3.5 pl-3 pr-4 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none font-serif cursor-pointer uppercase text-[12px]"
              />
            </div>
          </div>

          {/* Event Venue or Location */}
          <div className="flex flex-col">
            <label className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#0b0c10] mb-2 uppercase">
              Event Venue or Location
              <span className="text-[#BF9F72] ml-0.5">*</span>
            </label>
            <div className="relative flex items-center bg-[#FAF8F5] border border-[#BF9F72]/30 rounded-lg overflow-hidden focus-within:border-[#BF9F72] transition-colors duration-300">
              <span className="pl-4 text-[#BF9F72]">
                <MapPin size={18} />
              </span>
              <input
                required
                type="text"
                name="venue"
                placeholder="Please include City and State"
                className="w-full py-3.5 pl-3 pr-4 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none font-serif"
              />
            </div>
          </div>

          {/* Budget */}
          <div className="flex flex-col">
            <label className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#0b0c10] mb-2 uppercase">
              What is your budget? (This will help build a proposal that makes
              sense)<span className="text-[#BF9F72] ml-0.5">*</span>
            </label>
            <div className="relative flex items-center bg-[#FAF8F5] border border-[#BF9F72]/30 rounded-lg overflow-hidden focus-within:border-[#BF9F72] transition-colors duration-300">
              <span className="pl-4 text-[#BF9F72]">
                <DollarSign size={18} />
              </span>
              <input
                required
                type="text"
                name="budget"
                placeholder="Enter your budget range"
                className="w-full py-3.5 pl-3 pr-4 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none font-serif"
              />
            </div>
          </div>

          {/* Event Hours Duration */}
          <div className="flex flex-col">
            <label className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#0b0c10] mb-2 uppercase">
              How many hours do you expect the event to last?
              <span className="text-[#BF9F72] ml-0.5">*</span>
            </label>
            <div className="relative flex items-center bg-[#FAF8F5] border border-[#BF9F72]/30 rounded-lg overflow-hidden focus-within:border-[#BF9F72] transition-colors duration-300">
              <span className="pl-4 text-[#BF9F72]">
                <Clock size={18} />
              </span>
              <input
                required
                type="text"
                name="duration"
                placeholder="e.g. 6 hours"
                className="w-full py-3.5 pl-3 pr-4 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none font-serif"
              />
            </div>
          </div>
        </div>

        {/* Services Checkboxes */}
        <div className="flex flex-col">
          <h3 className="text-xl sm:text-2xl font-normal text-[#0b0c10] tracking-wide font-serif mb-2">
            Build Your Wedding Coverage
            <span className="text-[#BF9F72] ml-0.5">*</span>
          </h3>
          <p className="text-[13px] sm:text-[14px] text-gray-600 font-serif tracking-wide mb-4">
            Every package is tailored to your day. Choose from:
          </p>

          <input
            type="hidden"
            name="services"
            value={selectedServices.join(", ")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
            {/* Photography */}
            <label className="flex items-center gap-3 p-3 rounded-lg border border-[#BF9F72]/20 bg-[#FAF8F5]/50 hover:border-[#BF9F72] transition-all duration-200 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedServices.includes("Photography")}
                onChange={() => handleServiceChange("Photography")}
                className="w-4 h-4 accent-[#BF9F72] cursor-pointer"
              />
              <span className="text-[#BF9F72] select-none group-hover:scale-105 transition-transform duration-200">
                <Camera size={18} />
              </span>
              <span className="text-[11px] font-bold tracking-[0.1em] text-gray-800 uppercase font-serif">
                Photography
              </span>
            </label>

            {/* Videography */}
            <label className="flex items-center gap-3 p-3 rounded-lg border border-[#BF9F72]/20 bg-[#FAF8F5]/50 hover:border-[#BF9F72] transition-all duration-200 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedServices.includes("Videography")}
                onChange={() => handleServiceChange("Videography")}
                className="w-4 h-4 accent-[#BF9F72] cursor-pointer"
              />
              <span className="text-[#BF9F72] select-none group-hover:scale-105 transition-transform duration-200">
                <Video size={18} />
              </span>
              <span className="text-[11px] font-bold tracking-[0.1em] text-gray-800 uppercase font-serif">
                Videography
              </span>
            </label>

            {/* Second Photographer */}
            <label className="flex items-center gap-3 p-3 rounded-lg border border-[#BF9F72]/20 bg-[#FAF8F5]/50 hover:border-[#BF9F72] transition-all duration-200 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedServices.includes(
                  "Second Photographer / Videographer",
                )}
                onChange={() =>
                  handleServiceChange("Second Photographer / Videographer")
                }
                className="w-4 h-4 accent-[#BF9F72] cursor-pointer"
              />
              <span className="text-[#BF9F72] select-none group-hover:scale-105 transition-transform duration-200">
                <Users size={18} />
              </span>
              <span className="text-[11px] font-bold tracking-[0.1em] text-gray-800 uppercase font-serif">
                Second Photographer / Videographer
              </span>
            </label>

            {/* Engagement Session */}
            <label className="flex items-center gap-3 p-3 rounded-lg border border-[#BF9F72]/20 bg-[#FAF8F5]/50 hover:border-[#BF9F72] transition-all duration-200 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedServices.includes("Engagement Session")}
                onChange={() => handleServiceChange("Engagement Session")}
                className="w-4 h-4 accent-[#BF9F72] cursor-pointer"
              />
              <span className="text-[#BF9F72] select-none group-hover:scale-105 transition-transform duration-200">
                <ImageIcon size={18} />
              </span>
              <span className="text-[11px] font-bold tracking-[0.1em] text-gray-800 uppercase font-serif">
                Engagement Session
              </span>
            </label>

            {/* Album / Prints */}
            <label className="flex items-center gap-3 p-3 rounded-lg border border-[#BF9F72]/20 bg-[#FAF8F5]/50 hover:border-[#BF9F72] transition-all duration-200 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedServices.includes("Album / Prints")}
                onChange={() => handleServiceChange("Album / Prints")}
                className="w-4 h-4 accent-[#BF9F72] cursor-pointer"
              />
              <span className="text-[#BF9F72] select-none group-hover:scale-105 transition-transform duration-200">
                <BookOpen size={18} />
              </span>
              <span className="text-[11px] font-bold tracking-[0.1em] text-gray-800 uppercase font-serif">
                Album / Prints
              </span>
            </label>

            {/* Rehearsal Dinner */}
            <label className="flex items-center gap-3 p-3 rounded-lg border border-[#BF9F72]/20 bg-[#FAF8F5]/50 hover:border-[#BF9F72] transition-all duration-200 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedServices.includes("Rehearsal Dinner")}
                onChange={() => handleServiceChange("Rehearsal Dinner")}
                className="w-4 h-4 accent-[#BF9F72] cursor-pointer"
              />
              <span className="text-[#BF9F72] select-none group-hover:scale-105 transition-transform duration-200">
                <Utensils size={18} />
              </span>
              <span className="text-[11px] font-bold tracking-[0.1em] text-gray-800 uppercase font-serif">
                Rehearsal Dinner
              </span>
            </label>

            {/* Multi-Day Event */}
            <label className="flex items-center gap-3 p-3 rounded-lg border border-[#BF9F72]/20 bg-[#FAF8F5]/50 hover:border-[#BF9F72] transition-all duration-200 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedServices.includes("Multi-Day Event")}
                onChange={() => handleServiceChange("Multi-Day Event")}
                className="w-4 h-4 accent-[#BF9F72] cursor-pointer"
              />
              <span className="text-[#BF9F72] select-none group-hover:scale-105 transition-transform duration-200">
                <CalendarRange size={18} />
              </span>
              <span className="text-[11px] font-bold tracking-[0.1em] text-gray-800 uppercase font-serif">
                Multi-Day Event
              </span>
            </label>
          </div>
        </div>

        {/* Error Alert */}
        <div ref={statusRef} aria-live="polite">
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 p-4 rounded-lg text-sm border font-serif bg-red-50 border-red-200 text-red-700"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Submit Section */}
        <div className="flex flex-col items-start gap-4">
          <button
            type="submit"
            disabled={loading}
            className="border-2 border-[#0b0c10] bg-[#0b0c10] text-[#FAF8F5] hover:bg-transparent hover:text-[#0b0c10] transition-colors duration-300 px-10 py-4 text-[11px] font-semibold tracking-[0.25em] uppercase shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Sending
                Inquiry...
              </>
            ) : (
              <>Submit Inquiry &rarr;</>
            )}
          </button>
          <span className="text-gray-400 text-sm font-serif italic">
            We typically respond within 24 hours.
          </span>
        </div>
      </form>

      <SuccessPopup open={showSuccess} onClose={() => setShowSuccess(false)} />
    </section>
  );
}

function SuccessPopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Close on Escape and stop the page behind from scrolling while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b0c10]/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-success-title"
            className="relative w-full max-w-md bg-[#FAF8F5] rounded-2xl shadow-2xl px-8 pt-12 pb-9 text-center overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Inner gold frame */}
            <div className="pointer-events-none absolute inset-3 rounded-xl border border-[#BF9F72]/40" />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-5 right-5 p-1.5 rounded-full text-[#0b0c10]/50 hover:text-[#0b0c10] hover:bg-[#BF9F72]/10 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Heart badge */}
            <motion.div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#BF9F72]/15 ring-1 ring-[#BF9F72]/40"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 14 }}
            >
              <Heart size={28} className="text-[#BF9F72]" fill="#BF9F72" />
            </motion.div>

            <h3
              id="inquiry-success-title"
              className="text-3xl sm:text-4xl font-normal text-[#0b0c10] tracking-wide font-serif"
            >
              Congratulations!
            </h3>

            <div className="flex items-center justify-center gap-3 my-5 select-none">
              <div className="h-[1px] w-14 bg-[#BF9F72]/50" />
              <span className="text-[#BF9F72] text-[9px] rotate-45">◆</span>
              <div className="h-[1px] w-14 bg-[#BF9F72]/50" />
            </div>

            <p className="text-[15px] leading-relaxed text-gray-700 font-serif">
              Your inquiry made our day. 💛
              <br />
              We&rsquo;ll give you a call within 24 hours at
            </p>
            <a
              href="tel:+15095921745"
              className="inline-block mt-2 text-lg font-serif tracking-wide text-[#0b0c10] border-b border-[#BF9F72]/60 hover:border-[#BF9F72] transition-colors"
            >
              (509) 592-1745
            </a>
            <p className="mt-5 text-[15px] italic text-gray-600 font-serif">
              We can&rsquo;t wait to hear your love story!
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-8 border-2 border-[#0b0c10] bg-[#0b0c10] text-[#FAF8F5] hover:bg-transparent hover:text-[#0b0c10] transition-colors duration-300 px-10 py-3.5 text-[11px] font-semibold tracking-[0.25em] uppercase"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
