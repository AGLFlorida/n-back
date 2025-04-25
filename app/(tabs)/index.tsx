import React from 'react';
import { View, Text, Alert } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useTranslation } from 'react-i18next';
import Button from "@/components/Button";
import { useGlobalStyles } from "@/styles/globalStyles";

import { useSettingsStore } from "@/store/useSettingsStore";

export default function Index() {
  const router = useRouter();
  const styles = useGlobalStyles();
  const { t } = useTranslation();

  const { termsAccepted } = useSettingsStore();

  useFocusEffect(
    React.useCallback(() => {

        if (!termsAccepted) {
          Alert.alert(
            t('terms.title'),
            t('terms.message'),
            [
              { text: t('terms.seeTerms'), onPress: () => router.push('/terms') },
            ],
            { cancelable: false }
          );
        }
      

    }, [router, termsAccepted])
  );
 
  return (
    <View style={[styles.container, styles.indexContainer]}>
      <View style={styles.listItem}>
        <Text style={styles.number}>1.</Text>
        <Text style={styles.text}>{t('tutorial.welcome')}</Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.number}>2.</Text>
        <Text style={styles.text}>{t('tutorial.compare')}</Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.number}>3.</Text>
        <Text style={styles.text}>
          {t('tutorial.match')}
        </Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.number}>4.</Text>
        <Text style={styles.text}>
          {t('tutorial.singleCue')}
        </Text>
      </View>
      <View style={[styles.listItem, { paddingBottom: 20 }]}>
        <Text style={styles.number}>5.</Text>
        <Text style={styles.text}>
          {t('tutorial.keepPlaying')}
        </Text>
      </View>
      <Button label={t('buttons.getStarted')} onPress={() => router.push('/play')} />
    </View>
  );
}
