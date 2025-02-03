import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormConfigPanel } from "@/components/admin/FormConfigPanel";
import type { Database } from "@/integrations/supabase/types";

type WhitelabelSettings = Database['public']['Tables']['whitelabel_settings']['Row'];
type AppRole = "admin" | "user" | "superadmin";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [settings, setSettings] = useState<WhitelabelSettings>({
    id: '',
    company_name: "",
    primary_color: "",
    welcome_message: "",
    logo_url: "",
    email_template: null,
    tooltip_content: null,
    created_at: null,
    updated_at: null
  });

  useEffect(() => {
    checkAdminStatus();
    fetchSettings();
    fetchUsers();
    fetchSubmissions();
    fetchActivities();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
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

    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data: { users: authUsers } } = await supabase.auth.admin.listUsers();
    const { data: roles } = await supabase.from("user_roles").select("*");

    const usersWithRoles = authUsers.map(user => ({
      ...user,
      role: roles?.find(r => r.user_id === user.id)?.role || 'user'
    }));

    setUsers(usersWithRoles);
  };

  const fetchSubmissions = async () => {
    const { data } = await supabase
      .from("foster_submissions")
      .select("*, external_submissions(*)");
    setSubmissions(data || []);
  };

  const fetchActivities = async () => {
    const { data } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false });
    setActivities(data || []);
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

  const updateUserRole = async (userId: string, newRole: AppRole) => {
    const { error } = await supabase
      .from("user_roles")
      .upsert({ 
        user_id: userId, 
        role: newRole
      });

    if (error) {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    await fetchUsers();
    toast({
      title: "Role updated",
      description: "User role has been updated successfully.",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button
          variant="outline"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="form-config">Form Configuration</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
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
                  value={settings.welcome_message || ''}
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
        </TabsContent>

        <TabsContent value="form-config">
          <FormConfigPanel />
        </TabsContent>

        <TabsContent value="users">
          <Card className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as AppRole)}
                        className="border rounded p-1"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User Info</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      {new Date(submission.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {submission.user_info.email}
                    </TableCell>
                    <TableCell>
                      {submission.external_submissions?.[0]?.status || 'pending'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      {new Date(activity.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>
                      {JSON.stringify(activity.details)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
