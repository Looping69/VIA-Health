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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  Plus,
  Search,
  Trash2,
  Edit,
  Save,
  X,
  MoveHorizontal,
  Stethoscope,
  HeartPulse,
  Pill,
  Activity,
  GripVertical,
} from "lucide-react";
import { useState, useRef } from "react";
import { createClient } from "../../../../supabase/client";
import { useRouter } from "next/navigation";

// Define the AI Expert type
type AIExpert = {
  id: string;
  name: string;
  specialty: string;
  description: string;
  icon: string;
  capabilities: string[];
};

export default function AIExpertsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [experts, setExperts] = useState<AIExpert[]>([
    {
      id: "1",
      name: "Dr. AI Cardiologist",
      specialty: "Cardiology",
      description:
        "Specialized in heart conditions and cardiovascular health assessment.",
      icon: "HeartPulse",
      capabilities: [
        "Heart disease risk assessment",
        "ECG interpretation assistance",
        "Lifestyle recommendations",
      ],
    },
    {
      id: "2",
      name: "Dr. AI Dermatologist",
      specialty: "Dermatology",
      description: "Analyzes skin conditions and provides initial assessments.",
      icon: "Stethoscope",
      capabilities: [
        "Skin condition identification",
        "Treatment recommendations",
        "Referral suggestions",
      ],
    },
    {
      id: "3",
      name: "Dr. AI Nutritionist",
      specialty: "Nutrition",
      description: "Provides dietary advice and nutritional assessments.",
      icon: "Pill",
      capabilities: [
        "Dietary planning",
        "Nutritional deficiency analysis",
        "Weight management",
      ],
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingExpert, setEditingExpert] = useState<AIExpert | null>(null);
  const [draggedExpert, setDraggedExpert] = useState<AIExpert | null>(null);
  const [dragOverExpertId, setDragOverExpertId] = useState<string | null>(null);

  // Form state for creating/editing experts
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    description: "",
    icon: "Brain",
    capabilities: [""],
  });

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle capability input changes
  const handleCapabilityChange = (index: number, value: string) => {
    const updatedCapabilities = [...formData.capabilities];
    updatedCapabilities[index] = value;
    setFormData({
      ...formData,
      capabilities: updatedCapabilities,
    });
  };

  // Add a new capability field
  const addCapability = () => {
    setFormData({
      ...formData,
      capabilities: [...formData.capabilities, ""],
    });
  };

  // Remove a capability field
  const removeCapability = (index: number) => {
    const updatedCapabilities = formData.capabilities.filter(
      (_, i) => i !== index,
    );
    setFormData({
      ...formData,
      capabilities: updatedCapabilities,
    });
  };

  // Create a new AI expert
  const createExpert = () => {
    const newExpert: AIExpert = {
      id: Date.now().toString(),
      name: formData.name,
      specialty: formData.specialty,
      description: formData.description,
      icon: formData.icon,
      capabilities: formData.capabilities.filter((cap) => cap.trim() !== ""),
    };

    setExperts([...experts, newExpert]);
    resetForm();
    setIsCreating(false);
  };

  // Update an existing AI expert
  const updateExpert = () => {
    if (!editingExpert) return;

    const updatedExperts = experts.map((expert) => {
      if (expert.id === editingExpert.id) {
        return {
          ...expert,
          name: formData.name,
          specialty: formData.specialty,
          description: formData.description,
          icon: formData.icon,
          capabilities: formData.capabilities.filter(
            (cap) => cap.trim() !== "",
          ),
        };
      }
      return expert;
    });

    setExperts(updatedExperts);
    resetForm();
    setEditingExpert(null);
  };

  // Delete an AI expert
  const deleteExpert = (id: string) => {
    setExperts(experts.filter((expert) => expert.id !== id));
  };

  // Edit an existing AI expert
  const startEditing = (expert: AIExpert) => {
    setEditingExpert(expert);
    setFormData({
      name: expert.name,
      specialty: expert.specialty,
      description: expert.description,
      icon: expert.icon,
      capabilities: [...expert.capabilities, ""],
    });
  };

  // Reset the form
  const resetForm = () => {
    setFormData({
      name: "",
      specialty: "",
      description: "",
      icon: "Brain",
      capabilities: [""],
    });
  };

  // Cancel editing or creating
  const cancelAction = () => {
    resetForm();
    setIsCreating(false);
    setEditingExpert(null);
  };

  // Drag and drop handlers
  const handleDragStart = (expert: AIExpert) => {
    setDraggedExpert(expert);
  };

  const handleDragOver = (e: React.DragEvent, expertId: string) => {
    e.preventDefault();
    setDragOverExpertId(expertId);
  };

  const handleDrop = (targetExpertId: string) => {
    if (!draggedExpert) return;

    const reorderedExperts = [...experts];
    const draggedIndex = experts.findIndex(
      (expert) => expert.id === draggedExpert.id,
    );
    const targetIndex = experts.findIndex(
      (expert) => expert.id === targetExpertId,
    );

    // Remove the dragged expert from the array
    const [removed] = reorderedExperts.splice(draggedIndex, 1);
    // Insert it at the target position
    reorderedExperts.splice(targetIndex, 0, removed);

    setExperts(reorderedExperts);
    setDraggedExpert(null);
    setDragOverExpertId(null);
  };

  // Render the appropriate icon based on the string name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Brain":
        return <Brain className="h-6 w-6" />;
      case "HeartPulse":
        return <HeartPulse className="h-6 w-6" />;
      case "Stethoscope":
        return <Stethoscope className="h-6 w-6" />;
      case "Pill":
        return <Pill className="h-6 w-6" />;
      case "Activity":
        return <Activity className="h-6 w-6" />;
      default:
        return <Brain className="h-6 w-6" />;
    }
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">AI Medical Experts</h1>
              <p className="text-gray-500 mt-1">
                Create and customize AI specialists for your healthcare needs
              </p>
            </div>
            {!isCreating && !editingExpert && (
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Expert
              </Button>
            )}
          </header>

          {/* Create/Edit Form */}
          {(isCreating || editingExpert) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingExpert ? "Edit AI Expert" : "Create New AI Expert"}
                </CardTitle>
                <CardDescription>
                  {editingExpert
                    ? "Update the details of your AI medical expert"
                    : "Configure a new AI medical expert with specialized capabilities"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Expert Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Dr. AI Cardiologist"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      placeholder="Cardiology"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Specialized in heart conditions and cardiovascular health assessment."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <select
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="Brain">Brain</option>
                    <option value="HeartPulse">Heart Pulse</option>
                    <option value="Stethoscope">Stethoscope</option>
                    <option value="Pill">Pill</option>
                    <option value="Activity">Activity</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Capabilities</Label>
                  {formData.capabilities.map((capability, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={capability}
                        onChange={(e) =>
                          handleCapabilityChange(index, e.target.value)
                        }
                        placeholder="Capability description"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCapability(index)}
                        disabled={formData.capabilities.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCapability}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Capability
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={cancelAction}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={editingExpert ? updateExpert : createExpert}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {editingExpert ? "Update Expert" : "Create Expert"}
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Drag and Drop Instructions */}
          {!isCreating && !editingExpert && experts.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex items-center gap-3">
              <GripVertical className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-700">
                Drag and drop experts to reorder them. Click on an expert to
                edit or delete it.
              </p>
            </div>
          )}

          {/* AI Experts List */}
          <div className="grid grid-cols-1 gap-4">
            {experts.map((expert) => (
              <Card
                key={expert.id}
                className={`border-none shadow-sm hover:shadow-md transition-shadow cursor-move ${dragOverExpertId === expert.id ? "border-2 border-blue-400" : ""}`}
                draggable
                onDragStart={() => handleDragStart(expert)}
                onDragOver={(e) => handleDragOver(e, expert.id)}
                onDrop={() => handleDrop(expert.id)}
                onDragEnd={() => setDragOverExpertId(null)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        {renderIcon(expert.icon)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{expert.name}</h3>
                        <p className="text-sm text-gray-500">
                          {expert.specialty}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => startEditing(expert)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteExpert(expert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      {expert.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Capabilities
                    </h4>
                    <ul className="space-y-1">
                      {expert.capabilities.map((capability, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-start gap-2"
                        >
                          <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                          </div>
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {!isCreating && experts.length === 0 && (
            <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No AI Experts Created
                </h3>
                <p className="text-gray-500 mb-6 text-center max-w-md">
                  Create your first AI medical expert to get personalized health
                  consultations tailored to specific medical specialties.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsCreating(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Expert
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
