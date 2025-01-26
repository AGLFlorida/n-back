import { useState, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';

type Props = {
  n: number;
};

export default function NumberInput({ n }: Props) {
  const [value, setValue] = useState(n.toString());

  return (
    <View>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={value}
        onChangeText={(text) => setValue(text)}
        placeholder=""
        placeholderTextColor="#bbb"
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});
