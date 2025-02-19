import { useCallback, useRef, useState, useEffect } from 'react';
import { useFocusEffect } from "expo-router";
import { ScrollView, View, Text } from "react-native";

import { useGlobalStyles } from "@/styles/globalStyles";

import { ScoresType } from '@/util/ScoreCard';

import security from "@/util/security";

import Chart, { DataPointType } from '@/components/Chart';
import log from '@/util/logger';


export default function History() {
  const styles = useGlobalStyles();

  const [lineData, setLineData] = useState<DataPointType[]>([]);
  const [lineData2, setLineData2] = useState<DataPointType[]>([]);
  const [lineData3, setLineData3] = useState<DataPointType[]>([]);
  const [playHistory, setPlayHistory] = useState<ScoresType>();

  const showChart = useRef<boolean>(false);
  const setShowChart = (p: boolean) => showChart.current = p;

  const dataLabels = useRef<string[]>([]);


  useFocusEffect(
    useCallback(() => {
      const loadRecords = async () => {
        try {
          const rec = await security.get("records");
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
      const dataSet3: DataPointType[] = [];

      for (const [key, value] of Object.entries(playHistory)) {
        const idx = labels.indexOf(key);
        const yValue1 = value.SingleN.score;
        const yValue2 = value.SingleN.errorRate;
        const yValue3 = value.SingleN.n;

        const data1: DataPointType = {
          x: idx,
          y: yValue1
        }

        const data2: DataPointType = {
          x: idx,
          y: yValue2
        }

        const data3: DataPointType = {  
          x: idx,
          y: yValue3
        }

        dataSet1.push(data1);
        dataSet2.push(data2);
        dataSet3.push(data3);
      }

      setLineData(dataSet1);
      setLineData2(dataSet2);
      setLineData3(dataSet3);
      dataLabels.current = labels;
    }



  }, [playHistory])

  return (
    <ScrollView style={styles.container}>
      {showChart.current &&
        <View>
          <Chart data={lineData} data2={lineData2} data3={lineData3} xLabels={dataLabels.current} />
        </View>
      }
      <View style={{ margin: 10 }}>
        <Text style={styles.text}>Highscores: </Text>
        <Text style={styles.text}>Single: 6</Text>
        <Text style={styles.text}>Dual: 3</Text>
      </View>
    </ScrollView>
  );
}