import { useCallback, useRef, useState, useEffect } from 'react';
import { useFocusEffect } from "expo-router";
import { ScrollView, View, Text, Pressable } from "react-native";
import { useTranslation } from 'react-i18next';

import { calculateHighScore } from '@/util/engine/helpers';

import ScoreHelpModal from "@/components/ScoreHelpModal";

import { useGlobalStyles } from "@/styles/globalStyles";

import type { ScoresType } from '@/util/engine/ScoreCard';

import AchievementBar from '@/components/AchievementBar';

import { useTheme } from "@/contexts/ThemeContext"

import { Hr } from '@/components/hr';

import Chart, { DataPointType } from '@/components/Chart';

import { useHistoryStore } from "@/store/useHistoryStore";
import { GameModeEnum } from '@/util/engine/enums';

export default function History() {
  const styles = useGlobalStyles();
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Single Mode
  const [lineData, setLineData] = useState<DataPointType[]>([]);

  // Dual Mode
  const [lineData4, setLineData4] = useState<DataPointType[]>([]);

  // Silent Mode
  const [lineData7, setLineData7] = useState<DataPointType[]>([]);

  const records: ScoresType = useHistoryStore(state => state.records);

  const [showChart, setShowChart] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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
    console.log("records: ", records)
  }, [])

  useEffect(() => {
    // if (playHistory) {
    const labels = Object.keys(records);
    const dataSet1: DataPointType[] = [];
    const dataSet4: DataPointType[] = [];
    const dataSet7: DataPointType[] = [];


    for (const [key, value] of Object.entries(records)) {
      const idx = labels.indexOf(key);
      const yValue1 = calculateHighScore(GameModeEnum.SingleN, value.SingleN);
      let yValue4 = 0;
      if (value.DualN) yValue4 = calculateHighScore(GameModeEnum.DualN, value.DualN);
      
      let yValue7 = 0;
      if (value.SilentDualN) yValue7 = calculateHighScore(GameModeEnum.SilentDualN, value.SilentDualN);

      const data1: DataPointType = {
        x: idx,
        y: yValue1
      }

      const data4: DataPointType = {
        x: idx,
        y: yValue4
      }

      const data7: DataPointType = {
        x: idx,
        y: yValue7
      }
      
      dataSet1.push(data1);
      dataSet4.push(data4);
      dataSet7.push(data7);
    }

    console.log("data1:", dataSet1)

    setLineData(dataSet1);
    setLineData4(dataSet4);
    setLineData7(dataSet7);

    console.log("lineData1: ", lineData)

    dataLabels.current = labels;

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
            <Chart data={lineData} xLabels={dataLabels.current} />
          </View>
          <Hr />
          <View>
            <Text style={[styles.h2, { margin: 10 }]}>{t('history.dual')}</Text>
            <Chart data={lineData4} xLabels={dataLabels.current} />
          </View>
          <Hr />
          <View>
            <Text style={[styles.h2, { margin: 10 }]}>{t('history.silent')}</Text>
            <Chart data={lineData7} xLabels={dataLabels.current} />
          </View>
        </>
      }
      <Pressable style={{ alignSelf: 'flex-end', margin: 20 }} onPress={() => setShowHelp(true)}>
        <Text style={{ color: theme.screenOptions.tabBarActiveTintColor, fontSize: 16 }}>{t('settings.learnMore')}</Text>
      </Pressable>
      <ScoreHelpModal show={showHelp} onClose={() => setShowHelp(false)} />
    </ScrollView>
  );
}