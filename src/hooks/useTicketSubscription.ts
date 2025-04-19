
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { Ticket } from '@/types';

export const useTicketSubscription = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('tickets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tickets'
        },
        (payload) => {
          // Update the tickets cache
          queryClient.invalidateQueries({ queryKey: ['tickets'] });

          // Show notification based on the event type
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'New Ticket Created',
              description: `Ticket: ${(payload.new as Ticket).title}`
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: 'Ticket Updated',
              description: `Status changed to: ${(payload.new as Ticket).status}`
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);
};
