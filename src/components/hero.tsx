import Link from "next/link";
import { ArrowUpRight, Check, HeartPulse } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                AI-Powered Healthcare
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 block mt-2">
                  For Everyone
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
                Connect with AI-assisted medical consultations and real doctors
                through our secure, HIPAA-compliant platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium w-full sm:w-auto justify-center"
                >
                  Start Consultation
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Link>

                <Link
                  href="/sign-up"
                  className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium w-full sm:w-auto justify-center"
                >
                  Create Account
                </Link>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>24/7 AI Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Expert Doctors</span>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
                  alt="Doctor using tablet with patient"
                  width={600}
                  height={400}
                  className="object-cover rounded-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/70 to-transparent p-6">
                  <div className="flex items-center gap-3 text-white">
                    <HeartPulse className="w-6 h-6 text-blue-200" />
                    <span className="font-medium">
                      AI-powered health monitoring
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-blue-100 rounded-full p-4 shadow-lg border-2 border-white">
                <HeartPulse className="w-8 h-8 text-blue-600" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-cyan-100 rounded-full p-3 shadow-lg border-2 border-white">
                <svg
                  className="w-6 h-6 text-cyan-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
