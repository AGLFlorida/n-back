import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from "react-native";

import Button from "@/components/Button";

export default function Settings() {
  const [value, setValue] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.grid}>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              keyboardType="numeric" // Show numeric keypad
              value={value}
              onChangeText={(text) => setValue(text)}
              placeholder="Enter a number"
              placeholderTextColor="#bbb"
            />
            <Text style={styles.label}>You entered: {value}</Text>
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
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
    color: "#fff",
  },
  label: {
    color: "#fff",
  },
  grid: {
    alignItems: "center",
    width: "100%",
    backgroundColor: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  }
});