import { View } from 'react-native';

import Button from './Button';
import { getGlobalStyles } from '@/styles/globalStyles';

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
  const styles = getGlobalStyles();

  return (
    <View style={[styles.row, { marginTop: 20 }]}>
      {dualMode && (
        <View style={[styles.cell, styles.clearBorder]}>
          <Button label={(silentMode) ? " Touch " : " Sound "} onPress={soundGuess} />
        </View>)}
      <View style={[styles.cell, styles.clearBorder]}>
        <Button label=" Position " onPress={posGuess} />
      </View>
    </View>
  );
}