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
  Brain,
  MessageSquare,
  Plus,
  Search,
  UserCircle,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import { Input } from "@/components/ui/input";

export default async function ConsultationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Mock consultations data
  const consultations = [
    {
      id: "c1",
      type: "ai",
      title: "AI Symptom Assessment",
      date: "May 2, 2023",
      status: "completed",
      summary: "Headache, fatigue, and mild fever",
      recommendation: "Rest, hydration, and over-the-counter pain relievers",
    },
    {
      id: "c2",
      type: "doctor",
      title: "Dr. Emily Rodriguez",
      date: "April 28, 2023",
      status: "completed",
      summary: "Follow-up on previous symptoms",
      recommendation: "Continue current treatment plan",
    },
    {
      id: "c3",
      type: "ai",
      title: "AI Symptom Assessment",
      date: "April 15, 2023",
      status: "completed",
      summary: "Joint pain and stiffness",
      recommendation:
        "Anti-inflammatory medication and physical therapy referral",
    },
    {
      id: "c4",
      type: "doctor",
      title: "Dr. Michael Chen",
      date: "March 22, 2023",
      status: "completed",
      summary: "Annual physical examination",
      recommendation: "Maintain healthy diet and exercise routine",
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
              <h1 className="text-3xl font-bold">Consultations</h1>
              <p className="text-gray-500 mt-1">
                View and manage your medical consultations
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="mr-2 h-4 w-4" />
              New Consultation
            </Button>
          </header>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search consultations..."
                className="pl-10 w-full"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Consultations List */}
          <div className="grid grid-cols-1 gap-4">
            {consultations.map((consultation) => (
              <Card
                key={consultation.id}
                className="border-none shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-full ${consultation.type === "ai" ? "bg-blue-100" : "bg-green-100"}`}
                      >
                        {consultation.type === "ai" ? (
                          <Brain
                            className={`h-6 w-6 ${consultation.type === "ai" ? "text-blue-600" : "text-green-600"}`}
                          />
                        ) : (
                          <UserCircle
                            className={`h-6 w-6 ${consultation.type === "ai" ? "text-blue-600" : "text-green-600"}`}
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{consultation.title}</h3>
                        <p className="text-sm text-gray-500">
                          {consultation.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 md:items-center">
                      <div className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 self-start md:self-auto">
                        {consultation.status}
                      </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Summary
                        </h4>
                        <p className="text-sm">{consultation.summary}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Recommendation
                        </h4>
                        <p className="text-sm">{consultation.recommendation}</p>
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
