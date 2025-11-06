"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ReservationsChart({ data }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border-2 border-green-500 text-white px-4 py-2 rounded-lg shadow-xl">
          <p className="font-semibold text-sm">{payload[0].payload.day}</p>
          <p className="text-green-400 text-lg font-bold">
            {payload[0].value} reserva{payload[0].value !== 1 ? "s" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        {/* Grid de fondo */}
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f0f0f0"
          vertical={false}
        />

        {/* Eje X (días) */}
        <XAxis
          dataKey="day"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={{ stroke: "#e5e7eb" }}
          tickLine={false}
        />

        {/* Eje Y (cantidad) */}
        <YAxis
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={{ stroke: "#e5e7eb" }}
          tickLine={false}
          allowDecimals={false}
        />

        {/* Tooltip */}
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(16, 185, 129, 0.1)" }}
        />

        {/* Barras con animación */}
        <Bar
          dataKey="count"
          fill="#10b981"
          radius={[8, 8, 0, 0]}
          maxBarSize={60}
          animationDuration={800}
          animationBegin={0}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
