import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps,
} from "recharts";

interface TemperatureReading {
  timestamp: string | number;
  temperature: number;
  location?: string;
  isBreached?: boolean;
}

interface TemperatureChartProps {
  data: TemperatureReading[];
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data }) => {
  // If the timestamp is a number, convert to a date string
  const formattedData = data.map((reading) => {
    let formattedTimestamp = reading.timestamp;

    if (typeof reading.timestamp === "number") {
      formattedTimestamp = new Date(reading.timestamp * 1000).toLocaleString();
    }

    return {
      ...reading,
      formattedTimestamp,
    };
  });

  const maxTemp = Math.ceil(Math.max(...data.map((item) => item.temperature)));
  const minTemp = Math.floor(Math.min(...data.map((item) => item.temperature)));
  const yDomain = [Math.min(minTemp - 1, -1), Math.max(maxTemp + 1, 5)];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formattedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="formattedTimestamp"
          angle={-45}
          textAnchor="end"
          height={70}
          fontSize={12}
        />
        <YAxis
          label={{
            value: "Temperature (°C)",
            angle: -90,
            position: "insideLeft",
          }}
          domain={yDomain}
        />
        <Tooltip
          content={({
            active,
            payload,
            label,
          }: TooltipProps<number, string>) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white p-3 border rounded shadow-lg">
                  <p className="text-gray-600 text-sm">{label}</p>
                  <p className="text-blue-600 font-medium">{`${
                    typeof payload[0].value === "number"
                      ? payload[0].value.toFixed(1)
                      : payload[0].value
                  }°C`}</p>
                  {payload[0].payload.location && (
                    <p className="text-gray-500 text-xs">{`Location: ${payload[0].payload.location}`}</p>
                  )}
                  {payload[0].payload.isBreached && (
                    <p className="text-red-500 text-xs">
                      Temperature breach detected
                    </p>
                  )}
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />

        {/* Reference lines for optimal temperature range */}
        <ReferenceLine
          y={0}
          stroke="orange"
          strokeDasharray="3 3"
          label="Min Optimal (0°C)"
        />
        <ReferenceLine
          y={4}
          stroke="orange"
          strokeDasharray="3 3"
          label="Max Optimal (4°C)"
        />

        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#2563eb"
          activeDot={{ r: 8 }}
          strokeWidth={2}
          dot={(props) => {
            const { cx, cy, payload } = props;
            return (
              <circle
                cx={cx}
                cy={cy}
                r={4}
                stroke="#2563eb"
                strokeWidth={2}
                fill={payload.isBreached ? "#ef4444" : "#fff"}
              />
            );
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TemperatureChart;
