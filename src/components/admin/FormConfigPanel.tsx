import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const FormConfigPanel = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    hideFirstName: false,
    hideLastName: false,
    hideEmail: false,
    hidePhone: false,
    hidePostcode: false,
    hideAddress: false,
    hideAgeGroup: true,
    hideRegion: true,
    hideCareType: true
  });

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('form_config')
        .upsert({
          id: 1, // Single configuration row
          config: {
            firstName: { hidden: config.hideFirstName },
            lastName: { hidden: config.hideLastName },
            email: { hidden: config.hideEmail },
            phone: { hidden: config.hidePhone },
            postcode: { hidden: config.hidePostcode },
            address: { hidden: config.hideAddress },
            ageGroup: { hidden: config.hideAgeGroup },
            region: { hidden: config.hideRegion },
            careType: { hidden: config.hideCareType }
          }
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Form configuration saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Form Configuration</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="firstName">Hide First Name</Label>
          <Switch
            id="firstName"
            checked={config.hideFirstName}
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, hideFirstName: checked }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="lastName">Hide Last Name</Label>
          <Switch
            id="lastName"
            checked={config.hideLastName}
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, hideLastName: checked }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="email">Hide Email</Label>
          <Switch
            id="email"
            checked={config.hideEmail}
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, hideEmail: checked }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="phone">Hide Phone</Label>
          <Switch
            id="phone"
            checked={config.hidePhone}
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, hidePhone: checked }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="postcode">Hide Postcode</Label>
          <Switch
            id="postcode"
            checked={config.hidePostcode}
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, hidePostcode: checked }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="address">Hide Address</Label>
          <Switch
            id="address"
            checked={config.hideAddress}
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, hideAddress: checked }))}
          />
        </div>

        <Button 
          onClick={handleSaveConfig} 
          disabled={loading}
          className="w-full mt-6"
        >
          Save Configuration
        </Button>
      </div>
    </Card>
  );
};