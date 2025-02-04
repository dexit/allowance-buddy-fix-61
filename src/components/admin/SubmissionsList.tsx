import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

interface Submission {
  id: string;
  created_at: string;
  form_config_id: number;
  user_info: any;
  status: string;
}

export function SubmissionsList() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching submissions",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setSubmissions(data || []);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Form Submissions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Form Config</TableHead>
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
              <TableCell>{submission.form_config_id}</TableCell>
              <TableCell>
                <pre className="text-xs">
                  {JSON.stringify(submission.user_info, null, 2)}
                </pre>
              </TableCell>
              <TableCell>{submission.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}