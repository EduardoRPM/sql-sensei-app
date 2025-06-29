import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, ChevronDown, Info, Phone, Globe, Mail } from "lucide-react";


const CreditosPage = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-screen">
      <header className="bg-blue-900 text-white p-4 flex items-center justify-between shadow-md">
        <img src="/logoUaslp-white.png" alt="logoUaslp" className="h-10 w-auto" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 p-2 hover:bg-blue-800 rounded-lg transition-colors duration-200 focus:outline-none">
              <span>User</span>
              <ChevronDown className="w-5 h-5 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white text-black">
            <DropdownMenuItem
              onClick={() => (window.location.href = "/Creditos")}
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

      <main className="p-6 text-center flex-grow">
        <h2 className="text-3xl font-semibold mb-10 text-gray-500">Créditos</h2>

        <div className="flex flex-col md:flex-row justify-center gap-6 mb-16">
          <div className="bg-gray-100 p-6 rounded-lg shadow text-center w-full md:w-1/4">
            <h3 className="font-semibold text-lg mb-2">Coordinación de Tecnología Educativa</h3>
            <p>M.G.A.A.V. José de Jesús Rodríguez Sánchez</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow text-center w-full md:w-1/4">
            <h3 className="font-semibold text-lg mb-2">Coordinación de Desarrollo Informático</h3>
            <p>M.I.S.S.C. Adán López Robledo</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow text-center w-full md:w-1/4">
            <h3 className="font-semibold text-lg mb-2">Equipo Técnico</h3>
            <p><a href="mailto:eduardoxrpm@gmail.com" >Eduardo Rafael Pérez Martínez</a></p>
            <p><a href="mailto:erickagr119@gmail.com" >Ericka González Romero</a></p>
          </div>
        </div>

        <footer className="bg-white border-t pt-8 pb-10 text-sm text-left text-gray-800">
          <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 items-start">
            <div>
              <h4 className="font-semibold border-b-2 border-blue-900 mb-2">UASLP</h4>
              <p>Universidad Autónoma de San Luis Potosí</p>
              <p>Álvaro Obregón #64, Col. Centro, C.P. 78000</p>
              <p>San Luis Potosí, S.L.P., México</p>
              <p>Tel. +52 (444) 826 2300</p>
            </div>

            <div>
              <h4 className="font-semibold border-b-2 border-blue-900 mb-2">Secretaría Académica</h4>
              <p>Centro de Servicios Integrales</p>
              <p>Avenida Niño Artillero 150</p>
              <p>Zona Universitaria, C.P. 78290</p>
              <p>San Luis Potosí, S.L.P., México</p>
              <p>Tel. +52 (444) 834 2581</p>
              
            </div>

           <div>
                <h4 className="font-semibold border-b-2 border-blue-900 mb-2">Tecnología Educativa</h4>

                <p className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-black" />
                    <a href="https://academica.uaslp.mx/ead/cte/" className="text-blue-600 underline">
                    https://academica.uaslp.mx/ead/cte/
                    </a>
                </p>

                <p className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-black " />
                    <a href="mailto:tecnologia.educativa@uaslp.mx" className="text-blue-600 underline">
                    tecnologia.educativa@uaslp.mx
                    </a>
                </p>

                <p className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-black" />
                    Tel. (444) 826 23 00 ext 5252
                </p>
                </div>


            <div className="flex justify-center md:justify-end gap-4 items-center">
              <img src="2_3logoNuevo.png" alt="Logo UASLP y Secretaría Académica" className="h-15" />
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default CreditosPage;
