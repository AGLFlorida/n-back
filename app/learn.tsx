import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useGlobalStyles } from '@/styles/globalStyles';
import { useTheme } from '@/contexts/ThemeContext';

export default function Learn() {
  const styles = useGlobalStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SafeAreaView style={{ backgroundColor: theme.backgroundColor, flex: 1 }}>
      <ScrollView>
        <View style={[styles.container, { alignItems: 'center', marginHorizontal: 30, marginVertical: 10, }]}>
          <Text style={styles.heading}>About Settings</Text>

          {/* 1 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>1.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>{t('learn.dualNback')}</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>
              {t('learn.dualNbackDescription')}
            </Text>
          </View>

          {/* 2 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>2.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>Silent Mode</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>
              {t('learn.silentModeDescription')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
