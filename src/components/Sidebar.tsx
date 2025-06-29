import { X, MessageSquare, Database } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  exampleQueries: string[];
  onExampleClick: (query: string) => void;
}

export const Sidebar = ({ isOpen, onClose, exampleQueries, onExampleClick }: SidebarProps) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      <div
        className={`fixed left-0 top-0 h-full bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-80`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-700" />
            <h2 className="font-semibold text-gray-800">Consultas rápidas </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Preguntas de ejemplo
            </h3>
            <div className="space-y-2">
              {exampleQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => onExampleClick(query)}
                  className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 transition-all duration-200 text-sm text-gray-700 hover:text-blue-700"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* <div className="pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-2">
              <p>💡 <strong>Consejo:</strong> Haz preguntas en lenguaje natural</p>
              <p>🔍 Puedo ayudarte con el análisis de datos, tendencias e información</p>
              <p>📊 Intenta preguntar sobre eventos, usuarios, o asistencia de la secretaria académica</p>
            </div>
          </div>  */}
        </div>
      </div>
    </>
  );
};
