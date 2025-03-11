import DoctorNavbar from "@/components/doctor-navbar";
import {
  Activity,
  Calendar,
  Clock,
  MessageSquare,
  UserCircle,
  Users,
  Video,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Search,
  Filter,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default async function DoctorDashboard() {
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

  // Mock upcoming appointments
  const upcomingAppointments = [
    {
      id: "a1",
      patient: "Sarah Johnson",
      age: 42,
      date: "Today",
      time: "10:00 AM",
      type: "virtual",
      status: "confirmed",
      reason: "Follow-up on hypertension medication",
    },
    {
      id: "a2",
      patient: "Michael Chen",
      age: 35,
      date: "Today",
      time: "11:30 AM",
      type: "in-person",
      status: "confirmed",
      reason: "Annual physical examination",
    },
    {
      id: "a3",
      patient: "Emily Rodriguez",
      age: 28,
      date: "Today",
      time: "2:15 PM",
      type: "virtual",
      status: "confirmed",
      reason: "Skin rash consultation",
    },
  ];

  // Mock recent patients
  const recentPatients = [
    {
      id: "p1",
      name: "James Wilson",
      age: 52,
      lastVisit: "Yesterday",
      condition: "Diabetes Type 2",
      status: "Stable",
    },
    {
      id: "p2",
      name: "Lisa Thompson",
      age: 45,
      lastVisit: "3 days ago",
      condition: "Hypertension",
      status: "Improving",
    },
    {
      id: "p3",
      name: "Robert Garcia",
      age: 67,
      lastVisit: "1 week ago",
      condition: "Arthritis",
      status: "Stable",
    },
  ];

  // Mock AI referrals
  const aiReferrals = [
    {
      id: "r1",
      patient: "David Kim",
      age: 38,
      date: "Today",
      time: "9:15 AM",
      aiExpert: "Dr. AI Cardiologist",
      symptoms: "Chest pain, shortness of breath",
      severity: "high",
      status: "pending",
    },
    {
      id: "r2",
      patient: "Jennifer Lee",
      age: 29,
      date: "Yesterday",
      time: "4:30 PM",
      aiExpert: "Dr. AI Dermatologist",
      symptoms: "Persistent skin rash with itching",
      severity: "medium",
      status: "pending",
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
              <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
              <p className="text-gray-500 mt-1">
                Welcome back, Dr. {doctorData?.full_name || user.email}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/doctor/appointments">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Schedule
                </Button>
              </Link>
              <Link href="/doctor/patients">
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Patient List
                </Button>
              </Link>
            </div>
          </header>

          {/* Stats Overview */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        Today's Appointments
                      </p>
                      <h3 className="text-2xl font-bold">8</h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Pending Referrals</p>
                      <h3 className="text-2xl font-bold">5</h3>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-full">
                      <AlertCircle className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Total Patients</p>
                      <h3 className="text-2xl font-bold">142</h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Messages</p>
                      <h3 className="text-2xl font-bold">12</h3>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Upcoming Appointments */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Today's Appointments</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {upcomingAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="border-none shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <UserCircle className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {appointment.patient}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {appointment.age} years old
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-3 md:items-center">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {appointment.date}, {appointment.time}
                          </span>
                        </div>

                        <div
                          className={`px-3 py-1 rounded-full text-xs ${appointment.type === "virtual" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"} self-start md:self-auto`}
                        >
                          {appointment.type === "virtual"
                            ? "Virtual"
                            : "In-Person"}
                        </div>

                        {appointment.type === "virtual" && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Video className="mr-2 h-4 w-4" />
                            Start Call
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm">
                        <span className="font-medium">Reason for visit:</span>{" "}
                        {appointment.reason}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* AI Referrals */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">AI Referrals</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {aiReferrals.map((referral) => (
                <Card
                  key={referral.id}
                  className={`border-none shadow-sm hover:shadow-md transition-shadow ${referral.severity === "high" ? "border-l-4 border-l-red-500" : referral.severity === "medium" ? "border-l-4 border-l-amber-500" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-red-100 p-3 rounded-full">
                          <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{referral.patient}</h3>
                          <p className="text-sm text-gray-500">
                            {referral.age} years old
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-3 md:items-center">
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

                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Review Case
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm mb-2">
                        <span className="font-medium">AI Expert:</span>{" "}
                        {referral.aiExpert}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Symptoms:</span>{" "}
                        {referral.symptoms}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Patients */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Patients</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search patients..."
                    className="pl-10 w-[200px]"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  View All
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-4 font-medium text-gray-500">Patient</th>
                    <th className="p-4 font-medium text-gray-500">Age</th>
                    <th className="p-4 font-medium text-gray-500">
                      Last Visit
                    </th>
                    <th className="p-4 font-medium text-gray-500">Condition</th>
                    <th className="p-4 font-medium text-gray-500">Status</th>
                    <th className="p-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPatients.map((patient) => (
                    <tr key={patient.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <UserCircle className="h-8 w-8 text-blue-600" />
                          <span className="font-medium">{patient.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{patient.age}</td>
                      <td className="p-4 text-gray-600">{patient.lastVisit}</td>
                      <td className="p-4 text-gray-600">{patient.condition}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${patient.status === "Improving" ? "bg-green-100 text-green-700" : patient.status === "Stable" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          {patient.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600"
                          >
                            View Records
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600"
                          >
                            Message
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
