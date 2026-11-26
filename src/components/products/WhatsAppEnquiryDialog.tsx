"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin, MessageCircle, X } from "lucide-react";
import { whatsappLink } from "@/lib/contact";

const LOCATION_KEY = "atl:enquiry-location";

export type EnquiryLine = { label: string; value: string };

/**
 * Asks for the visitor's location, then opens WhatsApp with the product details and that location.
 * `lines` are the product details (name, model, chosen options, price) shown here and sent in the message.
 */
export function WhatsAppEnquiryDialog({
  open,
  onClose,
  lines,
  hint,
}: {
  open: boolean;
  onClose: () => void;
  lines: EnquiryLine[];
  /** Shown under the summary, e.g. options the visitor hasn't chosen yet. */
  hint?: string;
}) {
  const [location, setLocation] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const errorId = useId();
  // Latest onClose without re-running the open effect (which would reset the field) on every render.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // On open: prefill the last location used, focus the field, lock scroll, close on Escape,
  // keep Tab inside, and give focus back to the button that opened it on close.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    try {
      const saved = localStorage.getItem(LOCATION_KEY);
      if (saved) setLocation(saved);
    } catch {
      /* storage unavailable: start empty */
    }
    setError(false);
    const root = document.documentElement;
    root.style.overflow = "hidden";
    root.dataset.dialogOpen = ""; // hides the floating WhatsApp button behind the dialog
    requestAnimationFrame(() => inputRef.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onCloseRef.current();
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button, input"));
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      delete root.dataset.dialogOpen;
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const place = location.trim().replace(/\s+/g, " ");
    if (place.length < 2) {
      setError(true);
      inputRef.current?.focus();
      return;
    }
    try {
      localStorage.setItem(LOCATION_KEY, place);
    } catch {
      /* not remembered: fine */
    }

    const message = [
      "Hi, I would like to enquire about this product.",
      "",
      ...lines.map((l) => `*${l.label}:* ${l.value}`),
      `*Link:* ${window.location.origin}${window.location.pathname}`,
      "",
      `*My location:* ${place}`,
    ].join("\n");

    const url = whatsappLink(message);
    // A new tab on desktop; if the browser blocks it, go there in this tab instead.
    const tab = window.open(url, "_blank", "noopener,noreferrer");
    if (!tab) window.location.href = url;
    onClose();
  }

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-[#080c15]/55 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-300 sm:rounded-3xl sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-secondary/70 transition-colors hover:bg-muted hover:text-secondary"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 id={titleId} className="pr-10 font-heading text-xl font-extrabold tracking-tight text-foreground">
          Where are you located?
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Tell us your town or area so we can share the right price, delivery and service details.
        </p>

        {/* What will be sent */}
        <dl className="mt-5 space-y-1.5 rounded-2xl border border-border bg-muted/40 px-4 py-3.5 text-sm">
          {lines.map((l) => (
            <div key={l.label} className="flex gap-3">
              <dt className="w-24 flex-shrink-0 text-muted-foreground">{l.label}</dt>
              <dd className="min-w-0 font-semibold text-foreground">{l.value}</dd>
            </div>
          ))}
        </dl>
        {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}

        <form onSubmit={submit} noValidate className="mt-5">
          <label htmlFor={`${titleId}-loc`} className="text-sm font-semibold text-foreground">
            Your location
          </label>
          <div
            className={`mt-2 flex h-12 items-center rounded-xl border bg-white transition-colors focus-within:border-secondary/50 ${
              error ? "border-primary" : "border-secondary/15"
            }`}
          >
            <MapPin className="ml-3.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              id={`${titleId}-loc`}
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (error) setError(false);
              }}
              autoComplete="address-level2"
              maxLength={80}
              placeholder="e.g. Kakkanad, Kochi"
              aria-invalid={error}
              aria-describedby={error ? errorId : undefined}
              className="h-full w-full bg-transparent px-3 text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          {error && (
            <p id={errorId} className="mt-1.5 text-sm font-medium text-primary">
              Please type your town or area.
            </p>
          )}

          <button
            type="submit"
            className="mt-5 inline-flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] py-3.5 text-base font-bold text-white shadow-[0_10px_24px_-10px_rgba(37,211,102,0.7)] transition-colors hover:bg-[#1fb857] outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50 focus-visible:ring-offset-2"
          >
            <MessageCircle className="h-5 w-5" /> Continue to WhatsApp
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
