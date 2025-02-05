
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const WhitelabelSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    companyName: "",
    primaryColor: "#0FA0CE",
    logoUrl: "",
    welcomeMessage: ""
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('whitelabel_settings')
        .upsert({
          company_name: settings.companyName,
          primary_color: settings.primaryColor,
          logo_url: settings.logoUrl,
          welcome_message: settings.welcomeMessage
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "White-label settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">White-label Settings</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={settings.companyName}
            onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
            placeholder="Enter company name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <Input
            id="primaryColor"
            type="color"
            value={settings.primaryColor}
            onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
            className="h-10 w-20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input
            id="logoUrl"
            value={settings.logoUrl}
            onChange={(e) => setSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
            placeholder="Enter logo URL"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="welcomeMessage">Welcome Message</Label>
          <Input
            id="welcomeMessage"
            value={settings.welcomeMessage}
            onChange={(e) => setSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
            placeholder="Enter welcome message"
          />
        </div>

        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="w-full mt-6"
        >
          Save Settings
        </Button>
      </div>
    </Card>
  );
};
