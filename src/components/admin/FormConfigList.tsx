import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Save, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FormConfig {
  id: number;
  config: {
    firstName?: { hidden: boolean };
    lastName?: { hidden: boolean };
    email?: { hidden: boolean };
    phone?: { hidden: boolean };
    postcode?: { hidden: boolean };
    address?: { hidden: boolean };
    ageGroup?: { hidden: boolean };
    region?: { hidden: boolean };
    careType?: { hidden: boolean };
  };
}

interface SupabaseFormConfig {
  id: number;
  config: unknown;
  created_at: string | null;
  updated_at: string | null;
}

export function FormConfigList() {
  const { toast } = useToast();
  const [configs, setConfigs] = useState<FormConfig[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchConfigs = async () => {
    const { data, error } = await supabase
      .from('form_config')
      .select('*')
      .order('id');

    if (error) {
      toast({
        title: "Error fetching configurations",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    // Transform the data to ensure it matches FormConfig type
    const transformedData: FormConfig[] = (data as SupabaseFormConfig[]).map(item => ({
      id: item.id,
      config: item.config as FormConfig['config']
    }));

    setConfigs(transformedData);
  };

  const handleSave = async (config: FormConfig) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('form_config')
        .upsert({
          id: config.id,
          config: config.config
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Configuration saved successfully",
      });
      
      setEditingId(null);
      await fetchConfigs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('form_config')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Configuration deleted successfully",
      });
      
      await fetchConfigs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete configuration",
        variant: "destructive",
      });
    }
  };

  const createNewConfig = () => {
    const newConfig: FormConfig = {
      id: configs.length + 1,
      config: {
        firstName: { hidden: false },
        lastName: { hidden: false },
        email: { hidden: false },
        phone: { hidden: false },
        postcode: { hidden: false },
        address: { hidden: false },
        ageGroup: { hidden: true },
        region: { hidden: true },
        careType: { hidden: true }
      }
    };
    setConfigs([...configs, newConfig]);
    setEditingId(newConfig.id);
  };

  const toggleField = (configId: number, field: string, value: boolean) => {
    setConfigs(configs.map(config => {
      if (config.id === configId) {
        return {
          ...config,
          config: {
            ...config.config,
            [field]: { hidden: value }
          }
        };
      }
      return config;
    }));
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Form Configurations</h2>
        <Button onClick={createNewConfig}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Configuration
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Fields</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configs.map((config) => (
            <TableRow key={config.id}>
              <TableCell>{config.id}</TableCell>
              <TableCell>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(config.config).map(([field, value]) => (
                    <div key={field} className="flex items-center justify-between">
                      <Label htmlFor={`${config.id}-${field}`} className="mr-2">
                        {field}
                      </Label>
                      <Switch
                        id={`${config.id}-${field}`}
                        checked={value.hidden}
                        disabled={editingId !== config.id}
                        onCheckedChange={(checked) => toggleField(config.id, field, checked)}
                      />
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {editingId === config.id ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSave(config)}
                      disabled={loading}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(config.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(config.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
