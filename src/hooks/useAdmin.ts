
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const checkAdminStatus = async (userId: string | undefined) => {
    if (!userId) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Admin check error:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error("Admin check error:", err);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const addAdminUser = async (email: string, currentUserId: string) => {
    try {
      // First get the user id from the profiles table
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        throw new Error(`User with email ${email} not found`);
      }

      // Add user as admin
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          user_id: userData.id,
          added_by: currentUserId
        });

      if (insertError) throw insertError;

      return true;
    } catch (error) {
      console.error('Error adding admin:', error);
      throw error;
    }
  };

  return {
    isAdmin,
    isLoading,
    checkAdminStatus,
    addAdminUser
  };
};
