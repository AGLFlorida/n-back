import { View } from 'react-native';

import Button from './Button';
import { getGlobalStyles } from '@/styles/globalStyles';

type Props = {
  soundGuess?: () => void;
  posGuess?: () => void;
  dualMode?: boolean
}

export default function PlayButton({
  soundGuess = () => { },
  posGuess = () => { },
  dualMode = true,
}: Props) {
  const styles = getGlobalStyles();

  return (
    <View style={[styles.row, { marginTop: 20 }]}>
      <View style={[styles.cell, styles.clearBorder]}>
        <Button label=" Sound " onPress={soundGuess} />
      </View>
      {dualMode && (
        <View style={[styles.cell, styles.clearBorder]}>
          <Button label=" Position " onPress={posGuess} />
        </View>
      )}
    </View>
  );
}