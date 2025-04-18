
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';

interface Ticket {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

const TicketsPage = () => {
  const { user, isAuthenticated } = useApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTickets();
    }
  }, [isAuthenticated, user]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Failed to load tickets",
        description: "There was an error loading your support tickets.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      priority: value as 'low' | 'medium' | 'high' 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and description for your ticket.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          status: 'open'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setTickets(prev => [data as Ticket, ...prev]);
      setFormData({ title: '', description: '', priority: 'medium' });
      setShowNewTicketForm(false);
      
      toast({
        title: "Ticket Created",
        description: "Your support ticket has been successfully submitted.",
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Open</span>;
      case 'in_progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">In Progress</span>;
      case 'resolved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Resolved</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Low</span>;
      case 'medium':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Medium</span>;
      case 'high':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">High</span>;
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p>Please log in to view and create support tickets.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 font-colvetica">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        {!showNewTicketForm && (
          <Button 
            onClick={() => setShowNewTicketForm(true)} 
            className="bg-amber-400 hover:bg-amber-500 text-black"
          >
            <Plus className="mr-2 h-4 w-4" /> New Ticket
          </Button>
        )}
      </div>
      
      {showNewTicketForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Support Ticket</CardTitle>
            <CardDescription>
              Describe the issue you're experiencing and our support team will help you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Ticket Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Brief description of your issue"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Please provide details about your issue..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    onValueChange={handlePriorityChange} 
                    defaultValue={formData.priority}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowNewTicketForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-amber-400 hover:bg-amber-500 text-black"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Ticket'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {renderTickets(tickets)}
        </TabsContent>
        <TabsContent value="open">
          {renderTickets(tickets.filter(ticket => ticket.status === 'open'))}
        </TabsContent>
        <TabsContent value="in_progress">
          {renderTickets(tickets.filter(ticket => ticket.status === 'in_progress'))}
        </TabsContent>
        <TabsContent value="resolved">
          {renderTickets(tickets.filter(ticket => ticket.status === 'resolved'))}
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderTickets(ticketsToRender: Ticket[]) {
    if (loading && tickets.length === 0) {
      return (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        </div>
      );
    }

    if (ticketsToRender.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No tickets found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {tickets.length === 0 ? "You haven't created any support tickets yet." : "No tickets match the selected filter."}
          </p>
          {tickets.length === 0 && (
            <Button 
              onClick={() => setShowNewTicketForm(true)} 
              className="mt-4 bg-amber-400 hover:bg-amber-500 text-black"
            >
              Create Your First Ticket
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {ticketsToRender.map(ticket => (
          <Card key={ticket.id} className="overflow-hidden">
            <div className="flex items-center p-4 border-b">
              {ticket.status === 'open' && <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />}
              {ticket.status === 'in_progress' && <Clock className="h-5 w-5 text-yellow-500 mr-2" />}
              {ticket.status === 'resolved' && <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />}
              <h3 className="text-lg font-medium flex-1">{ticket.title}</h3>
              <div className="flex space-x-2">
                {getStatusBadge(ticket.status)}
                {getPriorityBadge(ticket.priority)}
              </div>
            </div>
            <CardContent className="pt-4">
              <p className="whitespace-pre-line">{ticket.description}</p>
              <div className="mt-4 text-sm text-muted-foreground">
                Created: {format(new Date(ticket.created_at), 'MMM d, yyyy h:mm a')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
};

export default TicketsPage;
