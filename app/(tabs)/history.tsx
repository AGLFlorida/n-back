import { useCallback, useRef, useState, useEffect } from 'react';
import { useFocusEffect } from "expo-router";
import { View, Text } from "react-native";

import { getGlobalStyles } from "@/styles/globalStyles";
import { useTheme } from "@/contexts/ThemeContext";

import { ScoreCard, ScoresType } from '@/util/ScoreCard';
import { scoreKey } from '@/util/engine';

import security from "@/util/security";

import Chart, { DataPointType } from '@/components/Chart';
import log from '@/util/logger';

const newCard = new ScoreCard({});


export default function History() {
  const styles = getGlobalStyles();
  const { theme } = useTheme();

  const [lineData, setLineData] = useState<DataPointType[]>([]);
  const [lineData2, setLineData2] = useState<DataPointType[]>([]);
  const [playHistory, setPlayHistory] = useState<ScoresType>();
  // const [showChart, setShowChart] = useState<boolean>(false);

  const showChart = useRef<boolean>(false);
  const setShowChart = (p: boolean) => showChart.current = p;

  const dataLabels = useRef<string[]>([]);


  useFocusEffect(
    useCallback(() => {
      const loadRecords = async () => {
        const key = scoreKey();
        try {
          let rec = await security.get("records");
          setPlayHistory(rec as ScoresType);
        } catch (e) {
          log.error("Error retrieving past scores.", e);
        }
      }

      loadRecords();
      setShowChart(true);

      return () => {
        setShowChart(false);
      }
    }, [])
  );

  useEffect(() => {
    if (playHistory) {
      const labels = Object.keys(playHistory);
      const dataSet1: DataPointType[] = [];
      const dataSet2: DataPointType[] = [];

      for (const [key, value] of Object.entries(playHistory)) {
        const idx = labels.indexOf(key);

        const data1: DataPointType = {
          x: idx,
          y: value[0]
        }

        const data2: DataPointType = {
          x: idx,
          y: value[1]
        }

        dataSet1.push(data1);
        dataSet2.push(data2);
      }

      setLineData(dataSet1);
      setLineData2(dataSet2);
      dataLabels.current = labels;
    }



  }, [playHistory])

  return (
    <View style={styles.container}>
      {showChart.current &&
        <View>
          <Chart data={lineData} xLabels={dataLabels.current} />
        </View>
      }
      <View style={{ margin: 10 }}>
        <Text style={styles.text}>Highscores: </Text>
        <Text style={styles.text}>Single: 6</Text>
        <Text style={styles.text}>Dual: 3</Text>
      </View>
    </View>
  );
};