import { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Text,
  TextInput,
  Switch,
  Alert
} from "react-native";

import Button from "@/components/Button";
import Security from "@/util/security";

type Settings = {
  defaultN: number;
  toggleValue: boolean;
}

const MAXN = 10;
const MINN = 2;

const showCustomAlert = (title: string, message: string) => {
  Alert.alert(
    title,
    message, 
    [
      { text: "OK", onPress: () => {} },
    ],
    { cancelable: true } // Allows dismissing the alert by tapping outside
  );
};

export default function Settings() {
  const [defaultN, setDefaultN] = useState<number | undefined>(2);
  const [toggleValue, toggleSwitch] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const originalN = useRef<number>();
  const originalToggle = useRef<boolean>();

  const fetchSettings = async () => {
    await Promise.all([
      Security.get("defaultN"),
      Security.get("toggleValue")
    ]).then(([N, T]) => {
      if (N) {
        setDefaultN(N as number);
        originalN.current = defaultN as number;
      }
      if (T) {
        toggleSwitch(T as boolean);
        originalToggle.current = toggleValue;
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
      Security.set("defaultN", defaultN),
      Security.set("toggleValue", toggleValue)
    ]).then(([x, y]) => {
      if (x === true && y === true) showCustomAlert("Success!", "Settings saved.");
    }).catch(e => e
    ).finally(() => {});
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.grid}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={{ color: '#fff' }}>Default N:</Text>
            </View>
            <View style={styles.cell}>
              <TextInput
                style={styles.numberInput}
                keyboardType="numeric"
                value={JSON.stringify(defaultN)}
                onChangeText={(n) => handleSetDefaultN(n)}
                placeholder=""
                placeholderTextColor="#fff"
              />
            </View>
          </View>
          <View style={styles.row}>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={toggleValue ? '#f5dd4b' : '#f4f3f4'}
              onValueChange={toggleSwitch}
              value={toggleValue}
            />
          </View>
          <View style={styles.row}>
            <Button label="Save" onPress={() => handleSaved()} />
          </View>
          { error && (
            <View style={styles.row}>
              <Text style={[styles.cell, { color: 'red' }]}>{error}</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    color: "#fff",
  },
  grid: {
    alignItems: "flex-start",
    width: "100%",
    backgroundColor: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 5,
  },
  cell: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 3,
    justifyContent: 'center',
  },
  numberInput: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
    color: "#fff",
  },
});