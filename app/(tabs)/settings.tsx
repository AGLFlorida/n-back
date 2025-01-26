import { View, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, Text } from "react-native";

import Button from "@/components/Button";
import Toggle from "@/components/Toggle";
import NumberInput from "@/components/NumberInput";

export default function Settings() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.grid}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={{color: '#fff'}}>Default N:</Text>
            </View>
            <View style={styles.cell}>
              <NumberInput n={42} />
            </View>
          </View>
          <View style={styles.row}>
            <Toggle />
          </View>
          <View style={styles.row}>
            <Button label="Save" onPress={() => alert("saved")} />
          </View>
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
});