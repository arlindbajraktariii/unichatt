
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
      // First check if user exists in admin_users table
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If not found, check by email
        const { data: profileData } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', userId)
          .single();
          
        if (profileData?.email === 'arlindbajraktari966@gmail.com') {
          // If email matches, add as admin
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert({
              user_id: userId,
              added_by: userId
            });
            
          if (!insertError) {
            setIsAdmin(true);
          } else {
            console.error("Error adding admin:", insertError);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
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

  const removeAdminUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing admin:', error);
      throw error;
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status, updated_at: new Date() })
        .eq('id', ticketId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  };

  return {
    isAdmin,
    isLoading,
    checkAdminStatus,
    addAdminUser,
    removeAdminUser,
    updateTicketStatus
  };
};
