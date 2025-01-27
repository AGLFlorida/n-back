import { View } from 'react-native';
import { Link } from 'expo-router';

import { getGlobalStyles } from '@/styles/globalStyles';

export default function FourOhFour() {
  const styles = getGlobalStyles();

  return (
    <View style={[styles.container, {
      justifyContent: 'center',
      alignItems: 'center',
    }]}>
      <Link href="/" style={styles.button}>
        Go back to Home screen!
      </Link>
    </View>
  );
}
