
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Share2, Users, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="bg-black rounded-[30px] p-6 flex flex-col md:flex-row justify-between items-center border border-gray-800">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Nexus Logo" className="h-10 w-10 mr-3" />
            <h1 className="text-2xl font-bold">Nexus</h1>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link to="/auth">
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                Login
              </Button>
            </Link>
            <Link to="/auth?signup=true">
              <Button className="bg-nexus-violet hover:bg-indigo-600">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          All Your Communications
          <span className="text-nexus-violet block mt-2">In One Place</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
          Connect all your messaging platforms into a single dashboard. Never miss an important message again.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/auth?signup=true">
            <Button size="lg" className="bg-nexus-violet hover:bg-indigo-600 text-lg px-8">
              Start for Free
            </Button>
          </Link>
          <Link to="/help">
            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg">
              See How It Works
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-16">Simplify Your Digital Communication</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="rounded-full bg-indigo-900/50 w-12 h-12 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-nexus-violet" />
              </div>
              <h3 className="text-xl font-bold mb-2">Unified Inbox</h3>
              <p className="text-gray-400">
                See all your messages from Slack, Discord, Teams, Gmail and more in one unified inbox.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="rounded-full bg-indigo-900/50 w-12 h-12 flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-nexus-violet" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cross-Platform Replies</h3>
              <p className="text-gray-400">
                Reply to messages from any platform without switching between different apps.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="rounded-full bg-indigo-900/50 w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-nexus-violet" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Notifications</h3>
              <p className="text-gray-400">
                Customize notifications and never miss important messages while reducing the noise.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="rounded-full bg-indigo-900/50 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-nexus-violet" />
              </div>
              <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
              <p className="text-gray-400">
                Share important messages and collaborate with your team across all platforms.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your communication?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Join thousands of professionals who have simplified their digital communication with Nexus.
          </p>
          <Link to="/auth?signup=true">
            <Button size="lg" className="bg-white text-indigo-900 hover:bg-gray-200 text-lg px-8">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/logo.svg" alt="Nexus Logo" className="h-8 w-8 mr-2" />
            <span className="text-lg font-semibold">Nexus</span>
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Nexus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
