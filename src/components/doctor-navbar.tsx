"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  UserCircle,
  Home,
  HeartPulse,
  MessageSquare,
  Calendar,
  FileText,
  Settings,
  Users,
  ClipboardList,
  Bell,
  BarChart,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DoctorNavbar() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            prefetch
            className="text-xl font-bold flex items-center gap-2"
          >
            <HeartPulse className="h-6 w-6 text-blue-600" />
            <span className="text-blue-600">VAI Health</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 ml-10">
            <Link
              href="/doctor/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/doctor/patients"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Users className="h-4 w-4" />
              Patients
            </Link>
            <Link
              href="/doctor/appointments"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Appointments
            </Link>
            <Link
              href="/doctor/referrals"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ClipboardList className="h-4 w-4" />
              AI Referrals
            </Link>
            <Link
              href="/doctor/messages"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Messages
            </Link>
            <Link
              href="/doctor/analytics"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <BarChart className="h-4 w-4" />
              Analytics
            </Link>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
