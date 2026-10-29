"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

// Simple global toast state
let toastListeners: Array<(toast: ToastData) => void> = [];
let toastIdCounter = 0;

export function toast({
  title,
  description,
  variant = "default",
}: Omit<ToastData, "id">) {
  const id = String(++toastIdCounter);
  toastListeners.forEach((listener) =>
    listener({ id, title, description, variant })
  );
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  React.useEffect(() => {
    const listener = (newToast: ToastData) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 5000);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <ToastPrimitives.Provider swipeDirection="right">
      {toasts.map((t) => (
        <ToastPrimitives.Root
          key={t.id}
          className={cn(
            "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 shadow-lg animate-toast-slide-in",
            "data-[state=closed]:animate-toast-fade-out",
            t.variant === "destructive"
              ? "border-red-200 bg-red-50 text-red-900"
              : t.variant === "success"
              ? "border-green-200 bg-green-50 text-green-900"
              : "border-[#E5E5E5] bg-white text-[#111111]"
          )}
          onOpenChange={(open) => {
            if (!open) {
              setToasts((prev) => prev.filter((toast) => toast.id !== t.id));
            }
          }}
        >
          <div className="flex-1">
            {t.title && (
              <ToastPrimitives.Title className="text-sm font-semibold">
                {t.title}
              </ToastPrimitives.Title>
            )}
            {t.description && (
              <ToastPrimitives.Description className="text-sm opacity-80 mt-1">
                {t.description}
              </ToastPrimitives.Description>
            )}
          </div>
          <ToastPrimitives.Close className="rounded-md p-1 opacity-50 hover:opacity-100 transition-opacity">
            <X className="h-4 w-4" />
          </ToastPrimitives.Close>
        </ToastPrimitives.Root>
      ))}
      <ToastPrimitives.Viewport className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:right-0 sm:top-auto sm:bottom-0 sm:flex-col md:max-w-[420px]" />
    </ToastPrimitives.Provider>
  );
}
