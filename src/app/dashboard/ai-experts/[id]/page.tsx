"use client";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  MessageSquare,
  Send,
  User,
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileText,
  Clock,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createClient } from "../../../../../supabase/client";
import { useRouter, useParams } from "next/navigation";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function AIExpertConsultation() {
  const router = useRouter();
  const params = useParams();
  const expertId = params.id as string;
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [expert, setExpert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [assessment, setAssessment] = useState<string>("");
  const [severity, setSeverity] = useState<string>("low");
  const [showReferral, setShowReferral] = useState(false);
  const [referralSent, setReferralSent] = useState(false);

  useEffect(() => {
    fetchExpert();
    initializeConsultation();
  }, [expertId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchExpert = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ai_experts")
        .select("*, ai_expert_capabilities(capability)")
        .eq("id", expertId)
        .single();

      if (error) {
        console.error("Error fetching expert:", error);
        return;
      }

      setExpert(data);

      // Add initial greeting message
      setMessages([
        {
          id: "initial",
          role: "assistant",
          content: `Hello, I'm ${data.name}. I specialize in ${data.specialty}. How can I help you today?`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error in fetchExpert:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeConsultation = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/sign-in");
        return;
      }

      // Create a new consultation
      const { data, error } = await supabase
        .from("ai_consultations")
        .insert({
          expert_id: expertId,
          user_id: user.id,
          status: "in_progress",
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating consultation:", error);
        return;
      }

      setConsultationId(data.id);
    } catch (error) {
      console.error("Error in initializeConsultation:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !consultationId) return;

    try {
      setSending(true);

      // Add user message to UI
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Save user message to database
      await supabase.from("ai_consultation_messages").insert({
        consultation_id: consultationId,
        role: "user",
        content: message,
      });

      setMessage("");

      // Simulate AI response (in a real app, this would call your AI service)
      setTimeout(async () => {
        // Generate AI response based on the message
        let aiResponse = "";
        let newSymptoms: string[] = [];
        let newSeverity = severity;

        // Simple symptom detection
        const lowerMessage = message.toLowerCase();
        if (
          lowerMessage.includes("chest pain") ||
          lowerMessage.includes("heart")
        ) {
          aiResponse =
            "I notice you mentioned chest pain. This could be concerning. Can you describe the pain and when it started?";
          newSymptoms = [...symptoms, "chest pain"];
          newSeverity = "high";
          if (!showReferral) setShowReferral(true);
        } else if (
          lowerMessage.includes("headache") ||
          lowerMessage.includes("migraine")
        ) {
          aiResponse =
            "Headaches can have many causes. How long have you been experiencing them, and how severe is the pain?";
          newSymptoms = [...symptoms, "headache"];
          newSeverity = "medium";
        } else if (
          lowerMessage.includes("rash") ||
          lowerMessage.includes("skin")
        ) {
          aiResponse =
            "Skin conditions can be difficult to diagnose without visual examination. Can you describe the appearance and location of the rash?";
          newSymptoms = [...symptoms, "skin rash"];
          newSeverity = "medium";
          if (!showReferral) setShowReferral(true);
        } else if (
          lowerMessage.includes("fever") ||
          lowerMessage.includes("temperature")
        ) {
          aiResponse =
            "Fever is often a sign that your body is fighting an infection. How high is your temperature, and do you have any other symptoms?";
          newSymptoms = [...symptoms, "fever"];
          newSeverity = "medium";
        } else if (
          lowerMessage.includes("cough") ||
          lowerMessage.includes("breathing")
        ) {
          aiResponse =
            "Respiratory symptoms can have various causes. Is your cough dry or productive, and are you experiencing any shortness of breath?";
          newSymptoms = [...symptoms, "cough"];
          newSeverity = "medium";
        } else {
          aiResponse =
            "Thank you for sharing that information. Can you tell me more about your symptoms and when they started?";
        }

        // Update symptoms and severity
        setSymptoms(newSymptoms);
        setSeverity(newSeverity);

        // If we've gathered enough symptoms, provide an assessment
        if (newSymptoms.length >= 2 && !assessment) {
          const assessmentText = `Based on your symptoms (${newSymptoms.join(", ")}), I recommend consulting with a healthcare provider for a proper evaluation.`;
          setAssessment(assessmentText);
          aiResponse += "\n\n" + assessmentText;
        }

        // Add AI response to UI
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: aiResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Save AI response to database
        await supabase.from("ai_consultation_messages").insert({
          consultation_id: consultationId,
          role: "assistant",
          content: aiResponse,
        });

        setSending(false);
      }, 1500);
    } catch (error) {
      console.error("Error in sendMessage:", error);
      setSending(false);
    }
  };

  const sendReferral = async () => {
    try {
      if (!consultationId) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Update consultation status
      await supabase
        .from("ai_consultations")
        .update({
          status: "referred",
          summary: symptoms.join(", "),
          recommendation: assessment,
          severity: severity,
          referred_to_doctor: true,
        })
        .eq("id", consultationId);

      // Create referral
      await supabase.from("ai_expert_referrals").insert({
        consultation_id: consultationId,
        patient_id: user.id,
        symptoms: symptoms.join(", "),
        assessment: assessment,
        severity: severity,
        status: "pending",
      });

      // Add referral message to chat
      const referralMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "I've referred your case to a doctor. They will review your symptoms and get back to you soon. You can continue to chat with me in the meantime.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, referralMessage]);

      // Save referral message to database
      await supabase.from("ai_consultation_messages").insert({
        consultation_id: consultationId,
        role: "assistant",
        content: referralMessage.content,
      });

      setReferralSent(true);
    } catch (error) {
      console.error("Error sending referral:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <>
        <DashboardNavbar />
        <main className="w-full bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="mt-4 text-gray-600">Loading AI expert...</p>
          </div>
        </main>
      </>
    );
  }

  if (!expert) {
    return (
      <>
        <DashboardNavbar />
        <main className="w-full bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <p className="mt-4 text-gray-600">AI expert not found</p>
            <Button
              className="mt-4"
              onClick={() => router.push("/dashboard/ai-experts")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to AI Experts
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/ai-experts")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">{expert.name}</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {expert.specialty}
            </span>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chat Section */}
            <div className="md:col-span-2">
              <Card className="border-none shadow-sm h-[600px] flex flex-col">
                <CardHeader className="bg-blue-50 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Brain className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{expert.name}</CardTitle>
                      <CardDescription>{expert.specialty}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                          <div
                            className={`p-2 rounded-full ${msg.role === "user" ? "bg-gray-200" : "bg-blue-100"}`}
                          >
                            {msg.role === "user" ? (
                              <User className="h-5 w-5 text-gray-600" />
                            ) : (
                              <Brain className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div
                            className={`p-3 rounded-lg ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-white border"}`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <p
                              className={`text-xs mt-1 ${msg.role === "user" ? "text-blue-100" : "text-gray-400"}`}
                            >
                              {msg.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <div className="flex w-full gap-2">
                    <Textarea
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-grow resize-none"
                      disabled={sending}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!message.trim() || sending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Expert Info */}
              <Card>
                <CardHeader>
                  <CardTitle>About {expert.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {expert.description}
                  </p>
                  <h4 className="font-medium mb-2">Capabilities</h4>
                  <ul className="space-y-1">
                    {expert.ai_expert_capabilities?.map(
                      (cap: { capability: string }, index: number) => (
                        <li
                          key={index}
                          className="text-sm flex items-start gap-2"
                        >
                          <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                          </div>
                          {cap.capability}
                        </li>
                      ),
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* Consultation Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Consultation Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Identified Symptoms
                      </h4>
                      {symptoms.length > 0 ? (
                        <ul className="space-y-1">
                          {symptoms.map((symptom, index) => (
                            <li
                              key={index}
                              className="text-sm flex items-start gap-2"
                            >
                              <div className="rounded-full bg-amber-100 p-1 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div>
                              </div>
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No symptoms identified yet
                        </p>
                      )}
                    </div>

                    {assessment && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Assessment
                        </h4>
                        <p className="text-sm">{assessment}</p>
                      </div>
                    )}

                    {showReferral && !referralSent && (
                      <div className="mt-4">
                        <Button
                          onClick={sendReferral}
                          className="w-full bg-red-600 hover:bg-red-700"
                        >
                          Refer to Doctor
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          Based on your symptoms, we recommend a consultation
                          with a doctor.
                        </p>
                      </div>
                    )}

                    {referralSent && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-700 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Referral sent to doctor
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
