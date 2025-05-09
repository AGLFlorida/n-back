import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { View } from "react-native";
import Svg, { Line, Polyline, Circle, Text } from "react-native-svg";

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
  const labelHeight = 140; 
  const xOffset = 30;
  const yAxisX = 20;
  const yAxisLabelX = 10;

  // Take last 10 points from each dataset
  const limitData = (d: DataPointType[]) => d.slice(Math.max(d.length - 10, 0));
  
  const limitedData = limitData(data);
  
  // Also limit labels
  const limitedLabels = xLabels.slice(Math.max(xLabels.length - 10, 0));

  // Use limited data for spacing calculation
  const spacing = (limitedData.length > 1) ? 
    ((chartWidth - yAxisX - xOffset) / (limitedData.length - 1)) : 0;

  const yLabels = Array.from({ length: 6 }, (_, i) => ({
    label: (i * 200).toString(),
    yPos: chartHeight - ((i * 20) / 110) * chartHeight,
  }));

  const scaledData = limitedData.map((d, index) => ({
    x: yAxisX + xOffset + (spacing * index),
    y: chartHeight - (d.y / 1100) * chartHeight,
  }));

  const points = scaledData.map(d => `${d.x},${d.y}`).join(" ");

  return (
    <View style={{ alignItems: "center" }}>
      <Svg 
        width={chartWidth + 100} 
        height={chartHeight + labelHeight}
        viewBox={`-30 0 ${chartWidth + 100} ${chartHeight + labelHeight}`}
      >
        {/* Y-Axis */}
        <Line x1="20" y1="10" x2="20" y2={chartHeight} stroke={theme.textColor} strokeWidth="2" />

        {/* X-Axis */}
        <Line x1="20" y1={chartHeight} x2={chartWidth + 50} y2={chartHeight} stroke={theme.textColor} strokeWidth="2" />

        {/* Line Chart: Data 1 */}
        {data.length > 1 && <Polyline points={points} fill="none" stroke={theme.textColor} strokeWidth="4" />}

        {/* Data Points: Data 1 */}
        {scaledData.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r="6" fill={theme.textColor} />
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
            {limitedLabels[index] || ""}
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