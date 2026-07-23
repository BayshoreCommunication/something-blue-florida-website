"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { 
  User, 
  UserPlus, 
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
  CalendarRange 
} from "lucide-react";

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Toggle checkbox selections
  const handleServiceChange = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);
    setStatus(null);

    // Replace the placeholders with your actual EmailJS credentials:
    // Service ID, Template ID, Public Key
    const SERVICE_ID = "service_something_blue"; // Replace with your Service ID
    const TEMPLATE_ID = "template_wedding_inquiry"; // Replace with your Template ID
    const PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY"; // Replace with your Public Key

    if (PUBLIC_KEY === "YOUR_EMAILJS_PUBLIC_KEY") {
      // Mock successful response if API credentials are not set yet
      setTimeout(() => {
        setStatus({
          success: true,
          message: "Demo Mode: Your inquiry was submitted successfully! (Connect your EmailJS keys in ContactForm.tsx to send actual emails)."
        });
        setLoading(false);
        formRef.current?.reset();
        setSelectedServices([]);
      }, 1500);
      return;
    }

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(
        () => {
          setStatus({
            success: true,
            message: "Thank you! Your wedding inquiry has been sent successfully. We will get back to you shortly."
          });
          formRef.current?.reset();
          setSelectedServices([]);
        },
        (error) => {
          console.error("EmailJS Error:", error);
          setStatus({
            success: false,
            message: "Oops! Something went wrong while sending your message. Please try again."
          });
        }
      )
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 py-12">
      {/* Header divider decor */}
      <div className="text-center mb-12">
        {/* Top Gold Divider */}
        <div className="flex items-center justify-center gap-4 mb-4 select-none">
          <div className="h-[1px] w-24 bg-[#BF9F72]/50" />
          <span className="text-[#BF9F72] text-[10px] transform rotate-45">◆</span>
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
          <span className="text-[#BF9F72] text-[10px] transform rotate-45">◆</span>
          <div className="h-[1px] w-24 bg-[#BF9F72]/50" />
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
        
        {/* 2-Column Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* First Name */}
          <div className="flex flex-col">
            <label className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#0b0c10] mb-2 uppercase">
              First Name<span className="text-[#BF9F72] ml-0.5">*</span>
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

          {/* Fiance's First Name */}
          <div className="flex flex-col">
            <label className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#0b0c10] mb-2 uppercase">
              Fiance&rsquo;s First Name<span className="text-[#BF9F72] ml-0.5">*</span>
            </label>
            <div className="relative flex items-center bg-[#FAF8F5] border border-[#BF9F72]/30 rounded-lg overflow-hidden focus-within:border-[#BF9F72] transition-colors duration-300">
              <span className="pl-4 text-[#BF9F72]">
                <UserPlus size={18} />
              </span>
              <input
                required
                type="text"
                name="fiance_name"
                placeholder="Please provide first name"
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
              Event Venue or Location<span className="text-[#BF9F72] ml-0.5">*</span>
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
              What is your budget? (This will help build a proposal that makes sense)<span className="text-[#BF9F72] ml-0.5">*</span>
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
              How many hours do you expect the event to last?<span className="text-[#BF9F72] ml-0.5">*</span>
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
          <label className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#0b0c10] mb-4 uppercase">
            Services that you are interested in<span className="text-[#BF9F72] ml-0.5">*</span>
          </label>

          <input
            type="hidden"
            name="services"
            value={selectedServices.join(", ")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
            
            {/* Photography */}
            <label className="flex items-center gap-3 cursor-pointer group">
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
            <label className="flex items-center gap-3 cursor-pointer group">
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
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedServices.includes("Second Photographer / Videographer")}
                onChange={() => handleServiceChange("Second Photographer / Videographer")}
                className="w-4 h-4 accent-[#BF9F72] cursor-pointer"
              />
              <span className="text-[#BF9F72] select-none group-hover:scale-105 transition-transform duration-200">
                <Users size={18} />
              </span>
              <span className="text-[11px] font-bold tracking-[0.1em] text-gray-800 uppercase font-serif">
                Second Photographer or Videographer
              </span>
            </label>

            {/* Engagement Session */}
            <label className="flex items-center gap-3 cursor-pointer group">
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
            <label className="flex items-center gap-3 cursor-pointer group">
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
                Album/Prints
              </span>
            </label>

            {/* Rehearsal Dinner */}
            <label className="flex items-center gap-3 cursor-pointer group">
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
            <label className="flex items-center gap-3 cursor-pointer group">
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

        {/* Status Alerts */}
        {status && (
          <div
            className={`p-4 rounded-lg text-sm border font-serif ${
              status.success
                ? "bg-[#BF9F72]/10 border-[#BF9F72]/30 text-gray-800"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Submit Section */}
        <div className="flex flex-col items-start gap-4">
          <button
            type="submit"
            disabled={loading}
            className="border-2 border-[#0b0c10] bg-[#0b0c10] text-[#FAF8F5] hover:bg-transparent hover:text-[#0b0c10] transition-colors duration-300 px-10 py-4 text-[11px] font-semibold tracking-[0.25em] uppercase shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Sending Inquiry..." : "Submit Inquiry"} &rarr;
          </button>
          <span className="text-gray-400 text-sm font-serif italic">
            We typically respond within 24–48 hours.
          </span>
        </div>

      </form>
    </div>
  );
}
