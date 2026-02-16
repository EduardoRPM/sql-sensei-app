
import { useState } from "react";
import { ChatWindow } from "@/components/ChatWindow";
import { AppHeader } from "@/components/AppHeader";
import { InputBar } from "@/components/InputBar";
import { Sidebar } from "@/components/Sidebar";
import { Message } from "@/types/chat";
import { sendMessage } from "@/utils/api";
import { exampleQueries } from "@/data/exampleQueries";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /*   const handleSendMessage = async (content: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        isUser: true,
        timestamp: new Date(),
      };
  
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
  
      try {
        const response = await sendMessage(content);
        
        setTimeout(() => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: response.output || "Lo siento, no puedo procesar tu consulta.",
            isUser: false,
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);
        }, 1500);
      } catch (error) {
        console.error("Error sending message:", error);
        setTimeout(() => {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "Lo siento, no puedo procesar tu consulta.",
            isUser: false,
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, errorMessage]);
          setIsTyping(false);
        }, 1500);
      }
    }; */

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await sendMessage(content);

      setTimeout(() => {
        // Cambia aquí: checa output y data
        if (response.output && response.data) {
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              content: response.output, // antes era response.ai_output
              isUser: false,
              timestamp: new Date(),
              data: response.data, // <- aquí viene tu tabla
            }
          ]);
        } else {
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              content: response.output || "Lo siento, no puedo procesar tu consulta.",
              isUser: false,
              timestamp: new Date(),
            }
          ]);
        }
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: "Lo siento, no puedo procesar tu consulta.",
            isUser: false,
            timestamp: new Date(),
          }
        ]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleCancelSend = () => {
    setIsTyping(false);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        content: "Se ha cancelado la petición.",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };


  const handleExampleClick = (query: string) => {
    handleSendMessage(query);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={() => setMessages([])}
      />

      <div className="flex-1 flex flex-col min-h-0">
        <AppHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        

        <div className="flex-1 flex flex-col min-h-0">
          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            onSuggestionSelect={handleExampleClick}
          />
          <InputBar onSendMessage={handleSendMessage} isSidebarOpen={isSidebarOpen} />

        </div>
      </div>
    </div>
  );
};

export default Index;
