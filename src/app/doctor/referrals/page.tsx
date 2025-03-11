import DoctorNavbar from "@/components/doctor-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  UserCircle,
  Brain,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function ReferralsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user is a doctor
  const { data: doctorData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!doctorData || doctorData.role !== "doctor") {
    return redirect("/dashboard");
  }

  // Mock AI referrals data
  const referrals = [
    {
      id: "r1",
      patient: "David Kim",
      age: 38,
      gender: "Male",
      date: "Today",
      time: "9:15 AM",
      aiExpert: "Dr. AI Cardiologist",
      symptoms:
        "Chest pain, shortness of breath, dizziness when standing up quickly",
      assessment: "Potential cardiovascular issue requiring prompt evaluation",
      severity: "high",
      status: "pending",
    },
    {
      id: "r2",
      patient: "Jennifer Lee",
      age: 29,
      gender: "Female",
      date: "Yesterday",
      time: "4:30 PM",
      aiExpert: "Dr. AI Dermatologist",
      symptoms: "Persistent skin rash with itching, redness, and small bumps",
      assessment: "Possible allergic reaction or eczema",
      severity: "medium",
      status: "pending",
    },
    {
      id: "r3",
      patient: "Robert Garcia",
      age: 67,
      gender: "Male",
      date: "Yesterday",
      time: "2:15 PM",
      aiExpert: "Dr. AI Neurologist",
      symptoms:
        "Recurring headaches, sensitivity to light, occasional blurred vision",
      assessment:
        "Migraine symptoms with potential need for preventive treatment",
      severity: "medium",
      status: "pending",
    },
    {
      id: "r4",
      patient: "Sarah Johnson",
      age: 42,
      gender: "Female",
      date: "May 2, 2023",
      time: "11:00 AM",
      aiExpert: "Dr. AI Cardiologist",
      symptoms: "Elevated blood pressure readings, occasional headaches",
      assessment: "Hypertension requiring medication adjustment",
      severity: "medium",
      status: "accepted",
    },
    {
      id: "r5",
      patient: "Michael Chen",
      age: 35,
      gender: "Male",
      date: "May 1, 2023",
      time: "3:45 PM",
      aiExpert: "Dr. AI Pulmonologist",
      symptoms: "Wheezing, shortness of breath during physical activity",
      assessment: "Asthma exacerbation possibly requiring inhaler adjustment",
      severity: "low",
      status: "accepted",
    },
    {
      id: "r6",
      patient: "Emily Rodriguez",
      age: 28,
      gender: "Female",
      date: "April 30, 2023",
      time: "10:30 AM",
      aiExpert: "Dr. AI Allergist",
      symptoms: "Seasonal sneezing, itchy eyes, nasal congestion",
      assessment: "Seasonal allergies requiring antihistamine treatment",
      severity: "low",
      status: "declined",
      reason: "Symptoms manageable with over-the-counter medications",
    },
  ];

  return (
    <>
      <DoctorNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">AI Referrals</h1>
              <p className="text-gray-500 mt-1">
                Review and manage patient cases referred by AI experts
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Accept All
              </Button>
            </div>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">High Priority</p>
                <h3 className="text-2xl font-bold">1</h3>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Medium Priority</p>
                <h3 className="text-2xl font-bold">2</h3>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Pending</p>
                <h3 className="text-2xl font-bold">3</h3>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search referrals..."
                className="pl-10 w-full"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Referrals List */}
          <div className="grid grid-cols-1 gap-4">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden ${referral.severity === "high" ? "border-l-4 border-l-red-500" : referral.severity === "medium" ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-green-500"}`}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <UserCircle className="h-12 w-12 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {referral.patient}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {referral.age} years, {referral.gender}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {referral.date}, {referral.time}
                        </span>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-full text-xs ${referral.severity === "high" ? "bg-red-100 text-red-700" : referral.severity === "medium" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}
                      >
                        {referral.severity === "high"
                          ? "High Priority"
                          : referral.severity === "medium"
                            ? "Medium Priority"
                            : "Low Priority"}
                      </div>

                      <div
                        className={`px-3 py-1 rounded-full text-xs ${referral.status === "pending" ? "bg-blue-100 text-blue-700" : referral.status === "accepted" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {referral.status === "pending"
                          ? "Pending Review"
                          : referral.status === "accepted"
                            ? "Accepted"
                            : "Declined"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-blue-100 p-2 rounded-full mt-0.5">
                        <Brain className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          AI Expert: {referral.aiExpert}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Symptoms
                        </h4>
                        <p className="text-sm">{referral.symptoms}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          AI Assessment
                        </h4>
                        <p className="text-sm">{referral.assessment}</p>
                      </div>
                    </div>

                    {referral.reason && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Decline Reason
                        </h4>
                        <p className="text-sm">{referral.reason}</p>
                      </div>
                    )}
                  </div>

                  {referral.status === "pending" && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        Review Full Case
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept Referral
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Decline
                      </Button>
                    </div>
                  )}

                  {referral.status === "accepted" && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        View Patient Record
                      </Button>
                      <Button size="sm" variant="outline">
                        Schedule Appointment
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
