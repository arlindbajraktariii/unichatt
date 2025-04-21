
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SubscriptionPage = () => {
  const { isAuthenticated, user } = useApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubscription = (tier: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to a plan",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Subscription Updated",
        description: `You are now subscribed to the ${tier} plan!`,
      });
    }, 1500);
  };

  const pricingTiers = [
    {
      name: "Basic",
      price: "$9.99",
      period: "/month",
      description: "For individuals connecting a few channels",
      features: [
        "Connect up to 3 channels",
        "Basic notification filtering",
        "7-day message history",
        "Standard support",
      ],
      notIncluded: [
        "Team collaboration",
        "Analytics dashboard",
        "Priority support",
        "Custom integrations"
      ],
      highlight: false,
      buttonText: "Subscribe",
      buttonAction: () => handleSubscription("Basic")
    },
    {
      name: "Pro",
      price: "$24.99",
      period: "/month",
      description: "For professionals who need more connectivity",
      features: [
        "Connect up to 10 channels",
        "Advanced notification rules",
        "30-day message history",
        "Message analytics",
        "Priority support",
        "Team sharing (up to 3 members)"
      ],
      notIncluded: [
        "Custom integrations",
        "White-label options"
      ],
      highlight: true,
      buttonText: "Subscribe",
      buttonAction: () => handleSubscription("Pro")
    },
    {
      name: "Enterprise",
      price: "$49.99",
      period: "/month",
      description: "For teams and businesses with advanced needs",
      features: [
        "Unlimited channel connections",
        "Custom notification workflows",
        "Unlimited message history",
        "Advanced analytics dashboard",
        "24/7 premium support",
        "Unlimited team members",
        "Custom integrations",
        "White-label options"
      ],
      notIncluded: [],
      highlight: false,
      buttonText: "Subscribe",
      buttonAction: () => handleSubscription("Enterprise")
    }
  ];

  // Simulate a current subscription
  const currentPlan = user?.email === 'arlindbajraktari966@gmail.com' ? "Pro" : null;

  return (
    <div className="container mx-auto py-12 px-4 font-colvetica">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Manage Your Subscription</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Upgrade your plan to unlock more features and connect more channels
        </p>
      </div>

      {currentPlan && (
        <Alert className="mb-8 bg-emerald-50 border-emerald-200">
          <AlertTitle className="text-emerald-800">Current Subscription</AlertTitle>
          <AlertDescription className="text-emerald-700">
            You are currently on the <strong>{currentPlan}</strong> plan. Manage your subscription below.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {pricingTiers.map((tier, index) => (
          <Card 
            key={index} 
            className={`flex flex-col h-full border-2 ${
              tier.highlight ? 'border-[#09090b] shadow-lg' : 
              tier.name === currentPlan ? 'border-emerald-400 shadow-lg' : 'border-gray-200'
            }`}
          >
            <CardHeader>
              {tier.highlight && (
                <div className="bg-[#09090b] text-white font-semibold py-1 px-3 rounded-full text-sm mb-4 self-start">
                  Most Popular
                </div>
              )}
              {tier.name === currentPlan && (
                <div className="bg-emerald-400 text-white font-semibold py-1 px-3 rounded-full text-sm mb-4 self-start">
                  Current Plan
                </div>
              )}
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground">{tier.period}</span>
              </div>
              <CardDescription className="mt-2">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
                {tier.notIncluded.map((feature, i) => (
                  <li key={i} className="flex items-start text-muted-foreground">
                    <X className="h-5 w-5 text-gray-400 mr-2 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={tier.buttonAction} 
                disabled={loading || tier.name === currentPlan}
                className={`w-full ${
                  tier.highlight ? 'bg-[#09090b] hover:bg-[#09090b]/90 text-white' : 
                  tier.name === currentPlan ? 'bg-emerald-400 hover:bg-emerald-500 text-white' : ''
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : tier.name === currentPlan ? (
                  'Current Plan'
                ) : (
                  tier.buttonText
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need help choosing a plan?</h2>
        <p className="mb-6 text-muted-foreground max-w-xl mx-auto">
          Contact our sales team for a personalized recommendation or to discuss custom solutions for your team.
        </p>
        <Button variant="outline" className="border-[#09090b] text-[#09090b]">Contact Sales</Button>
      </div>
    </div>
  );
};

export default SubscriptionPage;
