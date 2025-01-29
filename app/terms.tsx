import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Stack } from 'expo-router';

import { getGlobalStyles } from '@/styles/globalStyles';
import { useTheme } from '@/contexts/ThemeContext';

export default function Terms() {
  const styles = getGlobalStyles();
  const { theme } = useTheme();

  return (
    <ScrollView style={{ backgroundColor: theme.backgroundColor }}>
      <Stack.Screen options={{
        title: "Terms & Conditions",
        headerStyle: {
          backgroundColor: theme.backgroundColor
        },
        headerTintColor: theme.textColor,
      }} />
      <View style={[styles.container, { alignItems: 'center', paddingHorizontal: 30, paddingVertical: 10, }]}>
        <Text style={styles.heading}>Terms of Use & Privacy Disclaimer</Text>
        <View style={{ alignSelf: 'flex-start', paddingBottom: 5 }}>
          <Text style={{ color: theme.textColor }}>Last Updated: [ 29-January-2025 ]</Text>
        </View>
        <View style={{ alignSelf: 'flex-start', paddingBottom: 10 }}>
          <Text style={{ color: theme.textColor }}>By downloading, installing, and/or using this app (“App”), you agree to the following terms:</Text>
        </View>

        {/* 1 */}
        <View style={[styles.listItem, { marginBottom: 3 }]}>
          <Text style={styles.number}>1.</Text>
          <Text style={[styles.text, { fontWeight: '700' }]}>No Guarantees or Warranties</Text>
        </View>
        <View style={{ alignSelf: 'flex-start', paddingBottom: 10 }}>
          <Text style={{ color: theme.textColor }}>This App is provided “as is” without any warranties, express or implied. The developer makes no guarantees about the availability, accuracy, or functionality of the App.</Text>
        </View>

        {/* 2 */}
        <View style={[styles.listItem, { marginBottom: 3 }]}>
          <Text style={styles.number}>2.</Text>
          <Text style={[styles.text, { fontWeight: '700' }]}>Use at Your Own Risk</Text>
        </View>
        <View style={{ alignSelf: 'flex-start', paddingBottom: 10 }}>
          <Text style={{ color: theme.textColor }}>You assume all risk when using the App. The developer is not responsible for any damages, data loss, or other issues that may arise from using the App.</Text>
        </View>

        {/* 3 */}
        <View style={[styles.listItem, { marginBottom: 3 }]}>
          <Text style={styles.number}>3.</Text>
          <Text style={[styles.text, { fontWeight: '700' }]}>No Liability</Text>
        </View>
        <View style={{ alignSelf: 'flex-start', paddingBottom: 10 }}>
          <Text style={{ color: theme.textColor }}>To the fullest extent permitted by law, the developer is not liable for any direct, indirect, incidental, or consequential damages related to your use of the App.</Text>
        </View>

        {/* 4 */}
        <View style={[styles.listItem, { marginBottom: 3 }]}>
          <Text style={styles.number}>4.</Text>
          <Text style={[styles.text, { fontWeight: '700' }]}>Privacy Disclaimer</Text>
        </View>
        <View style={{ alignSelf: 'flex-start', paddingBottom: 10 }}>
          <Text style={{ color: theme.textColor }}>This App does not collect, store, or share any personal data. All settings and app-related data are stored locally on your device and are not transmitted to the developer or any third parties.</Text>
        </View>

        {/* 5 */}
        <View style={[styles.listItem, { marginBottom: 3 }]}>
          <Text style={styles.number}>5.</Text>
          <Text style={[styles.text, { fontWeight: '700' }]}>Updates and Termination</Text>
        </View>
        <View style={{ alignSelf: 'flex-start', paddingBottom: 10 }}>
          <Text style={{ color: theme.textColor }}>The developer may update, modify, or discontinue the App at any time without notice.</Text>
        </View>

        {/* 6 */}
        <View style={[styles.listItem, { marginBottom: 3 }]}>
          <Text style={styles.number}>6.</Text>
          <Text style={[styles.text, { fontWeight: '700' }]}>Changes to Terms</Text>
        </View>
        <View style={{ alignSelf: 'flex-start', paddingBottom: 10 }}>
          <Text style={{ color: theme.textColor }}>These terms may be updated from time to time. Your continued use of the App means you accept any changes.</Text>
        </View>

        {/* 7 */}
        <View style={[styles.listItem, { marginBottom: 3 }]}>
          <Text style={styles.number}>7.</Text>
          <Text style={[styles.text, { fontWeight: '700' }]}>Governing Law</Text>
        </View>
        <View style={{ alignSelf: 'flex-start', paddingBottom: 10 }}>
          <Text style={{ color: theme.textColor }}>These terms are governed by the laws of the state of Florida, USA.</Text>
        </View>
      </View>
      <View style={{ alignSelf: 'flex-start', padding: 10, paddingBottom: 30 }}>
        <Text style={{ color: theme.textColor }}>If you do not agree to these terms, uninstall and/or do not use the App.</Text>
      </View>
    </ScrollView>
  )
}


/*
Last Updated: [Date]

By downloading, installing, or using this app (“App”), you agree to the following terms:

1. No Guarantees or Warranties
This App is provided “as is” without any warranties, express or implied. The developer makes no guarantees about the availability, accuracy, or functionality of the App.

2. Use at Your Own Risk
You assume all risk when using the App. The developer is not responsible for any damages, data loss, or other issues that may arise from using the App.

3. No Liability
To the fullest extent permitted by law, the developer is not liable for any direct, indirect, incidental, or consequential damages related to your use of the App.

4. Privacy Disclaimer
This App does not collect, store, or share any personal data. All settings and app-related data are stored locally on your device and are not transmitted to the developer or any third parties.

5. Updates and Termination
The developer may update, modify, or discontinue the App at any time without notice.

6. Changes to Terms
These terms may be updated from time to time. Your continued use of the App means you accept any changes.

7. Governing Law
These terms are governed by the laws of [Your Jurisdiction].

If you do not agree to these terms, do not download or use the App.

*/