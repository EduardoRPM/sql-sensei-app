import { useState } from "react";
import { Mail, Lock, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "@/utils/auth";
import { getAssetUrl } from "@/utils/paths";

const Login = () => {
  const [rpe, setRpe] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Aquí iría la lógica de autenticación
    try {
      // Simular llamada al backend
      console.log("Login attempt:", { rpe, password });
      login();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-[60%] bg-gradient-to-b from-blue-50 to-white items-center justify-center p-0 overflow-hidden">
        <img
          src={getAssetUrl("1_2imgSecretaria.png")}
          alt="UASLP"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[40%] flex flex-col items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Logo Section */}
          <div className="flex justify-center">
            <img
              src={getAssetUrl("1_3logo-sa_uaslp-blue.png")}
              alt="UASLP y Secretaría Académica"
              className="w-auto"
            />
          </div>

          {/* Form Section */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* RPE Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Ingresa tu RPE"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700 placeholder-gray-500"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700 placeholder-gray-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-400"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Contact Information */}
          <div className="border-t border-gray-200 pt-8 text-md text-gray-700 space-y-4 text-center">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Coordinación de Tecnología Educativa
              </h3>
              <p className="text-gray-600">Secretaría Académica de la UASLP</p>
              <div className="mt-2 space-y-1 flex flex-col items-center">
                <p className="flex items-center gap-2 justify-center">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a
                    href="mailto:tecnologia.educativa@uaslp.mx"
                    className="text-blue-700 underline underline-offset-2"
                  >
                    tecnologia.educativa@uaslp.mx
                  </a>
                </p>
                <p className="flex items-center gap-2 justify-center">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  Tel. (444) 826 23 00 ext. 5251 a 5253
                </p>
              </div>
            </div>

            <div>
              <p className="text-gray-600">
                Universidad Autónoma de San Luis Potosí
              </p>
              <p className="text-gray-600">
                Ave. Niño Artillero No. 150, Segundo Piso
              </p>
              <p className="text-gray-600">
                Zona Universitaria Poniente, C.P. 78290
              </p>
              <p className="text-gray-600">San Luis Potosí, S.L.P., México</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
