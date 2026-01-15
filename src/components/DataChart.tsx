import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";

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

  return (
    <div className="mt-4 w-full">
      <div className="h-80 w-full rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={normalized}
            margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="0" stroke="#E5E7EB" horizontal={true} vertical={false} />
            <XAxis
              dataKey={categoryKey}
              tick={{ fontSize: 14, fill: "#ffffffff", fontWeight: 600 }}
              interval={0}
              angle={0}
              textAnchor="middle"
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: "#374151" }} 
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
            />
            <RechartsTooltip
              formatter={(value) => (typeof value === "number" ? value.toLocaleString() : value)}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                padding: "8px 12px"
              }}
            />
            <Bar
              dataKey={valueKey}
              radius={[4, 4, 0, 0]}
              fill="#4F6BA8"
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex gap-2 mt-3 justify-start">
        <button
          onClick={() => setChartType("horizontal")}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            chartType === "horizontal"
              ? "text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          style={chartType === "horizontal" ? { backgroundColor: "#496095" } : {}}
        >
          Horizontal bar
        </button>
        <button
          onClick={() => setChartType("vertical")}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            chartType === "vertical"
              ? "text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          style={chartType === "vertical" ? { backgroundColor: "#496095" } : {}}
        >
          Vertical bar
        </button>
        <button
          onClick={() => setChartType("pastel")}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            chartType === "pastel"
              ? "text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          style={chartType === "pastel" ? { backgroundColor: "#496095" } : {}}
        >
          Pastel
        </button>
        <button
          onClick={() => setChartType("lineal")}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            chartType === "lineal"
              ? "text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          style={chartType === "lineal" ? { backgroundColor: "#496095" } : {}}
        >
          Lineal
        </button>
      </div>
    </div>
  );
};
