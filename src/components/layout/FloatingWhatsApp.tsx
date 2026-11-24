"use client";

import { MessageSquare } from "lucide-react";
import { whatsappLink } from "@/lib/contact";

export default function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="floating-whatsapp fixed bottom-6 right-6 z-50 flex items-center gap-2 group"
    >
      <span className="hidden group-hover:flex items-center bg-white text-green-700 font-bold text-sm px-4 py-2 rounded-full shadow-lg border border-green-100 transition-all">
        Chat with us
      </span>
      <div className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-xl shadow-green-500/30 flex items-center justify-center transition-all hover:scale-110">
        <MessageSquare className="w-7 h-7 text-white" />
      </div>
    </a>
  );
}
