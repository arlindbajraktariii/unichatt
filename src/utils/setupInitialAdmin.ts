
import { supabase } from "@/integrations/supabase/client";

export const setupInitialAdmin = async (email: string = 'arlindbajraktari966@gmail.com') => {
  try {
    // Get user from profiles
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (userError || !userData) {
      console.error('Error finding user:', userError);
      return;
    }

    // Add as admin if not already
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        user_id: userData.id,
      })
      .select()
      .single();

    if (adminError && !adminError.message.includes('duplicate key')) {
      console.error('Error setting up admin:', adminError);
    }
  } catch (err) {
    console.error('Error in setup:', err);
  }
};
