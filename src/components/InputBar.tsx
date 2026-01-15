
import { useState } from "react";
import { Send } from "lucide-react";

interface InputBarProps {
  onSendMessage: (message: string) => void;
  isSidebarOpen: boolean;
}

export const InputBar = ({ onSendMessage, isSidebarOpen }: InputBarProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      className={`fixed bottom-0 border border-gray-100 px-6 py-4 backdrop-blur-sm transition-all duration-300 ${
        isSidebarOpen ? "left-80" : "left-0"
      } right-0`}
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Input"
            className="flex-1 h-12 rounded-full border-2 border-gray-300 bg-white px-5 text-sm sm:text-base text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="h-12 px-5 rounded-full bg-blue-800 text-white flex items-center gap-2 shadow-sm hover:shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Enviar"
          >
            <Send className="w-4 h-4" />
            <span className="text-sm font-medium">Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
};