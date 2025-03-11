"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "../../../../supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Shield, RefreshCw } from "lucide-react";
import AdminPanel from "@/components/admin/admin-panel";

type SystemSetting = {
  id: string;
  key: string;
  value: string;
  description: string;
  type: "text" | "number" | "boolean" | "json";
  updated_at: string;
};

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedSettings, setEditedSettings] = useState<Record<string, any>>({});

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      // In a real implementation, you would have a system_settings table
      // For this demo, we'll use mock data
      const mockSettings: SystemSetting[] = [
        {
          id: "1",
          key: "site_name",
          value: "VAI Health",
          description: "The name of the site displayed in the header and title",
          type: "text",
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          key: "maintenance_mode",
          value: "false",
          description:
            "When enabled, the site will display a maintenance message to all users",
          type: "boolean",
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          key: "max_appointments_per_day",
          value: "20",
          description:
            "Maximum number of appointments that can be scheduled per day",
          type: "number",
          updated_at: new Date().toISOString(),
        },
        {
          id: "4",
          key: "smtp_settings",
          value: JSON.stringify(
            {
              host: "smtp.example.com",
              port: 587,
              username: "notifications@vaihealth.com",
              password: "********",
              from_email: "no-reply@vaihealth.com",
            },
            null,
            2,
          ),
          description: "SMTP server settings for sending emails",
          type: "json",
          updated_at: new Date().toISOString(),
        },
        {
          id: "5",
          key: "privacy_policy",
          value:
            "Our privacy policy ensures your data is protected and secure...",
          description: "Privacy policy text displayed on the site",
          type: "text",
          updated_at: new Date().toISOString(),
        },
      ];

      setSettings(mockSettings);

      // Initialize edited settings with current values
      const initialEdited: Record<string, any> = {};
      mockSettings.forEach((setting) => {
        if (setting.type === "boolean") {
          initialEdited[setting.key] = setting.value === "true";
        } else if (setting.type === "number") {
          initialEdited[setting.key] = Number(setting.value);
        } else {
          initialEdited[setting.key] = setting.value;
        }
      });
      setEditedSettings(initialEdited);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setEditedSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      // In a real implementation, you would update the settings in the database
      // For this demo, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the settings in our state
      const updatedSettings = settings.map((setting) => {
        let newValue: string;

        if (setting.type === "boolean") {
          newValue = editedSettings[setting.key] ? "true" : "false";
        } else if (setting.type === "json") {
          newValue =
            typeof editedSettings[setting.key] === "string"
              ? editedSettings[setting.key]
              : JSON.stringify(editedSettings[setting.key], null, 2);
        } else {
          newValue = String(editedSettings[setting.key]);
        }

        return {
          ...setting,
          value: newValue,
          updated_at: new Date().toISOString(),
        };
      });

      setSettings(updatedSettings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const renderSettingInput = (setting: SystemSetting) => {
    switch (setting.type) {
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={setting.key}
              checked={editedSettings[setting.key] || false}
              onCheckedChange={(checked) =>
                handleSettingChange(setting.key, checked)
              }
            />
            <Label htmlFor={setting.key}>
              {editedSettings[setting.key] ? "Enabled" : "Disabled"}
            </Label>
          </div>
        );

      case "number":
        return (
          <Input
            type="number"
            id={setting.key}
            value={editedSettings[setting.key] || 0}
            onChange={(e) =>
              handleSettingChange(setting.key, Number(e.target.value))
            }
          />
        );

      case "json":
        return (
          <Textarea
            id={setting.key}
            value={editedSettings[setting.key] || ""}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="font-mono text-sm h-32"
          />
        );

      case "text":
      default:
        return (
          <Input
            type="text"
            id={setting.key}
            value={editedSettings[setting.key] || ""}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="h-6 w-6 mr-2 text-red-600" />
            System Settings
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Configure system-wide settings and parameters.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={fetchSettings}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                onClick={saveSettings}
                disabled={saving || loading}
                className="bg-red-600 hover:bg-red-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading settings...</div>
          ) : (
            <div className="space-y-8">
              {settings.map((setting) => (
                <div key={setting.id} className="border-b pb-6 last:border-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <Label
                        htmlFor={setting.key}
                        className="text-base font-medium"
                      >
                        {setting.key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">
                        {setting.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Last updated:{" "}
                        {new Date(setting.updated_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      {renderSettingInput(setting)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AdminPanel />
    </div>
  );
}
