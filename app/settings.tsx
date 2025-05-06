import React, { useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Text,
  Switch,
  Pressable
} from "react-native";

// TODO | FIXME -- toggling system display does not update settings / theme.

import DebugModal from "@/components/DebugModal";

import { useFocusEffect, useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';
import * as Updates from 'expo-updates';

import Button from "@/components/Button";

import { darkModeDefault, useSettingsStore } from "@/store/useSettingsStore";
import { resetHistoryStore, useHistoryStore } from "@/store/useHistoryStore";

import { useGlobalStyles } from "@/styles/globalStyles";
import { useTheme } from "@/contexts/ThemeContext"
import { showCustomAlert } from "@/util/alert";

import { MAXN, MINN } from "@/util/engine";

import log from "@/util/logger";
import i18n from '@/util/i18n';

type N = number | undefined

export default function Settings() {
  const styles = useGlobalStyles();
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const {
    setN, N,
    saveDarkMode, //darkMode: storedDarkMode, 
    saveDualMode, //dualMode: storedDualMode, 
    saveSilentMode, //silentMode: storedSilentMode, 
    setTermsAccepted
  } = useSettingsStore();

  const storedDarkMode = useSettingsStore(state => state.darkMode);
  const storedDualMode = useSettingsStore(state => state.dualMode);
  const storedSilentMode = useSettingsStore(state => state.silentMode);

  const [showDebug, setShowDebug] = useState(false);

  const [defaultN, setDefaultN] = useState<N>(N);
  const [dualMode, toggleDualMode] = useState<boolean>(storedDualMode);
  const [darkMode, toggleDarkMode] = useState<boolean>(storedDarkMode);
  const [silentMode, toggleSilentMode] = useState<boolean>(storedSilentMode);

  const [error,] = useState<string>();

  const handleTapN = () => {
    setDefaultN((prev) => ((prev || MINN) < MAXN ? (prev || MINN) + 1 : MINN));
  };

  const handleLongPressN = () => {
    setDefaultN(MINN);
  };

  const clearSettings = () => {
    const clear = () => {
      console.log("clear!!");
      setN();
      saveDualMode(false);
      saveDarkMode(darkModeDefault);
      saveSilentMode(false);
      setTermsAccepted(false);
      // setRecords({});

      setDefaultN(2);
      toggleDualMode(false);
      toggleDarkMode(darkModeDefault);
      toggleSilentMode(false);

      resetHistoryStore();

      router.push('/terms');
    }

    showCustomAlert(t('settings.resetData'), t('settings.resetDataMessage'), clear, true, { ok: t('ok'), cancel: t('cancel') });
  }

  const handleRestart = async () => {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      log.error('Failed to reload app (Settings): ', error);
    }
  };

  const toggleSpanish = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
    if (!__DEV__) handleRestart();
  };

  useEffect(() => {
    saveDarkMode(darkMode)
  }, [darkMode]);

  useEffect(() => {
    saveDualMode(dualMode)
  }, [dualMode]);

  useEffect(() => {
    saveSilentMode(silentMode)
  }, [silentMode]);

  useEffect(() => {
    setN(defaultN);
  }, [defaultN]);

  useEffect(() => {
    console.log(dualMode, darkMode, silentMode, defaultN);
  })

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.grid, { alignItems: "flex-start" }]}>
          <View style={[styles.row, { margin: 5 }]}>
            <View style={styles.settingsCell}>
              <Text style={styles.h1}>{t('settings.title')}</Text>
            </View>
          </View>
          <View style={[styles.row, { margin: 5 }]}>
            <View style={styles.settingsCell}>
              <Button label={JSON.stringify(defaultN)} style={{ width: 50, textAlign: "center" }} onPress={handleTapN} onLongPress={handleLongPressN} />
            </View>
            <View style={styles.settingsCell}>
              <Text style={styles.label}>{t('settings.defaultN')}</Text>
            </View>
          </View>

          <View style={[styles.row, { margin: 5 }]}>
            <View style={styles.settingsCell}>
              <Switch
                trackColor={theme.toggle.trackColor}
                thumbColor={theme.toggle.thumbColor(dualMode)}
                onValueChange={toggleDualMode}
                value={dualMode}
              />
            </View>
            <View style={styles.settingsCell}>
              <Text style={styles.label}>{t('settings.dualMode')}</Text>
            </View>
          </View>

          <View style={[styles.row, { margin: 5 }]}>
            <View style={styles.settingsCell}>
              <Switch
                trackColor={theme.toggle.trackColor}
                thumbColor={theme.toggle.thumbColor(silentMode)}
                onValueChange={toggleSilentMode}
                value={silentMode}
              />
            </View>
            <View style={styles.settingsCell}>
              <Text style={styles.label}>{t('settings.silentMode')}</Text>
            </View>
          </View>

          <View style={[styles.row, { margin: 5 }]}>
            <View style={styles.settingsCell}>
              <Switch
                trackColor={theme.toggle.trackColor}
                thumbColor={theme.toggle.thumbColor(darkMode)}
                onValueChange={toggleDarkMode}
                value={darkMode}
              />
            </View>
            <View style={styles.settingsCell}>
              <Text style={styles.label}>{t('settings.darkMode')}</Text>
            </View>
          </View>
          <View style={[styles.row, { margin: 5 }]}>
            <View style={styles.settingsCell}>
              <Text style={styles.h1}>{t('settings.dangerZone')}</Text>
            </View>
          </View>
          <View style={[styles.row, { margin: 5 }]}>
            <Pressable style={{ marginTop: 'auto', alignSelf: 'flex-end', marginBottom: 20, marginRight: 10 }} onPress={clearSettings}>
              <Text style={{ color: theme.screenOptions.tabBarActiveTintColor, fontSize: 16 }}>{t('settings.resetData')}</Text>
            </Pressable>
          </View>
          <View style={[styles.row, { margin: 10 }]}>
            <Pressable
              style={{ marginTop: 10 }}
              onPress={toggleSpanish}
            >
              <Text style={styles.label}>
                {i18n.language === 'es' ? 'English' : 'Español'}
              </Text>
            </Pressable>
          </View>
          {error && (
            <View style={[styles.row, { margin: 10 }]}>
              <Text style={[styles.settingsCell, { color: 'red' }]}>{error}</Text>
            </View>
          )}
        </View>
        <Pressable style={{ alignSelf: 'flex-end', marginTop: 20, marginRight: 10 }} onPress={() => router.push('/learn')}>
          <Text style={{ color: theme.screenOptions.tabBarActiveTintColor, fontSize: 16 }}>{t('settings.learnMore')}</Text>
        </Pressable>
        <Pressable style={{ alignSelf: 'flex-end', marginTop: 20, marginRight: 10 }} onPress={() => setShowDebug(true)}>
          <Text style={{ color: theme.screenOptions.tabBarActiveTintColor, fontSize: 16 }}>{t('settings.debug')}</Text>
        </Pressable>
        <DebugModal show={showDebug} onClose={() => setShowDebug(false)} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}