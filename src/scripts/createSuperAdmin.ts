import { supabase } from "@/integrations/supabase/client";

async function createSuperAdmin() {
  try {
    // First check if the user already exists
    const { data: existingUser } = await supabase.auth.signInWithPassword({
      email: 'dexit@dyc.lv',
      password: 'superadmin'
    });

    let userId;

    if (!existingUser.user) {
      // User doesn't exist, create them
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'dexit@dyc.lv',
        password: 'superadmin'
      });

      if (signUpError) {
        console.error('SignUp Error:', signUpError);
        return;
      }

      userId = signUpData.user?.id;
    } else {
      userId = existingUser.user.id;
    }

    if (userId) {
      // Check if role already exists for this user
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'superadmin')
        .single();

      if (!existingRole) {
        // Assign superadmin role if not already assigned
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([
            {
              user_id: userId,
              role: 'superadmin'
            }
          ]);

        if (roleError) {
          console.error('Role Assignment Error:', roleError);
          return;
        }
      }

      console.log('Superadmin setup completed successfully!');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createSuperAdmin();