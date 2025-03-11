"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Shield,
  X,
  Users,
  Database,
  Settings,
  LayoutDashboard,
  MessageSquare,
  Calendar,
  FileText,
  Brain,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "../../../supabase/client";

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  // Only render after component has mounted to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const navigateTo = (path: string) => {
    try {
      router.push(path);
      setIsOpen(false);
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback for navigation errors
      window.location.href = path;
    }
  };

  // Don't render anything during SSR or before hydration
  if (!mounted) {
    return null;
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-red-600 hover:bg-red-700 rounded-full p-3 shadow-lg"
        size="icon"
      >
        <Shield className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-red-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="h-5 w-5" /> Admin Control Panel
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-red-700 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 border-dashed"
              onClick={() => navigateTo("/dashboard")}
            >
              <LayoutDashboard className="h-8 w-8 mb-2 text-blue-600" />
              <span>Dashboard</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 border-dashed"
              onClick={() => navigateTo("/dashboard/consultations")}
            >
              <MessageSquare className="h-8 w-8 mb-2 text-green-600" />
              <span>Consultations</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 border-dashed"
              onClick={() => navigateTo("/dashboard/appointments")}
            >
              <Calendar className="h-8 w-8 mb-2 text-purple-600" />
              <span>Appointments</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 border-dashed"
              onClick={() => navigateTo("/dashboard/records")}
            >
              <FileText className="h-8 w-8 mb-2 text-yellow-600" />
              <span>Records</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 border-dashed"
              onClick={() => navigateTo("/dashboard/ai-experts")}
            >
              <Brain className="h-8 w-8 mb-2 text-cyan-600" />
              <span>AI Experts</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 border-dashed"
              onClick={() => navigateTo("/admin/users")}
            >
              <Users className="h-8 w-8 mb-2 text-indigo-600" />
              <span>User Management</span>
            </Button>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigateTo("/admin/database")}
            >
              <Database className="h-5 w-5 mr-2 text-gray-600" />
              Database Management
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigateTo("/admin/settings")}
            >
              <Settings className="h-5 w-5 mr-2 text-gray-600" />
              System Settings
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <Button
                variant="destructive"
                onClick={async () => {
                  try {
                    await supabase.auth.signOut();
                    router.push("/sign-in");
                    setIsOpen(false);
                  } catch (error) {
                    console.error("Sign out error:", error);
                    window.location.href = "/sign-in";
                  }
                }}
              >
                Sign Out
              </Button>
              <Button
                variant="default"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setIsOpen(false)}
              >
                Close Panel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
