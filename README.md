# 🧙‍♂️ SQL Sensei - IA para Consultas de Base de Datos

[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**SQL Sensei** es una aplicación web moderna que utiliza inteligencia artificial para convertir consultas en lenguaje natural a SQL y visualizar los resultados de forma interactiva. Diseñada especialmente para análisis de datos de eventos de formación docente.

## � Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Scripts Disponibles](#scripts-disponibles)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## ✨ Características

### 🤖 Interfaz de Chat IA
- Envía consultas en **lenguaje natural** sobre tu base de datos
- Recibe respuestas inteligentes generadas por IA
- Historial de conversación persistente
- Sugerencias rápidas predefinidas para consultas comunes

### 📊 Visualización de Datos
- Tablas interactivas con resultados de consultas
- Gráficos personalizados para análisis visual
- Formateo automático de datos
- Soporte para múltiples tipos de datos

### 🎨 Interfaz Moderna
- Diseño responsivo (mobile-first)
- Tema adaptable (claro/oscuro)
- Componentes UI reutilizables
- Experiencia de usuario fluida con animaciones

### ⚡ Rendimiento
- Build optimizado con Vite
- Carga rápida de la aplicación
- Lazy loading de componentes
- Caché inteligente de datos

---

## 🚀 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v16 o superior ([Descargar](https://nodejs.org/))
- **npm** v7 o superior, **yarn**, o **bun** como package manager
- **Git** ([Descargar](https://git-scm.com/))

Verificar versiones:
```bash
node --version
npm --version
```

---

## 📦 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/sql-sensei-app.git
cd sql-sensei-app
```

### 2. Instalar Dependencias

Con **npm**:
```bash
npm install
```

O con **bun** (más rápido):
```bash
bun install
```

O con **yarn**:
```bash
yarn install
```

### 3. Configurar Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
# Backend
VITE_APP_API_URL=https://n8n.glimpse.uaslp.mx
VITE_WEBHOOK_URL=https://n8n.glimpse.uaslp.mx/webhook/[tu-webhook-id]
```

### 4. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:8080`

---

## 📖 Uso

### Enviar una Consulta

1. **Escribe tu pregunta** en la barra de entrada (ej: "¿Cuántos docentes participaron en eventos en 2024?")
2. **Presiona Enter** o haz click en el botón enviar
3. **Espera la respuesta** con el indicador de carga
4. **Visualiza los resultados** en tabla o gráfico

### Ejemplos de Consultas

```
"¿Cuál ha sido el evento en el que más docentes han asistido en este año?"

"Muestre para cada uno de los últimos 3 años, el total de docentes 
participantes en eventos de formación"

"¿Cuántos docentes de la FACULTAD DE INGENIERIA participaron en eventos 
durante los últimos 3 años?"
```

---

## 🏗️ Estructura del Proyecto

```
sql-sensei-app/
│
├── src/
│   ├── pages/                    # Contenedores de página
│   │   ├── Index.tsx            # Página principal (Chat)
│   │   ├── Login.tsx            # Autenticación
│   │   ├── Creditos.tsx         # Página de créditos
│   │   └── NotFound.tsx         # Error 404
│   │
│   ├── components/              # Componentes React
│   │   ├── ChatWindow.tsx       # Ventana de chat
│   │   ├── InputBar.tsx         # Barra de entrada
│   │   ├── MessageBubble.tsx    # Burbujas de mensaje
│   │   ├── Sidebar.tsx          # Navegación
│   │   ├── AppHeader.tsx        # Header global
│   │   ├── DataChart.tsx        # Visualización gráfica
│   │   ├── TypingIndicator.tsx  # Indicador de escritura
│   │   └── ui/                  # Componentes UI (shadcn/ui)
│   │
│   ├── types/                   # Tipos TypeScript
│   │   └── chat.ts              # Interfaces de chat
│   │
│   ├── hooks/                   # Custom React Hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── utils/                   # Funciones auxiliares
│   │   ├── api.ts               # Cliente HTTP
│   │   └── dateUtils.ts         # Utilidades de fecha
│   │
│   ├── data/                    # Datos estáticos
│   │   └── exampleQueries.ts    # Queries predefinidas
│   │
│   ├── lib/                     # Librerías compartidas
│   │   └── utils.ts
│   │
│   ├── App.tsx                  # Componente raíz
│   ├── main.tsx                 # Punto de entrada
│   └── index.css                # Estilos globales
│
├── public/                      # Assets estáticos
│   └── robots.txt
│
├── Configuración
│   ├── vite.config.ts           # Configuración Vite
│   ├── tailwind.config.ts       # Tailwind CSS
│   ├── tsconfig.json            # TypeScript
│   ├── eslint.config.js         # Linting
│   ├── postcss.config.js        # PostCSS
│   └── components.json          # shadcn/ui config
│
└── package.json
```

---

## 🏛️ Arquitectura

### Patrón Arquitectónico: Feature-Based Component Architecture

```
┌─────────────────────────────────────────┐
│     Capa de Presentación (Pages)        │
│  (Index, Login, Creditos, NotFound)     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│   Capa de Componentes Inteligentes       │
│  (ChatWindow, InputBar, MessageBubble)   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│    Capa de Componentes UI (shadcn/ui)   │
│  (Button, Input, Dialog, Card, Table)   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│   Capa de Lógica y Estado                │
│   (Hooks, React Query, Estado)           │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  Capa de Datos y Comunicación            │
│  (Types, Utils, API Client)              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│     Backend (N8N) + Base de Datos        │
└─────────────────────────────────────────┘
```

---

## 💻 Tecnologías

### Frontend
- **React 18.3** - Librería UI
- **TypeScript 5.5** - Type safety
- **Vite 5.4** - Build tool (⚡ Ultra-rápido)
- **React Router 6.26** - Enrutamiento
- **React Query 5.56** - Gestión de datos async

### UI & Estilos
- **Tailwind CSS 3.4** - Estilos utilities
- **shadcn/ui** - Componentes de UI reutilizables (30+)
- **Lucide React 0.462** - Iconos
- **Radix UI** - Primitivos accesibles

### Visualización
- **Chart.js 4.4.7** - Librería de gráficos
- **react-chartjs-2 5.3** - Integración React para Chart.js
- **chartjs-plugin-datalabels 2.2** - Labels en gráficos

### Formularios & Validación
- **React Hook Form 7.53** - Gestión de formularios
- **Zod 3.23.8** - Validación de esquemas
- **@hookform/resolvers 3.9** - Integración Zod + React Hook Form

### Desarrollo
- **ESLint 9.9** - Linting (calidad de código)
- **TypeScript ESLint** - Reglas de TS
- **Autoprefixer** - Prefijos CSS
- **SWC** - Compilador Rust rápido

---

## 🔧 Scripts Disponibles

### Desarrollo
```bash
npm run dev          # Inicia servidor de desarrollo (puerto 8080)
```

### Build
```bash
npm run build        # Compilar para producción
npm run build:dev   # Compilar en modo desarrollo
```

### Linting
```bash
npm run lint        # Verificar calidad de código
```

### Preview
```bash
npm run preview     # Pre-visualizar build de producción
```

---

### Compilación y Verificación

```bash
npm run lint       # Verificar errores de código
npm run build      # Compilar y verificar errores
npm run dev        # Ejecutar en desarrollo
```
---

## 🚀 Performance

- **Lighthouse Score**: 90+
- Código dividido automáticamente (code-splitting)
- Caché de API con React Query
- Imágenes optimizadas
- Minificación automática

---

## 📝 Convenciones de Código

### Componentes
```typescript
// PascalCase
export const ChatWindow = ({ messages }: ChatWindowProps) => {
  return <div>...</div>;
};
```

### Funciones
```typescript
// camelCase
export const sendMessage = async (message: string) => {
  // lógica
};
```

### Variables
```typescript
// camelCase
const isTyping = false;
const messages: Message[] = [];
const WEBHOOK_URL = "https://..."; // constantes en UPPER_SNAKE_CASE
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor:

1. **Fork** el repositorio
2. **Crea una rama** (`git checkout -b feature/AmazingFeature`)
3. **Commit cambios** (`git commit -m 'Add AmazingFeature'`)
4. **Push a la rama** (`git push origin feature/AmazingFeature`)
5. **Abre un Pull Request**

---

## 

**Stack Tecnológico**:
- Built with [Lovable](https://lovable.dev)
- Powered by [N8N](https://n8n.io)
- UI Components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)



To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
