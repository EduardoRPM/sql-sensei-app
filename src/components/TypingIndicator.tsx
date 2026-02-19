
import { useEffect, useState } from "react";

const PROGRESS_STEPS = [
  { label: "Analizando consulta...", icon: "manage_search" },
  { label: "Generando consulta SQL...", icon: "code" },
  { label: "Consultando base de datos...", icon: "database" },
  { label: "Generando grafica...", icon: "bar_chart" },
];

const TOTAL_DURATION_MS = 60_000;
const STEP_DURATION_MS = Math.floor(
  TOTAL_DURATION_MS / Math.max(PROGRESS_STEPS.length - 1, 1)
);

export const TypingIndicator = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, PROGRESS_STEPS.length - 1));
    }, STEP_DURATION_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-white text-gray-800 border border-gray-200 px-5 py-4 rounded-2xl shadow-sm max-w-md w-full">
        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide">
          <span className="material-symbols-outlined text-sm animate-spin" aria-hidden="true">
            autorenew
          </span>
          Thinking...
        </div>
        <div className="relative mt-3 pl-5">
          <div className="absolute left-2 top-1 bottom-1 w-px bg-gray-200"></div>
          {PROGRESS_STEPS.map((step, index) => {
            const isActive = index === stepIndex;
            const isDone = index < stepIndex;

            return (
              <div key={step.label} className="flex items-start gap-3 py-2">
                <span
                  className={`material-symbols-outlined text-base ${
                    isActive
                      ? "text-[#496095] animate-pulse"
                      : isDone
                      ? "text-[#496095]"
                      : "text-gray-400"
                  }`}
                >
                  {isDone ? "check_circle" : step.icon}
                </span>
                <span
                  className={`text-sm ${
                    isActive
                      ? "text-[#496095] font-semibold"
                      : isDone
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
