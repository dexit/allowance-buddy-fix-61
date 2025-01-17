import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export interface UserInfoFormData {
  name: string;
  email: string;
  isExperiencedCarer: boolean;
}

interface UserInfoFormProps {
  onSubmit: (data: UserInfoFormData) => void;
  isLoading?: boolean;
}

export function UserInfoForm({ onSubmit, isLoading }: UserInfoFormProps) {
  const form = useForm<UserInfoFormData>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={isLoading} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isExperiencedCarer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foster Care Experience</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={(value) => field.onChange(value === "experienced")}
                  value={field.value ? "experienced" : "new"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Foster Carer</SelectItem>
                    <SelectItem value="experienced">Experienced Foster Carer</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Next'
            )}
          </button>
        </form>
      </Form>
    </motion.div>
  );
}