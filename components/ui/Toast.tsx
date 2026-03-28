"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import type { ToastData } from "@/lib/types";

export function useToasts() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => {
        if (prev.length === 0) return prev;
        return prev.map((t, i) => (i === 0 ? { ...t, exiting: true } : t));
      });
      setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 200);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toasts]);

  const addToast = useCallback((message: string) => {
    setToasts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), message, exiting: false },
    ]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  return { toasts, addToast, dismissToast };
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 rounded-xl bg-on-surface px-4 py-3 text-sm text-surface-lowest shadow-ambient-lg ${
            t.exiting ? "animate-toast-out" : "animate-toast-in"
          }`}
        >
          <CheckCircle2 size={16} className="text-secondary-container shrink-0" />
          <span>{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="ml-2 text-surface-high hover:text-surface-lowest transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
