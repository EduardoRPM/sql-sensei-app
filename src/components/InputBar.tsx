
import { useState } from "react";
import { Send } from "lucide-react";

const WaitIcon = () => (
  <svg
    className="w-5 h-5"
    width="48"
    height="48"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="24"
      cy="24"
      r="20"
      fill="none"
      stroke="#fff"
      strokeWidth="4"
      strokeDasharray="90 30"
    />
    <rect x="18" y="18" width="12" height="12" rx="2" fill="#fff" />
  </svg>
);

interface InputBarProps {
  onSendMessage: (message: string) => void;
  onCancelSend?: () => void;
  isSidebarOpen: boolean;
}

export const InputBar = ({ onSendMessage, onCancelSend, isSidebarOpen }: InputBarProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;
    if (message.trim()) {
      setIsSending(true);
      await onSendMessage(message.trim());
      setMessage("");
      setIsSending(false);
    }
  };

  const handleCancel = () => {
    if (!isSending) return;
    onCancelSend?.();
    setIsSending(false);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
      setMessage("");
    }
  };

  return (
    <div
      className={`fixed bottom-0 border border-gray-100 px-6 py-4 backdrop-blur-sm transition-all duration-300 ${
        isSidebarOpen ? "left-80" : "left-0"
      } right-0`}
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Pregúntame cualquier cosa sobre tus datos..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[50px] max-h-32"
              rows={1}
            />
          </div>
          <button
            type={isSending ? "button" : "submit"}
            disabled={!isSending && !message.trim()}
            style={{
              backgroundColor: isSending 
                ? "#5F72AB" 
                : message.trim() 
                  ? "#1E398A" 
                  : "#7795C4",
            }}
            onClick={(e) => {
              if (isSending) {
                e.preventDefault();
                handleCancel();
              }
            }}
            onMouseEnter={(e) => {
              if (!isSending && message.trim()) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#152965";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSending && message.trim()) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1E398A";
              }
            }}
            onMouseDown={(e) => {
              if (!isSending && message.trim()) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#111F4B";
              }
            }}
            onMouseUp={(e) => {
              if (!isSending && message.trim()) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1E398A";
              }
            }}
            className="text-white p-3 rounded-xl disabled:cursor-not-allowed transition-colors duration-150 shadow-sm hover:shadow-md flex items-center gap-2"
          >
            {isSending ? (
              <>
                <WaitIcon />
                <span>Enviando</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Enviar</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};