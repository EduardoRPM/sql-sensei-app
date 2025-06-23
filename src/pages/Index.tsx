
import { useState } from "react";
import { ChatWindow } from "@/components/ChatWindow";
import { InputBar } from "@/components/InputBar";
import { Sidebar } from "@/components/Sidebar";
import { Message } from "@/types/chat";
import { sendMessage } from "@/utils/api";
import { exampleQueries } from "@/data/exampleQueries";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "¡Hola! Soy tu asistente de chat de SQL. ¡Pregúntame cualquier cosa sobre tus datos y te ayudaré a encontrar las respuestas!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
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
        // 👇 Cambia aquí: checa output y data
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


  const handleExampleClick = (query: string) => {
    handleSendMessage(query);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        exampleQueries={exampleQueries}
        onExampleClick={handleExampleClick}
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 lg:hidden"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SQL Chat Assistant
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            Secretaría Académica
          </div>
        </header>

        <div className="flex-1 flex flex-col">
          <ChatWindow messages={messages} isTyping={isTyping} />
          <InputBar onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Index;
