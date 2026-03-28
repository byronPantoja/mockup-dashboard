"use client";

import { useState, type FormEvent } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

type ModalState = "form" | "submitting" | "success";

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [state, setState] = useState<ModalState>("form");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setState("submitting");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      role: (form.elements.namedItem("role") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setState("success");
      setTimeout(() => {
        onClose();
        setState("form");
      }, 4000);
    } catch {
      setState("form");
      setError(
        "Something went wrong. Please try me at itsme@byronpantoja.com"
      );
    }
  }

  function handleClose() {
    onClose();
    setState("form");
    setError(null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-backdrop-in"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl bg-surface-lowest/90 backdrop-blur-[20px] p-6 shadow-ambient-lg animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 rounded-xl p-1.5 text-on-surface/40 hover:text-on-surface hover:bg-surface-low transition-colors"
        >
          <X size={18} />
        </button>

        {state === "success" ? (
          /* Success state */
          <div className="text-center py-8 animate-fade-in">
            <div className="size-16 rounded-full bg-secondary-container flex items-center justify-center mx-auto mb-4 animate-confetti-pop">
              <CheckCircle2 size={32} className="text-on-secondary-container" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">
              Lead captured!
            </h3>
            <p className="text-sm text-on-surface/60 leading-relaxed max-w-xs mx-auto">
              This data was just sent to the PostgreSQL database and is now
              visible in the admin view.
            </p>
          </div>
        ) : (
          /* Form state */
          <>
            <h3 className="text-lg font-semibold text-on-surface mb-1">
              Get in touch
            </h3>
            <p className="text-sm text-on-surface/50 mb-6">
              I&apos;d love to hear about your project or opportunity.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] mb-1.5">
                    Name *
                  </label>
                  <input
                    name="name"
                    required
                    className="w-full rounded-xl bg-surface-low px-3 py-2 text-sm text-on-surface placeholder:text-on-surface/30 outline-none focus:bg-surface-lowest focus:shadow-ambient transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] mb-1.5">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-xl bg-surface-low px-3 py-2 text-sm text-on-surface placeholder:text-on-surface/30 outline-none focus:bg-surface-lowest focus:shadow-ambient transition-all"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] mb-1.5">
                    Company
                  </label>
                  <input
                    name="company"
                    className="w-full rounded-xl bg-surface-low px-3 py-2 text-sm text-on-surface placeholder:text-on-surface/30 outline-none focus:bg-surface-lowest focus:shadow-ambient transition-all"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="block text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] mb-1.5">
                    Role / Title
                  </label>
                  <input
                    name="role"
                    className="w-full rounded-xl bg-surface-low px-3 py-2 text-sm text-on-surface placeholder:text-on-surface/30 outline-none focus:bg-surface-lowest focus:shadow-ambient transition-all"
                    placeholder="Your role"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={3}
                  className="w-full rounded-xl bg-surface-low px-3 py-2 text-sm text-on-surface placeholder:text-on-surface/30 outline-none focus:bg-surface-lowest focus:shadow-ambient transition-all resize-none"
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 animate-fade-in">{error}</p>
              )}

              <button
                type="submit"
                disabled={state === "submitting"}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-dim px-4 py-2.5 text-sm font-medium text-on-primary hover:opacity-90 transition-opacity shadow-ambient disabled:opacity-50"
              >
                {state === "submitting" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
