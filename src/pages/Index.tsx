
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


  const handleExampleClick = (query: string) => {
    handleSendMessage(query);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        exampleQueries={exampleQueries}
        onExampleClick={handleExampleClick}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header>
          <header className="bg-blue-900 text-white p-4 flex items-center justify-between shadow-md">
            <img src="logoUaslp-white.png" alt="logoUaslp" className="h-10 w-auto" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 p-2 hover:bg-blue-800 rounded-lg transition-colors duration-200 border-none  border-none focus:outline-none">
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
         
        </header>
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 "
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold bg-blue-900 bg-clip-text text-transparent">
              Chat Assistant
            </h1>
          </div>
      
        </header>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <ChatWindow messages={messages} isTyping={isTyping} />
          </div>
          <div className="h-[100px]" />
          <InputBar onSendMessage={handleSendMessage} isSidebarOpen={isSidebarOpen} />

        </div>
      </div>
    </div>
  );
};

export default Index;
