import clsx from "clsx";
import { PieChart, Pie, Tooltip, Label, Legend, Cell } from "recharts";
import { twMerge } from "tailwind-merge";

type TPieChartData = "occupation" | "shifts_comparison";

interface IData {
  name: string;
  value: number;
  type?: string;
  number: number;
  capacity: number;
  label?: string;
}
export default function CustomPieChart({
  data,
  colors,
  label,
  mode = "occupation",
}: {
  data: IData[];
  colors?: string[];
  label?: string;
  mode?: TPieChartData;
}) {
  if (!data || data.length === 0) {
    return null;
  }

  let exceedsCapacity = false;

  let infoText = "";

  if (mode === "occupation") {
    exceedsCapacity = data[0].value > data[0].capacity;
    infoText = `${data[0].value}/${data[0].capacity} occupied${
      exceedsCapacity ? " - Exceeds capacity!" : ""
    }`;
  }

  if (mode === "shifts_comparison") {
    const totalCapacity = data.reduce((sum, entry) => sum + entry.capacity, 0);
    const totalOccupation = data.reduce((sum, entry) => sum + entry.value, 0);
    infoText = `${totalOccupation}/${totalCapacity} occupied`;
  }

  const pieColors = exceedsCapacity
    ? ["#ff5e79"]
    : colors || ["#ea5440", "#f8cbb0"];

  return (
    <div className="flex flex-col items-center">
      <p
        className={twMerge(
          clsx(
            "mt-2 text-sm font-medium text-gray-700",
            exceedsCapacity ? "text-danger" : "",
          ),
        )}
      >
        {infoText}
      </p>
      <PieChart width={200} height={250} className="flex">
        <Pie
          data={data.map((entry) => ({ name: entry.name, value: entry.value }))}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={70}
          innerRadius={30}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}-${index}`}
              fill={pieColors[index % pieColors.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        {label && (
          <Label
            value={label}
            position="center"
            style={{ fontSize: "14px", fontWeight: "bold", fill: "#b62b18" }}
          />
        )}
        <Legend height={80} wrapperStyle={{ bottom: 0 }} />
      </PieChart>
    </div>
  );
}
