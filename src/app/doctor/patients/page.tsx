import DoctorNavbar from "@/components/doctor-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  UserCircle,
  Plus,
  FileText,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  Download,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function PatientsPage() {
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

  // Mock patients data
  const patients = [
    {
      id: "p1",
      name: "James Wilson",
      age: 52,
      gender: "Male",
      email: "james.wilson@example.com",
      phone: "(555) 123-4567",
      lastVisit: "May 2, 2023",
      condition: "Diabetes Type 2",
      status: "Stable",
    },
    {
      id: "p2",
      name: "Lisa Thompson",
      age: 45,
      gender: "Female",
      email: "lisa.thompson@example.com",
      phone: "(555) 987-6543",
      lastVisit: "April 28, 2023",
      condition: "Hypertension",
      status: "Improving",
    },
    {
      id: "p3",
      name: "Robert Garcia",
      age: 67,
      gender: "Male",
      email: "robert.garcia@example.com",
      phone: "(555) 456-7890",
      lastVisit: "April 25, 2023",
      condition: "Arthritis",
      status: "Stable",
    },
    {
      id: "p4",
      name: "Sarah Johnson",
      age: 42,
      gender: "Female",
      email: "sarah.johnson@example.com",
      phone: "(555) 789-0123",
      lastVisit: "April 20, 2023",
      condition: "Hypertension",
      status: "Stable",
    },
    {
      id: "p5",
      name: "Michael Chen",
      age: 35,
      gender: "Male",
      email: "michael.chen@example.com",
      phone: "(555) 234-5678",
      lastVisit: "April 18, 2023",
      condition: "Asthma",
      status: "Stable",
    },
    {
      id: "p6",
      name: "Emily Rodriguez",
      age: 28,
      gender: "Female",
      email: "emily.rodriguez@example.com",
      phone: "(555) 345-6789",
      lastVisit: "April 15, 2023",
      condition: "Allergies",
      status: "Improving",
    },
    {
      id: "p7",
      name: "David Kim",
      age: 38,
      gender: "Male",
      email: "david.kim@example.com",
      phone: "(555) 567-8901",
      lastVisit: "April 10, 2023",
      condition: "Chest Pain",
      status: "Needs Attention",
    },
    {
      id: "p8",
      name: "Jennifer Lee",
      age: 29,
      gender: "Female",
      email: "jennifer.lee@example.com",
      phone: "(555) 678-9012",
      lastVisit: "April 5, 2023",
      condition: "Skin Rash",
      status: "Needs Attention",
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
              <h1 className="text-3xl font-bold">Patient Management</h1>
              <p className="text-gray-500 mt-1">
                View and manage your patient records
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add New Patient
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export List
              </Button>
            </div>
          </header>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search patients by name, email, or condition..."
                className="pl-10 w-full"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Patients Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-4 font-medium text-gray-500">Patient</th>
                  <th className="p-4 font-medium text-gray-500">Contact</th>
                  <th className="p-4 font-medium text-gray-500">Last Visit</th>
                  <th className="p-4 font-medium text-gray-500">Condition</th>
                  <th className="p-4 font-medium text-gray-500">Status</th>
                  <th className="p-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <UserCircle className="h-10 w-10 text-blue-600" />
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-gray-500">
                            {patient.age} years, {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{patient.email}</div>
                      <div className="text-sm text-gray-500">
                        {patient.phone}
                      </div>
                    </td>
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
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <FileText className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600"
                        >
                          View Profile
                          <ArrowUpRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">8</span> of{" "}
              <span className="font-medium">142</span> patients
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-50">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
