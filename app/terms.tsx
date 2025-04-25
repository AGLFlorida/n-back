import React, { ReactNode } from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from "expo-clipboard";
import { useToast } from "expo-toast";
import { useTranslation } from 'react-i18next';


import { useGlobalStyles } from '@/styles/globalStyles';
import { useTheme } from '@/contexts/ThemeContext';
import Button from '@/components/Button';

import { useSettingsStore } from '@/store/useSettingsStore';

export default function Terms() {
  const styles = useGlobalStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const { setTermsAccepted } = useSettingsStore();

  const acceptTerms = () => {
    setTermsAccepted(true);

    router.push("/");
  }

  return (
    <SafeAreaView style={{ backgroundColor: theme.backgroundColor }}>
      <ScrollView>
        <View style={[styles.container, { alignItems: 'center', marginHorizontal: 30, marginVertical: 10, }]}>
          <Text style={styles.heading}>{t('terms.header')}</Text>
          <View style={{ alignSelf: 'flex-start', marginBottom: 5 }}>
            <Text style={{ color: theme.textColor, fontStyle: 'italic' }}>{t('terms.lastUpdated')}</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>{t('terms.headerMessage')}</Text>
          </View>

          {/* 1 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>1.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>{t('terms.noGuarantees')}</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>{t('terms.noGuaranteesMessage')}</Text>
          </View>

          {/* 2 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>2.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>{t('terms.useAtYourOwnRisk')}</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>{t('terms.useAtYourOwnRiskMessage')}</Text>
          </View>

          {/* 3 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>3.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>{t('terms.noLiability')}</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>{t('terms.noLiabilityMessage')}</Text>
          </View>

          {/* 4 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>4.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>{t('terms.privacyDisclaimer')}</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>{t('terms.privacyDisclaimerMessage')}</Text>
          </View>

          {/* 5 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>5.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>{t('terms.updatesAndTermination')}</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>{t('terms.updatedAndTerminationMessage')}</Text>
          </View>

          {/* 6 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>6.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>{t('terms.changesToTerms')}</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>{t('terms.changesToTermsMessage')}</Text>
          </View>

          {/* 7 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>7.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>{t('terms.governingLaw')}</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>{t('terms.governingLawMessage')}</Text>
          </View>

          {/* 8 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>8.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>{t('terms.purchaseAgreement')}</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>{t('terms.purchaseAgreementMessage')}</Text>
          </View>

          {/* 9 */}
          <View style={[styles.listItem, { marginBottom: 3 }]}>
            <Text style={styles.number}>9.</Text>
            <Text style={[styles.text, { fontWeight: '700' }]}>{t('terms.additionalAttribution')}</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <CustomLink textToCopy="https://psycnet.apa.org/record/1959-07784-001">
              <Text style={{ color: theme.textColor }}>{t('terms.additionalAttributionMessage')}</Text>
            </CustomLink>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <CustomLink textToCopy="https://www.sciencedirect.com/science/article/abs/pii/S1053811903000983">
              <Text style={{ color: theme.textColor }}>{t('terms.additionalAttributionMessage2')}</Text>
            </CustomLink>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ color: theme.textColor }}>{t('terms.additionalAttributionMessage3')}</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <CustomLink textToCopy="https://freesound.org/s/705174/">
              <Text style={{ color: theme.textColor }}>{t('terms.additionalAttributionMessage4')}</Text>
            </CustomLink>
          </View>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <CustomLink textToCopy="https://freesound.org/s/400163/">
              <Text style={{ color: theme.textColor }}>{t('terms.additionalAttributionMessage5')}</Text>
            </CustomLink>
          </View>

          <View style={{ alignSelf: 'flex-start', marginBottom: 20, marginTop: 20 }}>
            <Text style={{ color: theme.textColor }}>{t('terms.noAgreementMessage')}</Text>
          </View>
          <View style={{ marginBottom: 20 }}>
            <Button label={t('buttons.acceptTerms')} onPress={acceptTerms} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

type CustomLinkProps = {
  children: ReactNode;
  textToCopy: string;
};

const CustomLink: React.FC<CustomLinkProps> = ({ children, textToCopy }) => {
  const toast = useToast();

  const handleCopyToClipboard = async () => {
    try {
      if (Platform.OS === "web") {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        await Clipboard.setStringAsync(textToCopy);
      }

      toast.show("Copied to clipboard!", { duration: 2000 });
    } catch (error) {
      console.error("Clipboard copy failed:", error);
      toast.show("Failed to copy text.", { duration: 2000 });
    }
  };

  return (
    <Pressable onPress={handleCopyToClipboard}>
      {children}
    </Pressable>
  );
};