// components/ProtectedLayout.tsx
"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/navbar/Navbar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to / (Home) when the user becomes null (logout, session expiry, cross‑tab)
  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    }
  }, [user]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // While user is null (first check), show a brief spinner
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fcf8ff]">
      {/* Mobile sidebar (overlay) – hidden on desktop, slides in from left */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <DashboardSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Desktop sidebar – always visible, no animation */}
      <div className="hidden lg:block w-[260px] shrink-0">
        <DashboardSidebar />
      </div>

      {/* Overlay when mobile sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area – disable clicks on mobile when sidebar open */}
      <div
        className={`flex-1 flex flex-col min-h-screen lg:pointer-events-auto ${sidebarOpen ? "pointer-events-none" : ""
          }`}
      >
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 md:px-8 py-4 md:py-8 max-w-container-max w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}