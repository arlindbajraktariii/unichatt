
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

const PricingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  const { toast } = useToast();

  const handleSubscription = (tier: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to a plan",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    toast({
      title: "Coming Soon",
      description: `The ${tier} subscription will be available soon!`,
    });
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

  return (
    <div className="container mx-auto py-12 px-4 font-colvetica">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Connect all your communication channels into one unified inbox
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {pricingTiers.map((tier, index) => (
          <Card 
            key={index} 
            className={`flex flex-col h-full border-2 ${tier.highlight ? 'border-amber-400 shadow-lg' : 'border-gray-200'}`}
          >
            <CardHeader>
              {tier.highlight && (
                <div className="bg-amber-400 text-black font-semibold py-1 px-3 rounded-full text-sm mb-4 self-start">
                  Most Popular
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
                className={`w-full ${tier.highlight ? 'bg-amber-400 hover:bg-amber-500 text-black' : ''}`}
              >
                {tier.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
