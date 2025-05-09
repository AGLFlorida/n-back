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
  data2?: DataPointType[]
  data3?: DataPointType[]
  data4?: DataPointType[]
  data5?: DataPointType[]
}


const Chart = ({ data, data2, data3, data4, data5, xLabels = [] }: Props) => {
  const { theme } = useTheme();

  const chartWidth = 300;
  const chartHeight = 300;
  const labelHeight = 140; 
  const maxY = 110;
  const xOffset = 30;
  const yAxisX = 20;
  const yAxisLabelX = 10;

  // Take last 10 points from each dataset
  const limitData = (d: DataPointType[]) => d.slice(Math.max(d.length - 10, 0));
  
  const limitedData = limitData(data);
  const limitedData2 = data2 ? limitData(data2) : [];
  const limitedData3 = data3 ? limitData(data3) : [];
  const limitedData4 = data4 ? limitData(data4) : [];
  const limitedData5 = data5 ? limitData(data5) : [];
  
  // Also limit labels
  const limitedLabels = xLabels.slice(Math.max(xLabels.length - 10, 0));

  // Use limited data for spacing calculation
  const spacing = (limitedData.length > 1) ? 
    ((chartWidth - yAxisX - xOffset) / (limitedData.length - 1)) : 0;

  const yLabels = Array.from({ length: 6 }, (_, i) => ({
    label: (i * 200).toString(),
    yPos: chartHeight - ((i * 20) / maxY) * chartHeight,
  }));

  const scaledData = limitedData.map((d, index) => ({
    x: yAxisX + xOffset + (spacing * index),
    y: chartHeight - (d.y / maxY) * chartHeight,
  }));

  let scaledData2: DataPointType[] = [];
  if (data2) {
    scaledData2 = limitedData2.map((d, index) => ({
      x: yAxisX + xOffset + (spacing * index),
      y: chartHeight - (d.y / maxY) * chartHeight,
    }));
  }

  let scaledData3: DataPointType[] = [];
  if (data3) {
    scaledData3 = limitedData3.map((d, index) => ({
      x: yAxisX + xOffset + (spacing * index),
      y: chartHeight - (d.y / maxY) * chartHeight,
    }));
  }

  let scaledData4: DataPointType[] = [];
  if (data4) {
    scaledData4 = limitedData4.map((d, index) => ({
      x: yAxisX + xOffset + (spacing * index),
      y: chartHeight - (d.y / maxY) * chartHeight,
    }));
  }

  let scaledData5: DataPointType[] = [];
  if (data5) {
    scaledData5 = limitedData5.map((d, index) => ({
      x: yAxisX + xOffset + (spacing * index),
      y: chartHeight - (d.y / maxY) * chartHeight,
    }));
  }

  const points = scaledData.map(d => `${d.x},${d.y}`).join(" ");
  const points2 = scaledData2.map(d => `${d.x},${d.y}`).join(" ");
  const points3 = scaledData3.map(d => `${d.x},${d.y}`).join(" ");
  const points4 = scaledData4.map(d => `${d.x},${d.y}`).join(" ");
  const points5 = scaledData5.map(d => `${d.x},${d.y}`).join(" ");

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
        {data.length > 1 && <Polyline points={points} fill="none" stroke="blue" strokeWidth="2" />}

        {/* Data Points: Data 1 */}
        {scaledData.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r="4" fill="red" />
        ))}

        {/* Line Chart: Data 2 */}
        {data2 && data2.length > 1 && <Polyline points={points2} fill="none" stroke="green" strokeWidth="2" />}

        {/* Data Points: Data 2 */}
        {scaledData2 && scaledData2.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r="4" fill="orange" />
        ))}

        {/* Line Chart: Data 3 */}
        {data3 && data3.length > 1 && <Polyline points={points3} fill="none" stroke="purple" strokeWidth="2" />}

        {/* Data Points: Data 3 */}
        {scaledData3 && scaledData3.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r="4" fill="pink" />
        ))}

        {/* Line Chart: Data 4 */}
        {data4 && data4.length > 1 && <Polyline points={points4} fill="none" stroke="cyan" strokeWidth="2" />}

        {/* Data Points: Data 4 */}
        {scaledData4 && scaledData4.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r="4" fill="magenta" />
        ))}

        {/* Line Chart: Data 5 */}
        {data5 && data5.length > 1 && <Polyline points={points5} fill="none" stroke="brown" strokeWidth="2" />}

        {/* Data Points: Data 5 */}
        {scaledData5 && scaledData5.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r="4" fill="yellow" />
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