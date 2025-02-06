import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { useGlobalStyles } from '@/styles/globalStyles';
import { useTheme } from '@/contexts/ThemeContext';
import Button from '@/components/Button';

import security from '@/util/security';

export default function Terms() {
  const styles = useGlobalStyles();
  const { theme } = useTheme();

  const router = useRouter();

  const acceptTerms = async () => {
    await security.set("termsAccepted", true);
    router.push("/");
  }

  return (
    <SafeAreaView style={{ backgroundColor: theme.backgroundColor }}>
      <ScrollView>
        <Stack.Screen options={{
          title: "Terms & Conditions",
          headerStyle: {
            backgroundColor: theme.backgroundColor
          },
          headerTintColor: theme.textColor,
        }} />
        <View style={[styles.container, { alignItems: 'center', marginHorizontal: 30, marginVertical: 10, }]}>
          <Text style={styles.heading}>Terms of Use & Privacy Disclaimer</Text>
          <View style={{ alignSelf: 'flex-start', marginBottom: 5 }}>
            <Text style={{ color: theme.textColor, fontStyle: 'italic' }}>Last Updated: [ 29-January-2025 ]</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>By downloading, installing, and/or using this app (“App”), you agree to the following terms:</Text>
          </View>

          {/* 1 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>1.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>No Guarantees or Warranties</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>This App is provided “as is” without any warranties, express or implied. The developer makes no guarantees about the availability, accuracy, or functionality of the App.</Text>
          </View>

          {/* 2 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>2.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>Use at Your Own Risk</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>You assume all risk when using the App. The developer is not responsible for any damages, data loss, or other issues that may arise from using the App.</Text>
          </View>

          {/* 3 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>3.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>No Liability</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>To the fullest extent permitted by law, the developer is not liable for any direct, indirect, incidental, or consequential damages related to your use of the App.</Text>
          </View>

          {/* 4 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>4.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>Privacy Disclaimer</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>This App does not collect, store, or share any personal data. All settings and app-related data are stored locally on your device and are not transmitted to the developer or any third parties.</Text>
          </View>

          {/* 5 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>5.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>Updates and Termination</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>The developer may update, modify, or discontinue the App at any time without notice.</Text>
          </View>

          {/* 6 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>6.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>Changes to Terms</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>These terms may be updated from time to time. Your continued use of the App means you accept any changes.</Text>
          </View>

          {/* 7 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>7.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>Governing Law</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>These terms are governed by the laws of the state of Florida, USA.</Text>
          </View>


          {/* 8 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>8.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>Additional Attribution</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>n-back task by Wayne Kirchner in 1958. https://psycnet.apa.org/record/1959-07784-001</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>dual n-back by Susanne Jaeggi et al. in 2003. https://www.sciencedirect.com/science/article/abs/pii/S1053811903000983</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>Some sounds provided by freesound.org and licenced under Creative Commons 0 and others.</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>&quot;Single mode&quot; tile movement provided by Game Menu Select Sound 2 by digimistic -- https://freesound.org/s/705174/ -- License: Creative Commons 0.</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>&quot;Game Complete&quot; fanfare provided by Fanfare short.wav by vitovsky1 -- https://freesound.org/s/400163/ -- License: Attribution 3.0</Text>
          </View>

          <View style={{ alignSelf: 'flex-start', marginBottom: 20, marginTop: 20 }}>
            <Text style={{ color: theme.textColor }}>If you do not agree to these terms, uninstall and/or do not use the App.</Text>
          </View>
          <View style={{ marginBottom: 20 }}>
            <Button label=" Accept Terms " onPress={acceptTerms} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
