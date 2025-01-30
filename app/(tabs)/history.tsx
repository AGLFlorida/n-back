import { View, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts"

import { getGlobalStyles } from "@/styles/globalStyles";
import { useTheme } from "@/contexts/ThemeContext";

export default function History() {
  const styles = getGlobalStyles();
  const { theme } = useTheme();

  // single
  const lineData = [
    { value: 0, dataPointText: '0' },
    { value: 10, dataPointText: '10' },
    { value: 8, dataPointText: '8' },
    { value: 58, dataPointText: '58' },
    { value: 56, dataPointText: '56' },
    { value: 78, dataPointText: '78' },
    { value: 74, dataPointText: '74' },
    { value: 98, dataPointText: '98' },
  ];

  // dual
  const lineData2 = [
    { value: 0, dataPointText: '0' },
    { value: 20, dataPointText: '20' },
    { value: 18, dataPointText: '18' },
    { value: 40, dataPointText: '40' },
    { value: 36, dataPointText: '36' },
    { value: 60, dataPointText: '60' },
    { value: 54, dataPointText: '54' },
    { value: 85, dataPointText: '85' },
  ];

  const xAxisLabelTexts: string[] = [
    "one", "two", "three", "four", "five", "six", "seven", "eight",
  ]

  return (
    <View style={styles.container}>
      <View>
        <LineChart
          data={lineData}
          data2={lineData2}
          height={250}
          showVerticalLines
          spacing={44}
          initialSpacing={0}
          color1="skyblue"
          color2="orange"
          textColor1={theme.textColor}
          textColor2={theme.textColor}
          xAxisLabelTextStyle={{ color: theme.textColor, marginLeft: 8 }}
          yAxisTextStyle={{ color: theme.textColor }}
          yAxisColor={theme.textColor}
          xAxisColor={theme.textColor}
          dataPointsHeight={8}
          dataPointsWidth={6}
          dataPointsColor1="blue"
          dataPointsColor2="red"
          textShiftY={-2}
          textShiftX={-5}
          textFontSize={13}
          rotateLabel
          xAxisLabelTexts={xAxisLabelTexts}
        />
      </View>
      <View style={{margin: 10}}>
        <Text style={styles.text}>Highscores: </Text>
        <Text style={styles.text}>Single: 6</Text>
        <Text style={styles.text}>Dual: 3</Text>
      </View>
    </View>
  );
};