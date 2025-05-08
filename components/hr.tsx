import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  hr: {
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 12,
    marginVertical: 8,
  },
});

export const Hr = () => <View style={styles.hr} />;

