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
      // Assign the admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([
          {
            user_id: signUpData.user.id,
            role: 'admin'  // Using 'admin' role as per the schema
          }
        ]);

      if (roleError) {
        console.error('Role Assignment Error:', roleError);
        return;
      }

      console.log('Admin user created successfully!');
      console.log('Important: You need to either:');
      console.log('1. Confirm the email address in the Supabase dashboard');
      console.log('2. Or disable email confirmation in the authentication settings');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createSuperAdmin();