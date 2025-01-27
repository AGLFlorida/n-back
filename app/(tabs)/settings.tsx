import { useState, useEffect, useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Text,
  Switch,
} from "react-native";

import Button from "@/components/Button";
import security from "@/util/security";
import { getGlobalStyles } from "@/styles/globalStyles";
import { useTheme } from "@/contexts/ThemeContext"
import { showCustomAlert } from "@/util/alert";


const MAXN = 9;
const MINN = 2;

type N = number | undefined

export default function Settings() {
  const styles = getGlobalStyles();
  const { toggleTheme, theme } = useTheme();

  const [defaultN, setDefaultN] = useState<N>(2);
  const [dualMode, toggleDualMode] = useState<boolean>(false);
  const [darkMode, toggleDarkMode] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const originalN = useRef<number>();
  const originalDual = useRef<boolean>();
  const originalDark = useRef<boolean>();

  const handleTapN = () => {
    setDefaultN((prev) => ((prev || MINN) < MAXN ? (prev || MINN) + 1 : MINN)); 
  };

  const handleLongPressN = () => {
    setDefaultN(MINN);
  };

  const fetchSettings = async () => {
    await Promise.all([
      security.get("defaultN"),
      security.get("dualMode"),
      security.get("darkMode")
    ]).then(([N, T, D]) => {
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
    }).catch(e => e
    );
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSetDefaultN = (n: string) => {
    const local = JSON.parse(n || "0");
    if (local > MAXN || local < MINN) {
      setError(`Please choose an N value from ${MINN} to ${MAXN}.`);
      setDefaultN(undefined);
    } else {
      setDefaultN(local);
      setError("");
    }
  }

  const handleSaved = async () => {
    if (error) {
      alert("Please correct all errors before saving.");
      return;
    }

    await Promise.all([
      security.set("defaultN", defaultN),
      security.set("dualMode", dualMode),
      security.set("darkMode", darkMode),
    ]).then(([x, y, z]) => {
      if (x === true && y === true && z === true) showCustomAlert("Success!", "Settings saved.");
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
              <Button label={JSON.stringify(defaultN)} onPress={handleTapN} onLongPress={handleLongPressN} />
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
            <Button label="Save" onPress={() => handleSaved()} />
          </View>
          {error && (
            <View style={[styles.row, { margin: 5 }]}>
              <Text style={[styles.settingsCell, { color: 'red' }]}>{error}</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
