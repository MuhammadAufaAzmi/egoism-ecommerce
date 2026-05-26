"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success": return "check_circle";
      case "error": return "error";
      case "warning": return "warning";
      case "info": return "info";
    }
  };

  const getStyle = (type: ToastType) => {
    switch (type) {
      case "success": return "border-emerald-500/40 bg-emerald-950/90 text-emerald-100";
      case "error": return "border-red-500/40 bg-red-950/90 text-red-100";
      case "warning": return "border-amber-500/40 bg-amber-950/90 text-amber-100";
      case "info": return "border-stone-400/40 bg-stone-900/90 text-stone-100";
    }
  };

  const getIconColor = (type: ToastType) => {
    switch (type) {
      case "success": return "text-emerald-400";
      case "error": return "text-red-400";
      case "warning": return "text-amber-400";
      case "info": return "text-stone-300";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-[100px] right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 border backdrop-blur-md shadow-2xl min-w-[300px] max-w-[420px] animate-toast-in ${getStyle(toast.type)}`}
          >
            <span className={`material-symbols-outlined text-[20px] flex-shrink-0 ${getIconColor(toast.type)}`}>
              {getIcon(toast.type)}
            </span>
            <p className="text-[13px] tracking-wide font-medium flex-1">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
