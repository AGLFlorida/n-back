import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { View } from "react-native";
import Svg, { Line, Polyline, Circle, Text } from "react-native-svg";

// TODO limit the number of vectors to what fits on the viewable screen
// TODO add charts for the other 2 game modes
// TODO add highest score to top of screen

export type DataPointType = {
  x: number,
  y: number
}

type Props = {
  data: DataPointType[]
  xLabels?: string[]
}


const Chart = ({ data, xLabels = [] }: Props) => {
  const { theme } = useTheme();

  const chartWidth = 300;
  const chartHeight = 300;
  const maxY = 110;
  const xOffset = 30;
  const yAxisX = 20;
  const yAxisLabelX = 10;
  const spacing = (chartWidth - 40) / (data.length - 1);

  const yLabels = Array.from({ length: 6 }, (_, i) => ({
    label: (i * 20).toString(),
    yPos: chartHeight - ((i * 20) / maxY) * chartHeight,
  }));

  const scaledData = data.map((d, index) => ({
    x: yAxisX + xOffset + (spacing * (index/2)),
    y: chartHeight - (d.y / maxY) * chartHeight,
  }));

  const points = scaledData.map(d => `${d.x},${d.y}`).join(" ");

  return (
    <View style={{ alignItems: "center", marginTop: 50 }}>
      <Svg width={chartWidth + 100} height={chartHeight + 200} viewBox={`-30 0 ${chartWidth + 100} ${chartHeight + 200}`}>
        {/* Y-Axis */}
        <Line x1="20" y1="10" x2="20" y2={chartHeight} stroke={theme.textColor} strokeWidth="2" />

        {/* X-Axis */}
        <Line x1="20" y1={chartHeight} x2={chartWidth + 50} y2={chartHeight} stroke={theme.textColor} strokeWidth="2" />

        {/* Line Chart */}
        {data.length > 1 && <Polyline points={points} fill="none" stroke="blue" strokeWidth="2" />}

        {/* Data Points */}
        {scaledData.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r="4" fill="red" />
        ))}

        {/* X-Axis Labels */}
        {scaledData.map((point, index) => (
          <Text
            key={index}
            x={point.x + 30}
            y={chartHeight + 25}
            fontSize="15"
            textAnchor="middle"
            transform={`rotate(75, ${point.x}, ${chartHeight + 25})`}
            fill={theme.textColor}
          >
            {xLabels[index] || ""}
          </Text>
        ))}

        {/* Y-Axis Labels */}
        {yLabels.map((label, index) => (
          <Text
            key={index}
            x={yAxisLabelX - 10}
            y={label.yPos + 4}
            fontSize="15"
            textAnchor="middle"
            fill={theme.textColor}
          >
            {label.label}
          </Text>
        ))}
      </Svg>
    </View>
  );
};

export default Chart;