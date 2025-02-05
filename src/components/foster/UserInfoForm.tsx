import { Form } from "@/components/ui/form";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { userInfoFormSchema, UserInfoFormData, FormConfig } from "@/lib/form-schemas";
import { NameFields } from "./form-fields/NameFields";
import { ContactFields } from "./form-fields/ContactFields";
import { PostcodeField } from "./form-fields/PostcodeField";

interface UserInfoFormProps {
  onSubmit: (data: UserInfoFormData) => void;
  isLoading?: boolean;
  config?: FormConfig;
}

export function UserInfoForm({ onSubmit, isLoading, config }: UserInfoFormProps) {
  const [resolvedAddress, setResolvedAddress] = useState<string>("");
  const { toast } = useToast();
  
  const form = useForm<UserInfoFormData>({
    resolver: zodResolver(userInfoFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      postcode: "",
      address: "",
      isExperiencedCarer: false,
      region: "Rest of England",
      ageGroup: undefined
    }
  });

  const handleFormSubmit = async (data: UserInfoFormData) => {
    try {
      // Try to get form config, but don't block submission if it fails
      const { data: formConfig, error } = await supabase
        .from('form_config')
        .select('*')
        .single();

      if (error) {
        console.warn('Form config not found:', error);
        // Continue with submission even if form_config table doesn't exist
        onSubmit(data);
        return;
      }

      if (formConfig) {
        try {
          await supabase
            .from('form_submissions')
            .insert({
              form_config_id: formConfig.id,
              user_info: data,
              status: 'pending'
            });
        } catch (submissionError) {
          console.warn('Failed to store submission:', submissionError);
        }
      }

      onSubmit(data);
      
    } catch (error: any) {
      console.error('Error in form submission:', error);
      toast({
        title: "Warning",
        description: "Some features may be limited but you can continue.",
        variant: "default"
      });
      // Still call onSubmit even if there was an error
      onSubmit(data);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <NameFields form={form} isLoading={isLoading} config={config} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ContactFields form={form} isLoading={isLoading} config={config} />
            </div>
            <PostcodeField 
              form={form} 
              isLoading={isLoading} 
              config={config}
              onAddressResolved={(address) => {
                setResolvedAddress(address);
                form.setValue('address', address);
              }}
            />
          </div>

          {resolvedAddress && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <p>Resolved Address: {resolvedAddress}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 text-base font-medium bg-primary hover:bg-primary/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Next'
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}