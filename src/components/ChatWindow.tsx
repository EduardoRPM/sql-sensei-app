
import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  onSuggestionSelect?: (query: string) => void;
}

type QuickSuggestion = {
  title: string;
  tag: string;
  description: string;
  query: string;
};

const QUICK_SUGGESTIONS: QuickSuggestion[] = [
  {
    title: "Eventos",
    tag: "Más popular",
    description: "¿Cuál ha sido el evento en el que más docentes han asistido en este año y cuántos participantes tuvo?",
    query: "¿Cuál ha sido el evento en el que más docentes han asistido en este año y cuántos participantes tuvo?",
  },
  {
    title: "Docentes",
    tag: "Últimos 3 años",
    description: "Muestre para cada uno de los últimos 3 años, el total de docentes participantes en eventos de formación junto con el total de inscripciones registradas",
    query: "Muestre, para cada uno de los últimos tres años, el total de docentes participantes en eventos de formación, junto con el total de inscripciones registradas",
  },
  {
    title: "Áreas de competencia",
    tag: "Actualidad",
    description: "Muestre las áreas de competencia y su respectivo porcentaje en las que se han formado los docentes en el último año",
    query: "Muestre las áreas de competencia y su respectivo porcentaje en las que se han formado los docentes en el último año?",
  },
];

export const ChatWindow = ({ messages, isTyping, onSuggestionSelect }: ChatWindowProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<QuickSuggestion[]>(QUICK_SUGGESTIONS);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-6 pb-40 space-y-4"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center space-y-10 min-h-[calc(100vh-240px)]">
            <div className="space-y-3 max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-5xl font-semibold text-gray-900 tracking-tight">
                Bienvenido, a <span className="text-blue-700 drop-shadow">IA Institucional</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 font-semibold leading-relaxed">
                Formula tu pregunta y obtén información y reportes de docentes, cursos y talleres
              </p>
            </div>

            <div className="w-full text-left space-y-2 mt-12">
              <div className="flex items-center justify-between text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-600">database</span>
                  <span className="font-semibold">Consultas rápidas</span>
                </div>
                <button
                  type="button"
                  aria-label="Cambiar preguntas sugeridas"
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setSuggestions(prev => [...prev].sort(() => Math.random() - 0.5))}
                >
                  <span className="material-symbols-outlined text-gray-500">shuffle</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestions.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => onSuggestionSelect?.(item.query)}
                    className="w-full text-left border border-gray-200 rounded-2xl px-6 py-6 bg-white hover:border-blue-500 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-gray-500 mt-0.5">chat_bubble</span>
                      <div className="flex-1 space-y-2">
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900 leading-tight">{item.title}</p>
                          <span className="text-xs text-gray-500 leading-tight block">{item.tag}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
};
