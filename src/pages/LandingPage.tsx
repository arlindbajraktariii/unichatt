import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Share2, Users, Zap, ArrowRight, Check } from 'lucide-react';

const LandingPage = () => {
  return <div className="min-h-screen text-black font-colvetica bg-white">
      {/* Header */}
      <header className="container mx-auto my-[26px] px-[31px] py-[14px] rounded-xl bg-white">
        <nav className="flex justify-between items-center">
          <div className="flex items-center">
            
            <h1 className="text-2xl font-bold">Unichat</h1>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-800 hover:text-amber-500 transition-colors">Home</Link>
            <Link to="/pricing" className="text-gray-800 hover:text-amber-500 transition-colors">Pricing</Link>
            <Link to="/help" className="text-gray-800 hover:text-amber-500 transition-colors">How It Works</Link>
          </div>
          <div className="flex gap-4">
            <Link to="/auth">
              <Button variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                Login
              </Button>
            </Link>
            <Link to="/auth?signup=true">
              <Button className="text-white bg-[#212529]">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-[#f8f9fa]">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto mb-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-[#343a40]">
              All Your Communications
              <span className="block mt-2 text-black">In One Place</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-10 text-zinc-500">Unichat seamlessly brings together Slack, Teams, Discord, and more — so your team can communicate clearly, move faster, and stay focused.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?signup=true">
                <Button size="lg" className="text-lg px-8 shadow-md bg-zinc-950 hover:bg-zinc-800 text-white">
                  Start Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className=" text-lg bg-white text-black">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-12 relative max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
              <img alt="Nexus Dashboard" className="w-full h-auto object-cover" src="/lovable-uploads/03282157-3561-4167-96a2-e4a8340e66ad.jpg" />
            </div>
            <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full rounded-xl bg-[#212529]"></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-[50px] bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">One Platform, All Channels</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nexus connects your communication platforms into one seamless experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<MessageSquare className="h-10 w-10 text-amber-400" />} title="Unified Inbox" description="See all your messages from Slack, Discord, Teams, Gmail and more in one unified inbox." className="bg-transparent" />
            
            <FeatureCard icon={<Share2 className="h-10 w-10 text-amber-400" />} title="Cross-Platform Replies" description="Reply to messages from any platform without switching between different apps." />
            
            <FeatureCard icon={<Zap className="h-10 w-10 text-amber-400" />} title="Smart Notifications" description="Customize notifications and never miss important messages while reducing the noise." />
            
            <FeatureCard icon={<Users className="h-10 w-10 text-amber-400" />} title="Team Collaboration" description="Share important messages and collaborate with your team across all platforms." />
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 bg-[#e9ecef]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Connect Your Favorite Platforms</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nexus integrates with all the communication tools you already use
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {['slack', 'discord', 'teams', 'gmail', 'twitter', 'linkedin'].map(platform => <div key={platform} className="flex flex-col items-center rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-[#f8f9fa]">
                <img src={`/logos/${platform}.svg`} alt={`${platform} logo`} className="h-12 w-12 mb-4" />
                <span className="text-center capitalize font-medium">{platform}</span>
              </div>)}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for your communication needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard title="Basic" price="$9.99" period="/month" features={["Connect up to 3 channels", "Basic notification filtering", "7-day message history", "Standard support"]} ctaText="Choose Basic" popular={false} />
            
            <PricingCard title="Pro" price="$24.99" period="/month" features={["Connect up to 10 channels", "Advanced notification rules", "30-day message history", "Message analytics", "Priority support", "Team sharing (up to 3 members)"]} ctaText="Choose Pro" popular={true} />
            
            <PricingCard title="Enterprise" price="$49.99" period="/month" features={["Unlimited channel connections", "Custom notification workflows", "Unlimited message history", "Advanced analytics dashboard", "24/7 premium support", "Unlimited team members", "Custom integrations"]} ctaText="Choose Enterprise" popular={false} />
          </div>
          
          <div className="text-center mt-12">
            <Link to="/pricing">
              <Button className="text-white bg-[#212529]">
                View All Pricing Options
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-black">Ready to streamline your communication?</h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto mb-8">
            Join thousands of professionals who have simplified their digital communication with Nexus.
          </p>
          <Link to="/auth?signup=true">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 text-lg px-8 shadow-md">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-12 bg-[EEBA0B] bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4 bg-transparent">
                <img src="/logo.svg" alt="Nexus Logo" className="h-8 w-8 mr-2" />
                <span className="text-xl font-semibold">Nexus</span>
              </div>
              <p className="text-gray-400 mb-4">
                All your communications in one place
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-amber-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-amber-400">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-400">Integrations</a></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-amber-400">Pricing</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-400">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-gray-400 hover:text-amber-400">Help Center</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-400">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-400">Guides</a></li>
                <li><Link to="/dashboard/tickets" className="text-gray-400 hover:text-amber-400">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-amber-400">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-400">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-400">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-400">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Nexus. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-amber-400 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-amber-400 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-amber-400 text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className
}) => {
  return <Card className={`border-0 shadow-md hover:shadow-lg transition-shadow h-full ${className || ''}`}>
      <CardContent className="p-6 rounded-lg bg-zinc-50">
        <div className="w-16 h-16 flex items-center justify-center mb-6 bg-[212529] bg-transparent">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>;
};

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period,
  features,
  ctaText,
  popular = false
}) => {
  return <div className="bg-zinc-50">
      {popular && <div className="text-center py-2 text-white font-medium bg-[#212529]">
          Most Popular
        </div>}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="mb-6">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-gray-600">{period}</span>
        </div>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>)}
        </ul>
        
        <Link to="/pricing">
          <Button className="text-white bg-[#212529]">
            {ctaText}
          </Button>
        </Link>
      </div>
    </div>;
};

export default LandingPage;
