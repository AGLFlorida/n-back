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

  // Single Mode
  const [lineData, setLineData] = useState<DataPointType[]>([]);
  const [lineData2, setLineData2] = useState<DataPointType[]>([]);
  const [lineData3, setLineData3] = useState<DataPointType[]>([]);

  // Dual Mode
  const [lineData4, setLineData4] = useState<DataPointType[]>([]);
  const [lineData5, setLineData5] = useState<DataPointType[]>([]);
  const [lineData6, setLineData6] = useState<DataPointType[]>([]);

  // Silent Mode
  const [lineData7, setLineData7] = useState<DataPointType[]>([]);
  const [lineData8, setLineData8] = useState<DataPointType[]>([]);
  const [lineData9, setLineData9] = useState<DataPointType[]>([]);

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

      const dataSet4: DataPointType[] = [];
      const dataSet5: DataPointType[] = [];
      const dataSet6: DataPointType[] = [];

      const dataSet7: DataPointType[] = [];
      const dataSet8: DataPointType[] = [];
      const dataSet9: DataPointType[] = [];

      for (const [key, value] of Object.entries(playHistory)) {
        const idx = labels.indexOf(key);
        const yValue1 = value.SingleN.score;
        const yValue2 = value.SingleN.errorRate;
        const yValue3 = value.SingleN.n;

        const yValue4 = value.DualN?.score || 0;
        const yValue5 = value.DualN?.errorRate || 0;
        const yValue6 = value.DualN?.n || 0;

        const yValue7 = value.SilentDualN?.score || 0;
        const yValue8 = value.SilentDualN?.errorRate || 0;
        const yValue9 = value.SilentDualN?.n || 0;

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

        const data4: DataPointType = {
          x: idx,
          y: yValue4
        }

        const data5: DataPointType = {
          x: idx,
          y: yValue5
        }

        const data6: DataPointType = {
          x: idx,
          y: yValue6
        }

        const data7: DataPointType = {
          x: idx,
          y: yValue7
        }

        const data8: DataPointType = {
          x: idx,
          y: yValue8
        }

        const data9: DataPointType = {
          x: idx,
          y: yValue9
        }

        dataSet1.push(data1);
        dataSet2.push(data2);
        dataSet3.push(data3);

        dataSet4.push(data4);
        dataSet5.push(data5);
        dataSet6.push(data6);

        dataSet7.push(data7);
        dataSet8.push(data8);
        dataSet9.push(data9);
      }

      setLineData(dataSet1);
      setLineData2(dataSet2);
      setLineData3(dataSet3);

      setLineData4(dataSet4);
      setLineData5(dataSet5);
      setLineData6(dataSet6);

      setLineData7(dataSet7);
      setLineData8(dataSet8);
      setLineData9(dataSet9);

      dataLabels.current = labels;
    }



  }, [playHistory])

  return (
    <ScrollView style={styles.container}>
      {showChart.current &&
        <>
          <View>
            <Text style={[styles.h1, { margin: 10 }]}>Single</Text>
            <Chart data={lineData} data2={lineData2} data3={lineData3} xLabels={dataLabels.current} />
          </View>
          <View>
            <Text style={[styles.h1, { margin: 10 }]}>Dual</Text>
            <Chart data={lineData4} data2={lineData5} data3={lineData6} xLabels={dataLabels.current} />
          </View>
          <View>
            <Text style={[styles.h1, { margin: 10 }]}>Silent</Text>
            <Chart data={lineData7} data2={lineData8} data3={lineData9} xLabels={dataLabels.current} />
          </View>
        </>
      }
    </ScrollView>
  );
}