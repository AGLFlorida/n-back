import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Button from './Button';
import { useGlobalStyles } from '@/styles/globalStyles';

type Props = {
  soundGuess?: () => void;
  posGuess?: () => void;
  dualMode?: boolean;
  silentMode?: boolean;
}

export default function PlayButton({
  soundGuess = () => { },
  posGuess = () => { },
  dualMode = true,
  silentMode = false
}: Props) {
  const styles = useGlobalStyles();
  const { t } = useTranslation();
  return (
    <View style={[styles.row, { marginTop: 20 }]}>
      {dualMode && (
        <View style={[styles.cell, styles.clearBorder]}>
          <Button label={(silentMode) ? t('buttons.touch') : t('buttons.sound')} onPress={soundGuess} />
        </View>)}
      <View style={[styles.cell, styles.clearBorder]}>
        <Button label={t('buttons.position')} onPress={posGuess} />
      </View>
    </View>
  );
}