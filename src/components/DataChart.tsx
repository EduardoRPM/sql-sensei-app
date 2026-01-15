import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { Line, LineChart } from "recharts";

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

  const renderChart = () => {
    const baseMargin = { top: 20, right: 20, left: 10, bottom: 40 };
    const pieLabel = ({
      cx,
      cy,
      midAngle,
      outerRadius,
      percent,
      value,
      name,
    }: any) => {
      const RADIAN = Math.PI / 180;
      const radius = outerRadius + 24;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      const percentText = `${(percent * 100).toFixed(1)}%`;

      return (
        <text x={x} y={y} textAnchor="middle" dominantBaseline="middle">
          <tspan
            x={x}
            dy="-1.4em"
            fontSize="14"
            fontWeight="600"
            fill="#496095"
          >
            {name}
          </tspan>
          <tspan
            x={x}
            dy="1.4em"
            fontSize="16"
            fontWeight="700"
            fill="#496095"
          >
            {value}
          </tspan>
          <tspan
            x={x}
            dy="1.2em"
            fontSize="14"
            fill="#49609599"
          >
            {percentText}
          </tspan>
        </text>
      );
    };

    if (chartType === "horizontal") {
      return (
        <BarChart
          data={normalized}
          margin={baseMargin}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="0" stroke="#49609533" horizontal={false} vertical={true} />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: "#496095" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey={categoryKey}
            tick={{ fontSize: 14, fill: "#496095", fontWeight: 600 }}
            width={120}
            axisLine={false}
            tickLine={false}
          />
          <RechartsTooltip
            formatter={(value) => (typeof value === "number" ? value.toLocaleString() : value)}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #49609533",
              borderRadius: "8px",
              padding: "8px 12px"
            }}
          />
          <Bar
            dataKey={valueKey}
            radius={[0, 4, 4, 0]}
            fill="#496095"
            maxBarSize={60}
          />
        </BarChart>
      );
    }

    if (chartType === "pastel") {
      const pastelColors = ["#496095", "#49609599", "#49609566", "#49609544", "#49609522"];
      return (
        <PieChart>
          <RechartsTooltip
            formatter={(value) => (typeof value === "number" ? value.toLocaleString() : value)}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #49609533",
              borderRadius: "8px",
              padding: "8px 12px"
            }}
          />
          <Pie
            data={normalized}
            dataKey={valueKey}
            nameKey={categoryKey}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={90}
            paddingAngle={1}
            label={pieLabel}
            labelLine={false}
          >
            {normalized.map((_, index) => (
              <Cell key={`cell-${index}`} fill={pastelColors[index % pastelColors.length]} />
            ))}
          </Pie>
        </PieChart>
      );
    }

    if (chartType === "lineal") {
      return (
        <LineChart data={normalized} margin={baseMargin}>
          <CartesianGrid strokeDasharray="0" stroke="#49609533" horizontal={true} vertical={false} />
          <XAxis
            dataKey={categoryKey}
            tick={{ fontSize: 14, fill: "#496095", fontWeight: 600 }}
            interval="preserveStartEnd"
            angle={-25}
            textAnchor="end"
            minTickGap={10}
            tickMargin={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: "#496095" }} 
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
          />
          <RechartsTooltip
            formatter={(value) => (typeof value === "number" ? value.toLocaleString() : value)}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #49609533",
              borderRadius: "8px",
              padding: "8px 12px"
            }}
          />
          <Line
            type="monotone"
            dataKey={valueKey}
            stroke="#496095"
            strokeWidth={3}
            dot={{ r: 4, fill: "#496095", stroke: "#49609566", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      );
    }

    return (
      <BarChart
        data={normalized}
        margin={baseMargin}
      >
        <CartesianGrid strokeDasharray="0" stroke="#49609533" horizontal={true} vertical={false} />
        <XAxis
          dataKey={categoryKey}
          tick={{ fontSize: 14, fill: "#496095", fontWeight: 600 }}
          interval="preserveStartEnd"
          angle={-25}
          textAnchor="end"
          minTickGap={10}
          tickMargin={12}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: "#496095" }} 
          allowDecimals={false}
          axisLine={false}
          tickLine={false}
        />
        <RechartsTooltip
          formatter={(value) => (typeof value === "number" ? value.toLocaleString() : value)}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #49609533",
            borderRadius: "8px",
            padding: "8px 12px"
          }}
        />
        <Bar
          dataKey={valueKey}
          radius={[4, 4, 0, 0]}
          fill="#496095"
          maxBarSize={60}
        />
      </BarChart>
    );
  };

  return (
    <div className="mt-4 w-full">
      <div className="h-80 w-full rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
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
