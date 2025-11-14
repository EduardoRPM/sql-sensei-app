import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

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
    <div className="mt-4 h-64 w-full rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
        Visualización rápida
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={normalized}
          margin={{ top: 10, right: 16, left: 0, bottom: 24 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={categoryKey}
            tick={{ fontSize: 12 }}
            interval={0}
            angle={normalized.length > 4 ? -20 : 0}
            textAnchor={normalized.length > 4 ? "end" : "middle"}
          />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <RechartsTooltip
            formatter={(value) => (typeof value === "number" ? value.toLocaleString() : value)}
          />
          <Bar
            dataKey={valueKey}
            radius={[6, 6, 0, 0]}
            fill="url(#chatGradient)"
            maxBarSize={48}
          />
          <defs>
            <linearGradient id="chatGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.7} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
