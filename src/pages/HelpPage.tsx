
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const FAQS = [
  {
    question: "What is Channel Nexus?",
    answer: "Channel Nexus is a comprehensive platform that integrates various communication channels (Discord, Microsoft Teams, Slack, Gmail, etc.) allowing you to manage and respond to messages and notifications from multiple sources in one unified interface."
  },
  {
    question: "How do I connect a new channel?",
    answer: "To connect a new channel, click on the 'Add Channel' button either from the dashboard or the sidebar. Select the type of channel you want to connect, provide a name for it, and follow the authentication steps for that service."
  },
  {
    question: "Can I disconnect a channel later?",
    answer: "Yes, you can disconnect any channel at any time. Navigate to the channel page and click on the 'Disconnect' button. You can always reconnect it later if needed."
  },
  {
    question: "How do I respond to messages?",
    answer: "You can respond to messages directly from Channel Nexus. When viewing a message, click the 'Reply' button or use the dropdown menu to access reply options. Your response will be sent through the original channel."
  },
  {
    question: "What happens when I archive a message?",
    answer: "Archiving a message moves it to your archive section, making it easier to focus on active conversations. Archived messages are still accessible from the 'Archived' section but won't appear in your main message lists."
  },
  {
    question: "Can I customize notification settings?",
    answer: "Yes, you can customize notifications both globally and per channel. Navigate to the 'Notifications' page to configure push notifications, email digests, sound alerts, and to mute specific channels."
  },
  {
    question: "Is my data secure?",
    answer: "Channel Nexus takes security seriously. We use industry-standard encryption for all data transfers and storage. We never store your passwords for third-party services and use secure OAuth connections wherever possible."
  },
  {
    question: "Can I use Channel Nexus on mobile devices?",
    answer: "Yes, Channel Nexus is designed to be responsive and works on desktop, tablet, and mobile devices. We also offer native mobile apps for iOS and Android for a better experience on smartphones."
  }
];

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter FAQs based on search term
  const filteredFAQs = FAQS.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground mt-2">
          Find answers to common questions and learn how to use Channel Nexus
        </p>
      </div>
      
      <div className="relative max-w-xl mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search for help topics..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="w-full">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))
          ) : (
            <div className="py-6 text-center">
              <p className="text-gray-500">No matches found for "{searchTerm}"</p>
            </div>
          )}
        </Accordion>
      </div>
      
      <div className="mt-8 bg-nexus-indigo/5 rounded-lg border border-nexus-indigo/20 p-6">
        <h2 className="text-xl font-semibold mb-2">Still Need Help?</h2>
        <p className="text-muted-foreground mb-4">
          If you couldn't find the answer you were looking for, reach out to our support team.
        </p>
        <div className="space-x-4">
          <Button>Contact Support</Button>
          <Button variant="outline">View Documentation</Button>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
