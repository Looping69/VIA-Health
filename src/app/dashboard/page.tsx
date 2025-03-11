import DashboardNavbar from "@/components/dashboard-navbar";
import {
  InfoIcon,
  UserCircle,
  Activity,
  Calendar,
  MessageSquare,
  Plus,
  ArrowUpRight,
  HeartPulse,
  Pill,
  Brain,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
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

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Mock health metrics data
  const healthMetrics = [
    {
      name: "Heart Rate",
      value: "72 bpm",
      change: "+2",
      icon: <HeartPulse className="h-5 w-5 text-rose-500" />,
    },
    {
      name: "Blood Pressure",
      value: "120/80",
      change: "-5",
      icon: <Activity className="h-5 w-5 text-blue-500" />,
    },
    {
      name: "Sleep",
      value: "7.2 hrs",
      change: "+0.5",
      icon: <Brain className="h-5 w-5 text-indigo-500" />,
    },
    {
      name: "Medications",
      value: "2 active",
      change: "0",
      icon: <Pill className="h-5 w-5 text-emerald-500" />,
    },
  ];

  // Mock upcoming appointments
  const upcomingAppointments = [
    {
      doctor: "Dr. Sarah Johnson",
      specialty: "Primary Care",
      date: "Tomorrow, 10:00 AM",
      virtual: true,
    },
    {
      doctor: "Dr. Michael Chen",
      specialty: "Cardiology",
      date: "May 15, 2:30 PM",
      virtual: false,
    },
  ];

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Patient Dashboard</h1>
              <p className="text-gray-500 mt-1">
                Welcome back, {user.user_metadata?.full_name || user.email}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/consultations">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  New Consultation
                </Button>
              </Link>
              <Link href="/dashboard/appointments">
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </Link>
            </div>
          </header>

          {/* Health Metrics Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Health Metrics</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {healthMetrics.map((metric, index) => (
                <Card
                  key={index}
                  className="border-none shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        {metric.name}
                      </CardTitle>
                      {metric.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div
                      className={`text-xs ${metric.change.startsWith("+") ? "text-green-500" : metric.change.startsWith("-") ? "text-red-500" : "text-gray-500"}`}
                    >
                      {metric.change} from last week
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Upcoming Appointments Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Plus className="mr-1 h-4 w-4" />
                New Appointment
              </Button>
            </div>
            {upcomingAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingAppointments.map((appointment, index) => (
                  <Card
                    key={index}
                    className="border-none shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold">
                          {appointment.doctor}
                        </CardTitle>
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${appointment.virtual ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
                        >
                          {appointment.virtual ? "Virtual" : "In-Person"}
                        </div>
                      </div>
                      <CardDescription>{appointment.specialty}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{appointment.date}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex gap-2 w-full">
                        <Button variant="outline" size="sm" className="flex-1">
                          Reschedule
                        </Button>
                        {appointment.virtual && (
                          <Button
                            size="sm"
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            Join Call
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No upcoming appointments</p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Appointment
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Recent Consultations Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Consultations</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Brain className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Symptom Assessment</h3>
                      <p className="text-sm text-gray-500">
                        Completed on May 2, 2023
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <UserCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Dr. Emily Rodriguez</h3>
                      <p className="text-sm text-gray-500">
                        Follow-up on April 28, 2023
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Brain className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Symptom Assessment</h3>
                      <p className="text-sm text-gray-500">
                        Completed on April 15, 2023
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </>
  );
}
