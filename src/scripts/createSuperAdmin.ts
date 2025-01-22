import { supabase } from "@/integrations/supabase/client";

async function createSuperAdmin() {
  try {
    // First create the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'dexit@dyc.lv',
      password: 'superadmin'
    });

    if (signUpError) {
      console.error('SignUp Error:', signUpError);
      return;
    }

    if (signUpData.user) {
      // Assign the superadmin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([
          {
            user_id: signUpData.user.id,
            role: 'admin'  // Changed from 'superadmin' to 'admin' to match the enum type
          }
        ]);

      if (roleError) {
        console.error('Role Assignment Error:', roleError);
        return;
      }

      console.log('Superadmin created successfully!');
      console.log('Important: You need to confirm the email address in the Supabase dashboard or disable email confirmation in the authentication settings.');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createSuperAdmin();