
import { useApp } from "@/context/AppContext";
import MessageList from "@/components/MessageList";

const ArchivedPage = () => {
  const { messages } = useApp();
  
  // Filter for archived messages
  const archivedMessages = messages.filter(message => message.status === "archived");

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Archived Messages</h1>
          <p className="text-muted-foreground">
            Messages you've archived for reference
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm min-h-[500px]">
        <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
          <MessageList messages={archivedMessages} filter="archived" />
        </div>
      </div>
    </div>
  );
};

export default ArchivedPage;
