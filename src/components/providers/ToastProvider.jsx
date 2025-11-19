"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1f2937",
          color: "#fff",
          padding: "16px",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
        },

        success: {
          duration: 3000,
          style: {
            background: "#10b981",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#10b981",
          },
        },

        error: {
          duration: 4000,
          style: {
            background: "#ef4444",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#ef4444",
          },
        },

        loading: {
          style: {
            background: "#3b82f6",
          },
        },
      }}
    />
  );
}
