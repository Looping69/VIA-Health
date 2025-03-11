import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { HeartPulse, User, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-3 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          prefetch
          className="text-xl font-bold flex items-center gap-2"
        >
          <HeartPulse className="h-6 w-6 text-blue-600" />
          <span className="text-blue-600">VAI Health</span>
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <Link
            href="/#features"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/#testimonials"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Testimonials
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Dashboard
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
