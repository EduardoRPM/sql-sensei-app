import { useMemo, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels,
);

type DataRow = Record<string, unknown>;

interface DataChartProps {
  data: DataRow[];
}

const isNumeric = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return value.trim() !== "" && Number.isFinite(parsed);
  }

  return false;
};

const sanitizeValue = (value: unknown) => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && isNumeric(value)) {
    return Number(value.trim());
  }

  return value;
};

const findConfig = (data: DataRow[]) => {
  if (!data.length) {
    return null;
  }

  const sample = data[0];
  const columns = Object.keys(sample);
  if (!columns.length) {
    return null;
  }

  const numericColumns = columns.filter((col) => isNumeric(sample[col]));
  const categoricalColumns = columns.filter((col) => !isNumeric(sample[col]));

  const valueKey = numericColumns[0];
  const categoryKey = categoricalColumns[0] ?? columns[0];

  if (!valueKey) {
    return null;
  }

  return { valueKey, categoryKey };
};

export const DataChart = ({ data }: DataChartProps) => {
  const [chartType, setChartType] = useState<"vertical" | "horizontal" | "pastel" | "lineal">("vertical");
  const [isExpanded, setIsExpanded] = useState(false);
  const chartTitles: Record<typeof chartType, string> = {
    vertical: "Vertical bar",
    horizontal: "Horizontal bar",
    pastel: "Pastel (pie)",
    lineal: "Lineal",
  };
  const config = findConfig(data);

  if (!config) {
    return null;
  }

  const normalized = data.map((row, index) => ({
    __index: `Fila ${index + 1}`,
    ...Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key, sanitizeValue(value)]),
    ),
  }));

  const { categoryKey, valueKey } = config;

  const formatNumber = (value: unknown) => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value.toLocaleString();
    }

    if (typeof value === "string" && isNumeric(value)) {
      return Number(value).toLocaleString();
    }

    return String(value ?? "");
  };

  const buildWrappedLabel = (value: string, expanded: boolean) => {
    const label = value.trim();
    if (!label) return "";

    const maxCharsPerLine = expanded ? 16 : 12;
    const words = label.split(" ");
    const lines: string[] = [];
    let current = "";

    words.forEach((word) => {
      const tentative = current ? `${current} ${word}` : word;
      if (tentative.length <= maxCharsPerLine) {
        current = tentative;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    });
    if (current) lines.push(current);

    if (lines.length === 1 && lines[0].length > maxCharsPerLine) {
      const chunk = lines[0].slice(0, maxCharsPerLine * 2 - 3) + "...";
      return [chunk.slice(0, maxCharsPerLine), chunk.slice(maxCharsPerLine)];
    }

    if (lines.length > 2) {
      const combined = lines.join(" ");
      const chunk = combined.slice(0, maxCharsPerLine * 2 - 3) + "...";
      return [chunk.slice(0, maxCharsPerLine), chunk.slice(maxCharsPerLine)];
    }

    return lines;
  };

  const buildLegendLabel = (value: string, expanded: boolean) => {
    const label = value.trim();
    const maxChars = expanded ? 28 : 20;
    if (label.length <= maxChars) return label;
    return `${label.slice(0, maxChars - 3)}...`;
  };

  const chartValues = useMemo(() => {
    return normalized.map((row) => {
      const rawValue = row[valueKey];
      if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
        return rawValue;
      }
      if (typeof rawValue === "string" && isNumeric(rawValue)) {
        return Number(rawValue);
      }
      return 0;
    });
  }, [normalized, valueKey]);

  const chartLabels = useMemo(() => {
    return normalized.map((row) => String(row[categoryKey] ?? ""));
  }, [normalized, categoryKey]);

  const renderChart = (expanded = false) => {
    const axisColor = "#496095";
    const gridColor = "#49609533";
    const fontSize = expanded ? 14 : 12;

    const tooltipCallbacks = {
      label: (context: any) => {
        const rawValue = context?.parsed?.y ?? context?.parsed?.x ?? context?.parsed;
        const index = typeof context?.dataIndex === "number" ? context.dataIndex : -1;
        const fallbackLabel = context?.label ? String(context.label) : "";
        const fullLabel = index >= 0 ? chartLabels[index] : fallbackLabel;
        const prefix = fullLabel ? `${fullLabel}: ` : "";
        return `${prefix}${formatNumber(rawValue)}`;
      },
    };

    if (chartType === "pastel") {
      const pastelColors = ["#496095", "#49609599", "#49609566", "#49609544", "#49609522"];
      const pieData = {
        labels: chartLabels,
        datasets: [
          {
            label: String(valueKey),
            data: chartValues,
            backgroundColor: chartLabels.map((_, index) => pastelColors[index % pastelColors.length]),
            borderWidth: 0,
          },
        ],
      };

      const pieLeaderLinePlugin = {
        id: "pieLeaderLine",
        afterDatasetsDraw: (chart: any) => {
          if (chart?.config?.type !== "pie") return;
          const meta = chart.getDatasetMeta(0);
          if (!meta?.data?.length) return;

          const ctx = chart.ctx;
          ctx.save();
          ctx.strokeStyle = "#49609566";
          ctx.lineWidth = 1;

          meta.data.forEach((arc: any) => {
            const { x, y, startAngle, endAngle, outerRadius } = arc.getProps(
              ["x", "y", "startAngle", "endAngle", "outerRadius"],
              true
            );
            const angle = (startAngle + endAngle) / 2;
            const lineStartX = x + Math.cos(angle) * (outerRadius - 2);
            const lineStartY = y + Math.sin(angle) * (outerRadius - 2);
            const lineEndX = x + Math.cos(angle) * (outerRadius + (expanded ? 20 : 14));
            const lineEndY = y + Math.sin(angle) * (outerRadius + (expanded ? 20 : 14));

            ctx.beginPath();
            ctx.moveTo(lineStartX, lineStartY);
            ctx.lineTo(lineEndX, lineEndY);
            ctx.stroke();
          });

          ctx.restore();
        },
      };

      const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            color: axisColor,
            font: { size: expanded ? 12 : 11, weight: 600 },
            anchor: "end" as const,
            align: "end" as const,
            offset: expanded ? 14 : 10,
            formatter: (value: unknown, context: any) => {
              const label = context?.label ? String(context.label) : "";
              const valueText = formatNumber(value);
              return label ? `${label}\n${valueText}` : valueText;
            },
          },
          legend: {
            display: true,
            position: "bottom" as const,
            labels: {
              color: axisColor,
              font: { size: fontSize, weight: 600 },
            },
          },
          tooltip: {
            callbacks: tooltipCallbacks,
          },
        },
      };

      return <Pie data={pieData} options={pieOptions} plugins={[pieLeaderLinePlugin]} />;
    }

    const axisLabels = chartLabels.map((label) => buildWrappedLabel(label, expanded));
    const baseScales = {
      x: {
        ticks: {
          color: axisColor,
          font: { size: fontSize, weight: 600 },
        },
        grid: {
          color: gridColor,
          display: false,
        },
      },
      y: {
        ticks: {
          color: axisColor,
          font: { size: fontSize - 2, weight: 500 },
          callback: (value: unknown) => formatNumber(value),
        },
        grid: {
          color: gridColor,
        },
      },
    };

    if (chartType === "horizontal") {
      const barData = {
        labels: axisLabels,
        datasets: [
          {
            label: String(valueKey),
            data: chartValues,
            backgroundColor: "#496095",
            borderRadius: { topRight: 4, bottomRight: 4 },
            maxBarThickness: 60,
          },
        ],
      };

      const barOptions = {
        indexAxis: "y" as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: tooltipCallbacks },
        },
        scales: {
          x: {
            ...baseScales.y,
            grid: { color: gridColor, display: true },
          },
          y: {
            ...baseScales.x,
            grid: { display: false },
          },
        },
      };

      return <Bar key={`bar-horizontal-${expanded ? "expanded" : "compact"}`} data={barData} options={barOptions} />;
    }

    if (chartType === "lineal") {
      const lineData = {
        labels: axisLabels,
        datasets: [
          {
            label: String(valueKey),
            data: chartValues,
            borderColor: "#496095",
            backgroundColor: "#49609533",
            pointBackgroundColor: "#496095",
            pointBorderColor: "#49609566",
            pointRadius: expanded ? 4 : 3,
            pointHoverRadius: expanded ? 6 : 5,
            borderWidth: 3,
            tension: 0.35,
            fill: false,
          },
        ],
      };

      const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: { display: false },
          legend: { display: false },
          tooltip: { callbacks: tooltipCallbacks },
        },
        scales: baseScales,
      };

      return <Line data={lineData} options={lineOptions} />;
    }

    const barData = {
      labels: axisLabels,
      datasets: [
        {
          label: String(valueKey),
          data: chartValues,
          backgroundColor: "#496095",
          borderRadius: { topLeft: 4, topRight: 4 },
          maxBarThickness: 60,
        },
      ],
    };

    const barOptions: ChartOptions<"bar"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: tooltipCallbacks },
      },
      scales: {
        x: {
          ...baseScales.x,
          grid: { display: false },
        },
        y: baseScales.y,
      },
    };

    return <Bar key={`bar-vertical-${expanded ? "expanded" : "compact"}`} data={barData} options={barOptions} />;
  };

  return (
    <div className="mt-4 w-full">
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="flex h-10 w-10 items-center justify-center rounded-md bg-white/90 text-[#496095] hover:bg-white hover:text-[#496095CC] transition-colors"
          aria-label="Expand chart"
        >
          <span className="material-symbols-outlined text-2xl">expand_content</span>
        </button>
      </div>
      <div
        className="relative h-80 w-full rounded-lg bg-white p-3 shadow-sm cursor-pointer border-0"
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(true);
          }
        }}
      >
        <div className="h-full w-full">
          {renderChart()}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-3 justify-start">
        <button
          onClick={() => setChartType("horizontal")}
          aria-label="Horizontal bar"
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            chartType === "horizontal"
              ? "text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          style={chartType === "horizontal" ? { backgroundColor: "#496095" } : {}}
        >
          <span className="material-symbols-outlined text-lg sm:hidden">bar_chart</span>
          <span className="hidden sm:inline">Horizontal bar</span>
        </button>
        <button
          onClick={() => setChartType("vertical")}
          aria-label="Vertical bar"
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            chartType === "vertical"
              ? "text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          style={chartType === "vertical" ? { backgroundColor: "#496095" } : {}}
        >
          <span className="material-symbols-outlined text-lg sm:hidden">bar_chart</span>
          <span className="hidden sm:inline">Vertical bar</span>
        </button>
        <button
          onClick={() => setChartType("pastel")}
          aria-label="Pastel"
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            chartType === "pastel"
              ? "text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          style={chartType === "pastel" ? { backgroundColor: "#496095" } : {}}
        >
          <span className="material-symbols-outlined text-lg sm:hidden">pie_chart</span>
          <span className="hidden sm:inline">Pastel</span>
        </button>
        <button
          onClick={() => setChartType("lineal")}
          aria-label="Lineal"
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            chartType === "lineal"
              ? "text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          style={chartType === "lineal" ? { backgroundColor: "#496095" } : {}}
        >
          <span className="material-symbols-outlined text-lg sm:hidden">show_chart</span>
          <span className="hidden sm:inline">Lineal</span>
        </button>
      </div>

      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="relative w-full max-w-5xl rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#496095]">{chartTitles[chartType]}</h3>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-[#496095] hover:text-[#496095CC] text-xl leading-none transition-colors"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="h-[480px] w-full">
              <div className="h-full w-full">
                {renderChart(true)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
