import { supabase } from "@/integrations/supabase/client";

async function createSuperAdmin() {
  try {
    // First try to sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'dexit@dyc.lv',
      password: 'superadmin'
    });

    if (signUpError) {
      console.error('SignUp Error:', signUpError);
      return;
    }

    if (signUpData.user) {
      // Now assign the superadmin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([
          {
            user_id: signUpData.user.id,
            role: 'superadmin'
          }
        ]);

      if (roleError) {
        console.error('Role Assignment Error:', roleError);
        return;
      }

      console.log('Superadmin created successfully!');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createSuperAdmin();