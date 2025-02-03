import { supabase } from "@/integrations/supabase/client";

async function createSuperAdmin() {
  try {
    // First check if the user already exists
    const { data: existingUser } = await supabase
      .from('user_roles')
      .select('*')
      .eq('role', 'admin')
      .single();

    if (existingUser) {
      console.log('Admin user already exists!');
      return;
    }

    // Create the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'dexit@dyc.lv',
      password: 'superadmin123!',  // More secure password
      options: {
        emailRedirectTo: `${window.location.origin}/admin`
      }
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
            role: 'admin'
          }
        ]);

      if (roleError) {
        console.error('Role Assignment Error:', roleError);
        return;
      }

      console.log('Admin user created successfully!');
      console.log('Important: Check your email to confirm your account');
      console.log('Or enable auto-confirm in Supabase Authentication settings');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createSuperAdmin();