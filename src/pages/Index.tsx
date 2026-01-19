
import { useState } from "react";
import { ChatWindow } from "@/components/ChatWindow";
import { InputBar } from "@/components/InputBar";
import { Sidebar } from "@/components/Sidebar";
import { Message } from "@/types/chat";
import { sendMessage } from "@/utils/api";
import { exampleQueries } from "@/data/exampleQueries";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, ChevronDown, Info } from "lucide-react";

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
        <header className="bg-blue-900 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-blue-800 rounded-lg transition-colors duration-100 "
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <img src="logoUaslp-white.png" alt="logoUaslp" className="h-12 w-auto" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 p-2 hover:bg-blue-800 rounded-lg transition-colors duration-200 border-none focus:outline-none">
                <span>User</span>
                <ChevronDown className="w-5 h-5 text-white" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="bg-white text-black">
              <DropdownMenuItem
                onClick={() => { window.location.href = "/Creditos" }}
                className="flex items-center gap-2"
              >
                <Info className="h-4 w-4" /> Créditos
              </DropdownMenuItem>

              <DropdownMenuItem
                // onClick={() => {
                // Acción para cerrar sesión
                //  localStorage.clear()
                //  window.location.href = "/login"
                // }}
                className="flex items-center gap-2">
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        

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
