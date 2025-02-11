import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { useGlobalStyles } from '@/styles/globalStyles';
import { useTheme } from '@/contexts/ThemeContext';

export default function Learn() {
  const styles = useGlobalStyles();
  const { theme } = useTheme();

  const router = useRouter();

  return (
    <SafeAreaView style={{ backgroundColor: theme.backgroundColor, flex: 1 }}>
      <ScrollView>
        <Stack.Screen options={{
          title: "Learn More",
          headerStyle: {
            backgroundColor: theme.backgroundColor
          },
          headerTintColor: theme.textColor,
        }} />
        <View style={[styles.container, { alignItems: 'center', marginHorizontal: 30, marginVertical: 10, }]}>
          <Text style={styles.heading}>How the Game Works</Text>

          {/* 1 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>1.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>Dual N-back Mode</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>
              The Dual N-back setting adds a second layer to the game. Instead of only tracking position prompts, you will be tasked with tracking either sound or haptic (vibration) patterns.
              These additional patterns are meant to increase the difficulty of the game. The default setting for the second prompt will be a series of spoken letters:
              C, G, H, K, P, Q, T, or W.
            </Text>
          </View>

          {/* 2 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>2.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>Silent Mode</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>
              Silent mode changes the default &quot;letter&quot; sound to a pattern of vibrations. The standard celebratory sounds remain the same.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
