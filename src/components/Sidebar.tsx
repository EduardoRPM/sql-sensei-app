import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  X,
  MessageSquare,
  BarChart3,
  PlusCircle,
  ChevronDown,
  ChevronRight,
  LayoutTemplate,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: ReactNode;
  onNewChat: () => void;
  chats?: SidebarListItem[];
  reports?: SidebarListItem[];
  footer?: ReactNode;
  className?: string;
  overlayClassName?: string;
  panelClassName?: string;
}

type SidebarListItem = {
  id: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
};

const focusableSelector =
  'a[href], button, textarea, input, select, details, summary, [tabindex]:not([tabindex="-1"])';

export const Sidebar = ({
  isOpen,
  onClose,
  onNewChat,
  chats = [],
  reports = [],
  title = "Panel de navegación",
  icon = <LayoutTemplate className="w-5 h-5 text-blue-700" />,
  footer,
  className = "",
  overlayClassName = "",
  panelClassName = "",
}: SidebarProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const [areChatsOpen, setAreChatsOpen] = useState(true);
  const [areReportsOpen, setAreReportsOpen] = useState(true);

  const chatItems = useMemo<SidebarListItem[]>(
    () =>
      chats.length
        ? chats
        : [
            { id: "chat-1", label: "Chat de ejemplo 1" },
            { id: "chat-2", label: "Chat de ejemplo 2" },
          ],
    [chats]
  );

  const reportItems = useMemo<SidebarListItem[]>(
    () =>
      reports.length
        ? reports
        : [
            { id: "report-1", label: "Reporte mensual" },
            { id: "report-2", label: "Reporte semanal" },
          ],
    [reports]
  );

  useEffect(() => {
    if (!isOpen) return;

    lastFocusedElement.current = document.activeElement as HTMLElement;
    const panel = panelRef.current;

    const focusFirst = () => {
      const focusable = panel?.querySelectorAll<HTMLElement>(focusableSelector);
      const first = focusable?.[0];
      first?.focus();
    };

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(focusableSelector);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
      trapFocus(event);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    focusFirst();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      lastFocusedElement.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200 ${overlayClassName}`}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
        className={`fixed left-0 top-0 z-50 h-full w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${panelClassName}`}
      >
        <div className={`p-4 border-b border-gray-200 flex items-center justify-between ${className}`}>
          <div className="flex items-center space-x-2">
            {icon}
            <h2 id="sidebar-title" className="font-semibold text-gray-800">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Cerrar panel lateral"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          <button
            onClick={onNewChat}
            className="w-full inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-blue-900 text-white text-sm font-medium hover:bg-blue-800 transition-colors duration-200"
          >
            <PlusCircle className="w-4 h-4" />
            Nuevo chat
          </button>

          <nav aria-label="Navegación de chats y reportes" className="space-y-4">
            <section aria-label="Chats">
              <button
                onClick={() => setAreChatsOpen((prev) => !prev)}
                className="w-full flex items-center justify-between text-sm font-semibold text-gray-800 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                aria-expanded={areChatsOpen}
              >
                <span className="inline-flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  Chats
                </span>
                {areChatsOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {areChatsOpen && (
                <div className="mt-2 space-y-1 overflow-y-auto max-h-48 pr-1">
                  {chatItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                        item.active
                          ? "bg-blue-50 border border-blue-200 text-blue-800"
                          : "bg-gray-50 border border-transparent hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Reportes ocultos temporalmente */}
            {false && (
              <section aria-label="Reportes">
                <button
                  onClick={() => setAreReportsOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between text-sm font-semibold text-gray-800 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                  aria-expanded={areReportsOpen}
                >
                  <span className="inline-flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                    Reportes
                  </span>
                  {areReportsOpen ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {areReportsOpen && (
                  <div className="mt-2 space-y-1 overflow-y-auto max-h-48 pr-1">
                    {reportItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={item.onClick}
                        className="w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-150 bg-gray-50 border border-transparent hover:bg-gray-100 text-gray-700"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </section>
            )}
          </nav>

          {footer}
        </div>
      </div>
    </>
  );
};
