import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Search,
  UserCircle,
  Video,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import { Input } from "@/components/ui/input";

export default async function AppointmentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Mock appointments data
  const appointments = [
    {
      id: "a1",
      doctor: "Dr. Sarah Johnson",
      specialty: "Primary Care",
      date: "May 10, 2023",
      time: "10:00 AM",
      type: "virtual",
      location: null,
      status: "upcoming",
    },
    {
      id: "a2",
      doctor: "Dr. Michael Chen",
      specialty: "Cardiology",
      date: "May 15, 2023",
      time: "2:30 PM",
      type: "in-person",
      location: "VAI Health Medical Center, 123 Main St",
      status: "upcoming",
    },
    {
      id: "a3",
      doctor: "Dr. Emily Rodriguez",
      specialty: "Dermatology",
      date: "April 28, 2023",
      time: "1:15 PM",
      type: "virtual",
      location: null,
      status: "completed",
    },
    {
      id: "a4",
      doctor: "Dr. James Wilson",
      specialty: "Orthopedics",
      date: "April 15, 2023",
      time: "11:30 AM",
      type: "in-person",
      location: "VAI Health Medical Center, 123 Main St",
      status: "completed",
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
              <h1 className="text-3xl font-bold">Appointments</h1>
              <p className="text-gray-500 mt-1">
                Schedule and manage your doctor appointments
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </header>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search appointments..."
                className="pl-10 w-full"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Appointments List */}
          <div className="grid grid-cols-1 gap-4">
            {appointments.map((appointment) => (
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
                        <h3 className="font-semibold">{appointment.doctor}</h3>
                        <p className="text-sm text-gray-500">
                          {appointment.specialty}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 md:items-center">
                      <div
                        className={`px-3 py-1 rounded-full text-xs ${appointment.status === "upcoming" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"} self-start md:self-auto`}
                      >
                        {appointment.status}
                      </div>
                      {appointment.status === "upcoming" &&
                        appointment.type === "virtual" && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Join Call
                          </Button>
                        )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        View Details
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.type === "virtual" ? (
                          <>
                            <Video className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Virtual Appointment</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {appointment.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
