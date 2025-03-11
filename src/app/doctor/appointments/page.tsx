import DoctorNavbar from "@/components/doctor-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  UserCircle,
  Video,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function DoctorAppointmentsPage() {
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

  // Mock appointments data
  const appointments = [
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
    {
      id: "a4",
      patient: "Robert Garcia",
      age: 67,
      date: "Tomorrow",
      time: "9:00 AM",
      type: "in-person",
      status: "confirmed",
      reason: "Joint pain follow-up",
    },
    {
      id: "a5",
      patient: "Lisa Thompson",
      age: 45,
      date: "Tomorrow",
      time: "10:30 AM",
      type: "virtual",
      status: "confirmed",
      reason: "Medication review",
    },
    {
      id: "a6",
      patient: "James Wilson",
      age: 52,
      date: "Tomorrow",
      time: "1:00 PM",
      type: "in-person",
      status: "confirmed",
      reason: "Diabetes management",
    },
    {
      id: "a7",
      patient: "David Kim",
      age: 38,
      date: "May 10, 2023",
      time: "11:00 AM",
      type: "virtual",
      status: "confirmed",
      reason: "Chest pain follow-up",
    },
    {
      id: "a8",
      patient: "Jennifer Lee",
      age: 29,
      date: "May 10, 2023",
      time: "3:30 PM",
      type: "in-person",
      status: "confirmed",
      reason: "Skin condition assessment",
    },
  ];

  // Group appointments by date
  const groupedAppointments: Record<string, typeof appointments> = {};
  appointments.forEach((appointment) => {
    if (!groupedAppointments[appointment.date]) {
      groupedAppointments[appointment.date] = [];
    }
    groupedAppointments[appointment.date].push(appointment);
  });

  return (
    <>
      <DoctorNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Appointments</h1>
              <p className="text-gray-500 mt-1">
                Manage your patient appointments
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </div>
          </header>

          {/* Calendar Navigation */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous Week
              </Button>
              <h2 className="text-lg font-semibold">May 3 - May 10, 2023</h2>
              <Button variant="outline" size="sm">
                Next Week
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => (
                  <div
                    key={index}
                    className="text-center text-sm font-medium text-gray-500"
                  >
                    {day}
                  </div>
                ),
              )}
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date(2023, 4, i + 3); // May 3-9, 2023
                const isToday = i === 0; // Assuming today is May 3
                const isTomorrow = i === 1; // Assuming tomorrow is May 4
                return (
                  <button
                    key={i}
                    className={`p-2 rounded-lg text-center ${isToday ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
                  >
                    <div className="text-sm">{date.getDate()}</div>
                    <div className="text-xs mt-1">
                      {isToday ? "Today" : isTomorrow ? "Tomorrow" : ""}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

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
          <div className="space-y-8">
            {Object.entries(groupedAppointments).map(
              ([date, dateAppointments]) => (
                <div key={date}>
                  <h3 className="text-lg font-semibold mb-4">{date}</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {dateAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <UserCircle className="h-12 w-12 text-blue-600" />
                              <div>
                                <h3 className="font-semibold">
                                  {appointment.patient}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {appointment.age} years old
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3 items-center">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  {appointment.time}
                                </span>
                              </div>

                              <div
                                className={`px-3 py-1 rounded-full text-xs ${appointment.type === "virtual" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
                              >
                                {appointment.type === "virtual"
                                  ? "Virtual"
                                  : "In-Person"}
                              </div>

                              {appointment.date === "Today" &&
                                appointment.type === "virtual" && (
                                  <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <Video className="mr-2 h-4 w-4" />
                                    Start Call
                                  </Button>
                                )}
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm">
                              <span className="font-medium">
                                Reason for visit:
                              </span>{" "}
                              {appointment.reason}
                            </p>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                            <Button size="sm" variant="outline">
                              View Patient Record
                            </Button>
                            <Button size="sm" variant="outline">
                              Reschedule
                            </Button>
                            {appointment.date !== "Today" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </main>
    </>
  );
}
