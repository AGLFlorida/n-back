import { Stack } from 'expo-router';

import { ThemeProvider } from '@/contexts/ThemeContext';
import FourOhFour from '@/components/FourOhFour'; 

export default function NotFoundScreen() {
  return (
    <ThemeProvider>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <FourOhFour />
    </ThemeProvider>
  );
}
