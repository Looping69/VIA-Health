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
  Download,
  FileText,
  Filter,
  Lock,
  Plus,
  Search,
  Share,
  Shield,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import { Input } from "@/components/ui/input";

export default async function MedicalRecordsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Mock medical records data
  const medicalRecords = [
    {
      id: "r1",
      title: "Annual Physical Examination",
      date: "March 22, 2023",
      provider: "Dr. Michael Chen",
      type: "Examination",
      size: "2.4 MB",
    },
    {
      id: "r2",
      title: "Blood Test Results",
      date: "March 22, 2023",
      provider: "VAI Health Lab",
      type: "Lab Results",
      size: "1.8 MB",
    },
    {
      id: "r3",
      title: "Chest X-Ray",
      date: "January 15, 2023",
      provider: "VAI Health Radiology",
      type: "Imaging",
      size: "8.5 MB",
    },
    {
      id: "r4",
      title: "Prescription - Lisinopril",
      date: "March 22, 2023",
      provider: "Dr. Michael Chen",
      type: "Prescription",
      size: "0.5 MB",
    },
    {
      id: "r5",
      title: "Allergy Test Results",
      date: "November 10, 2022",
      provider: "Dr. Emily Rodriguez",
      type: "Lab Results",
      size: "1.2 MB",
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
              <h1 className="text-3xl font-bold">Medical Records</h1>
              <p className="text-gray-500 mt-1">
                Access and manage your health records securely
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Upload Record
            </Button>
          </header>

          {/* Security Notice */}
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-4 flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                Your medical records are encrypted and HIPAA-compliant. Only you
                and healthcare providers you authorize can access them.
              </p>
            </CardContent>
          </Card>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search records..." className="pl-10 w-full" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Records List */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-4 font-medium text-gray-500">Name</th>
                  <th className="p-4 font-medium text-gray-500">Date</th>
                  <th className="p-4 font-medium text-gray-500">Provider</th>
                  <th className="p-4 font-medium text-gray-500">Type</th>
                  <th className="p-4 font-medium text-gray-500">Size</th>
                  <th className="p-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicalRecords.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span>{record.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{record.date}</td>
                    <td className="p-4 text-gray-600">{record.provider}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {record.type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{record.size}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
