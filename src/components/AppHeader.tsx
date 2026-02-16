import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Info, LogOut } from "lucide-react";

interface AppHeaderProps {
  onMenuToggle?: () => void;
}

export const AppHeader = ({ onMenuToggle }: AppHeaderProps) => {
  return (
    <header className="bg-blue-900 text-white p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-blue-800 rounded-lg transition-colors duration-100"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <img src="/logoUaslp-white.png" alt="logoUaslp" className="h-12 w-auto" />
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
            onClick={() => {
              window.location.href = "/Creditos";
            }}
            className="flex items-center gap-2"
          >
            <Info className="h-4 w-4" /> Créditos
          </DropdownMenuItem>

          <DropdownMenuItem
             onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
             }}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
