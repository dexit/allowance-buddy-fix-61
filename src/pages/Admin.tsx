import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    company_name: "",
    primary_color: "",
    welcome_message: "",
    logo_url: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    checkAdminStatus();
    fetchSettings();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roles?.role !== "admin") {
      navigate("/");
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("whitelabel_settings")
      .select("*")
      .single();

    if (error) {
      toast({
        title: "Error fetching settings",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setSettings(data);
    }
  };

  const handleLogoUpload = async () => {
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(fileName, file);

    if (uploadError) {
      toast({
        title: "Error uploading logo",
        description: uploadError.message,
        variant: "destructive",
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("logos")
      .getPublicUrl(fileName);

    await updateSettings({ logo_url: publicUrl });
    setSettings(prev => ({ ...prev, logo_url: publicUrl }));

    toast({
      title: "Logo uploaded successfully",
      description: "The logo has been updated.",
    });
  };

  const updateSettings = async (updates: Partial<typeof settings>) => {
    const { error } = await supabase
      .from("whitelabel_settings")
      .update(updates)
      .eq("id", settings.id);

    if (error) {
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Backup to localStorage
    localStorage.setItem("whitelabel_settings", JSON.stringify({
      ...settings,
      ...updates,
    }));

    toast({
      title: "Settings updated",
      description: "Your changes have been saved.",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Admin Settings</h1>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              value={settings.company_name}
              onChange={(e) => setSettings(prev => ({ ...prev, company_name: e.target.value }))}
              onBlur={() => updateSettings({ company_name: settings.company_name })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary_color">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primary_color"
                type="color"
                value={settings.primary_color}
                onChange={(e) => setSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                onBlur={() => updateSettings({ primary_color: settings.primary_color })}
              />
              <Input
                value={settings.primary_color}
                onChange={(e) => setSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                onBlur={() => updateSettings({ primary_color: settings.primary_color })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcome_message">Welcome Message</Label>
            <Textarea
              id="welcome_message"
              value={settings.welcome_message}
              onChange={(e) => setSettings(prev => ({ ...prev, welcome_message: e.target.value }))}
              onBlur={() => updateSettings({ welcome_message: settings.welcome_message })}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <div className="flex items-center gap-4">
              {settings.logo_url && (
                <img
                  src={settings.logo_url}
                  alt="Company logo"
                  className="h-12 w-auto object-contain"
                />
              )}
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <Button
                onClick={handleLogoUpload}
                disabled={!file}
              >
                Upload Logo
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}