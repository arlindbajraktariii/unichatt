
import { useApp } from "@/context/AppContext";
import MessageList from "@/components/MessageList";

const StarredPage = () => {
  const { messages } = useApp();
  
  // Filter for starred messages
  const starredMessages = messages.filter(message => message.is_starred);

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Starred Messages</h1>
          <p className="text-muted-foreground">
            Your saved important messages
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm min-h-[500px]">
        <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
          <MessageList messages={starredMessages} filter="starred" />
        </div>
      </div>
    </div>
  );
};

export default StarredPage;
