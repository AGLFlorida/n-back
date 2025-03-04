import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useGlobalStyles } from '@/styles/globalStyles';
import  Button from '@/components/Button';

export default function FourOhFour() {
  const styles = useGlobalStyles();
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <View style={[styles.container, {
      justifyContent: 'center',
      alignItems: 'center',
    }]}>
      <Button label={t('buttons.goHome')} onPress={() => router.push('/')} />
    </View>
  );
}
