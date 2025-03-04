import React, { useState, useEffect, useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Text,
  Switch,
  Pressable,
  Appearance
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';

import Button from "@/components/Button";
import security from "@/util/security";
import { useGlobalStyles } from "@/styles/globalStyles";
import { useTheme } from "@/contexts/ThemeContext"
import { showCustomAlert } from "@/util/alert";
import { MAXN, MINN, getStartLevel, GameModeEnum } from "@/util/engine";
import log from "@/util/logger";
import i18n from '@/util/i18n';

type N = number | undefined

// TODO there is a bug where resetting data doesn't reset dark mode.

const systemTheme = Appearance.getColorScheme();

export default function Settings() {
  const styles = useGlobalStyles();
  const { toggleTheme, theme } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const [defaultN, setDefaultN] = useState<N>(2);
  const [dualMode, toggleDualMode] = useState<boolean>(false);
  const [darkMode, toggleDarkMode] = useState<boolean>(false);
  const [silentMode, toggleSilentMode] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const originalN = useRef<number>();
  const originalDual = useRef<boolean>();
  const originalDark = useRef<boolean>();
  const originalSilent = useRef<boolean>();

  const handleTapN = () => {
    setDefaultN((prev) => ((prev || MINN) < MAXN ? (prev || MINN) + 1 : MINN));
  };

  const handleLongPressN = () => {
    setDefaultN(MINN);
  };

  const clearSettings = () => {
    const clear = async () => {
      const isSystemDark = (systemTheme === "dark") ? true : false;
      await security.set("defaultN", 2);
      await security.set("dualMode", false);
      // await security.set("darkMode", isSystemDark);
      await security.set("silentMode", false);
      await security.set("termsAccepted", false);
      await security.set("records", {});
      setDefaultN(2);
      toggleDualMode(false);
      // toggleDarkMode(isSystemDark);
      toggleSilentMode(false);
      router.push('/terms');
    }

    showCustomAlert(t('settings.resetData'), t('settings.resetDataMessage'), clear, true, { ok: t('ok'), cancel: t('cancel') });
  }

  const fetchSettings = async () => {
    await Promise.all([
      security.get("defaultN"),
      security.get("dualMode"),
      security.get("darkMode"),
      security.get("silentMode")
    ]).then(([N, T, D, Shhh]) => {
      if (N) {
        setDefaultN(N as number);
        originalN.current = defaultN as number;
      }
      if (T) {
        toggleDualMode(T as boolean);
        originalDual.current = dualMode;
      }
      if (D) {
        toggleDarkMode(D as boolean);
        originalDark.current = darkMode;
      }
      if (Shhh) {
        toggleSilentMode(Shhh as boolean);
        originalSilent.current = silentMode;
      }
    }).catch(e => e
    );
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaved = async () => {
    if (error) {
      alert(t('settings.errorMessage'));
      return;
    }

    const startingLevel = getStartLevel(defaultN || MINN);

    await Promise.all([
      security.set("defaultN", defaultN || MINN),
      security.set("dualMode", dualMode),
      security.set("darkMode", darkMode),
      security.set("silentMode", silentMode),
      // Save new starting level for all modes
      security.set("gameLevels", {
        [GameModeEnum.SingleN]: startingLevel,
        [GameModeEnum.DualN]: startingLevel,
        [GameModeEnum.SilentDualN]: startingLevel,
      }),
    ]).then(([x, y, z, shh, levels]) => {
      if (x && y && z && shh && levels) {
        showCustomAlert(t('alerts.success'), t('alerts.settingsSaved'), undefined, false, { ok: t('ok'), cancel: t('cancel') });
      }
    }).catch(e => {
      log.error("Error saving settings", e);
    }).finally(() => {
      toggleTheme(darkMode);
    });
  }

  const toggleSpanish = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

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
          <Button label={t('settings.save')} onPress={() => handleSaved()} />
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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback >
  );
}

