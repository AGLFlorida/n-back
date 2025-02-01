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

import Button from "@/components/Button";
import security from "@/util/security";
import { getGlobalStyles } from "@/styles/globalStyles";
import { useTheme } from "@/contexts/ThemeContext"
import { showCustomAlert } from "@/util/alert";
import { MAXN, MINN } from "@/util/engine";

type N = number | undefined

const systemTheme = Appearance.getColorScheme();

export default function Settings() {
  const styles = getGlobalStyles();
  const { toggleTheme, theme } = useTheme();
  const router = useRouter();

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

  const clearSettings = async () => {
    const isSystemDark = (systemTheme === "dark") ? true : false;
    await security.set("defaultN", 2);
    await security.set("dualMode", true);
    await security.set("darkMode", isSystemDark);
    await security.set("silentMode", false);
    await security.set("termsAccepted", false);
    await security.set("records", {});
    setDefaultN(2);
    toggleDualMode(true);
    toggleDarkMode(isSystemDark);
    toggleSilentMode(false);

    showCustomAlert("Data Cleared!", "All data has been reset to defaults! Please re-accept terms.");
    router.push('/terms')
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

  useEffect(() => {
    if (silentMode && !dualMode) {
      setError("Silent mode requires Dual N-back to be 'on'.")
    } else {
      setError(undefined);
    }

  }, [silentMode, dualMode])

  const handleSaved = async () => {
    if (error) {
      alert("Please correct all errors before saving.");
      return;
    }

    await Promise.all([
      security.set("defaultN", defaultN),
      security.set("dualMode", dualMode),
      security.set("darkMode", darkMode),
      security.set("silentMode", silentMode),
    ]).then(([x, y, z, shh]) => {
      if (x === true && y === true && z === true && shh === true) showCustomAlert("Success!", "Settings saved.");
    }).catch(e => e
    ).finally(() => {
      toggleTheme(darkMode);
    });
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.grid, { alignItems: "flex-start" }]}>
          <View style={[styles.row, { margin: 5 }]}>
            <View style={styles.settingsCell}>
              <Button label={JSON.stringify(defaultN)} style={{ width: 50, textAlign: "center" }} onPress={handleTapN} onLongPress={handleLongPressN} />
            </View>
            <View style={styles.settingsCell}>
              <Text style={styles.label}>Default N</Text>
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
              <Text style={styles.label}>Dual N-back</Text>
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
              <Text style={styles.label}>Silent Mode (Requires Dual)</Text>
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
              <Text style={styles.label}>Dark Mode (Defaults to system)</Text>
            </View>
          </View>
          <View style={[styles.row, { margin: 5 }]}>
            <Button label="Save" onPress={() => handleSaved()} style={{ width: 60, textAlign: 'center' }} />
          </View>
          {error && (
            <View style={[styles.row, { margin: 10 }]}>
              <Text style={[styles.settingsCell, { color: 'red' }]}>{error}</Text>
            </View>
          )}
        </View>
        <Pressable style={{ marginTop: 'auto', alignSelf: 'flex-end', marginBottom: 20, marginRight: 10 }} onPress={clearSettings}>
          <Text style={{ color: theme.screenOptions.tabBarActiveTintColor, fontSize: 16 }}>Reset Data</Text>
        </Pressable>
        <Pressable style={{ alignSelf: 'flex-end', marginBottom: 20, marginRight: 10 }} onPress={() => router.push('/terms')}>
          <Text style={{ color: theme.screenOptions.tabBarActiveTintColor, fontSize: 16 }}>Terms of Use and Privacy Notices</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
