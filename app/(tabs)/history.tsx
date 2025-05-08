import { useCallback, useRef, useState, useEffect } from 'react';
import { useFocusEffect } from "expo-router";
import { ScrollView, View, Text } from "react-native";
import { useTranslation } from 'react-i18next';

import { useGlobalStyles } from "@/styles/globalStyles";

import type { ScoresType } from '@/util/engine/ScoreCard';

import AchievementBar from '@/components/AchievementBar';

import { Hr } from '@/components/hr';

// TODO | FIXME -- still need to wire up the logic for 'streak'

// TODO | ADDME -- need to add import and export of scores / history

import Chart, { DataPointType } from '@/components/Chart';

import { useHistoryStore } from "@/store/useHistoryStore";

export default function History() {
  const styles = useGlobalStyles();
  const { t } = useTranslation();

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

  const [lineData10, setLineData10] = useState<DataPointType[]>([]);
  const [lineData11, setLineData11] = useState<DataPointType[]>([]);
  const [lineData12, setLineData12] = useState<DataPointType[]>([]);
  const [lineData13, setLineData13] = useState<DataPointType[]>([]);

  const records: ScoresType = useHistoryStore(state => state.records);

  // const [playHistory, setPlayHistory] = useState<ScoresType>();

  const [showChart, setShowChart] = useState(false);

  const dataLabels = useRef<string[]>([]);


  useFocusEffect(
    useCallback(() => {
      setShowChart(true);

      return () => {
        setShowChart(false);
      }
    }, [])
  );

  useEffect(() => {
    // if (playHistory) {
    const labels = Object.keys(records);
    const dataSet1: DataPointType[] = [];
    const dataSet2: DataPointType[] = [];
    const dataSet3: DataPointType[] = [];

    const dataSet4: DataPointType[] = [];
    const dataSet5: DataPointType[] = [];
    const dataSet6: DataPointType[] = [];

    const dataSet7: DataPointType[] = [];
    const dataSet8: DataPointType[] = [];
    const dataSet9: DataPointType[] = [];

    const dataSet10: DataPointType[] = [];
    const dataSet11: DataPointType[] = [];
    const dataSet12: DataPointType[] = [];
    const dataSet13: DataPointType[] = [];

    for (const [key, value] of Object.entries(records)) {
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

      let yValue10 = 0;
      if (value.DualN && value.DualN.score2) {
        yValue10 = value.DualN.score2;
      }
      let yValue11 = 0;
      if (value.DualN && value.DualN.errorRate2) {
        yValue11 = value.DualN.errorRate2;
      }

      let yValue12 = 0;
      if (value.DualN && value.SilentDualN.score2) {
        yValue12 = value.SilentDualN.score2;
      }

      let yValue13 = 0;
      if (value.SilentDualN && value.SilentDualN.errorRate2) {
        yValue13 = value.SilentDualN.errorRate2;
      }

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

      // if (yValue10) {
      const data10: DataPointType = {
        x: idx,
        y: yValue10
      }
      dataSet10.push(data10);
      // }


      // if (yValue11) {
      const data11: DataPointType = {
        x: idx,
        y: yValue11
      }
      dataSet11.push(data11);
      // }

      // if (yValue12) {
      const data12: DataPointType = {
        x: idx,
        y: yValue12
      }
      dataSet12.push(data12);
      // }

      // if (yValue13) {
      const data13: DataPointType = {
        x: idx,
        y: yValue13
      }
      dataSet13.push(data13);
      // }

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

    setLineData10(dataSet10);
    setLineData11(dataSet11);
    setLineData12(dataSet12);
    setLineData13(dataSet13);

    dataLabels.current = labels;
    // }
  }, [records]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.h1}>{t('titles.awards')}</Text>
      <AchievementBar />
      {showChart &&
        <>
          <Text style={styles.h1}>{t('titles.charts')}</Text>
          <View>
            <Text style={[styles.h2, { margin: 10 }]}>{t('history.single')}</Text>
            <Chart data={lineData} data2={lineData2} data3={lineData3} xLabels={dataLabels.current} />
          </View>
          <Hr />
          <View>
            <Text style={[styles.h2, { margin: 10 }]}>{t('history.dual')}</Text>
            <Chart data={lineData4} data2={lineData5} data3={lineData6} data4={lineData10} data5={lineData11} xLabels={dataLabels.current} />
          </View>
          <Hr />
          <View>
            <Text style={[styles.h2, { margin: 10 }]}>{t('history.silent')}</Text>
            <Chart data={lineData7} data2={lineData8} data3={lineData9} data4={lineData12} data5={lineData13} xLabels={dataLabels.current} />
          </View>
        </>
      }
      <View>
        <Text style={{color: '#fff'}}>{JSON.stringify(records)}</Text>
      </View> 
    </ScrollView>
  );
}