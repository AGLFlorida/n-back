import React from 'react';
import { Stack } from 'expo-router';

import { useTheme } from '@/contexts/ThemeContext';
import FourOhFour from '@/components/FourOhFour';

export default function NotFoundScreen() {
  const { theme } = useTheme();

  return (
    <>
      <Stack.Screen options={{
        title: "Oops! Not Found",
        headerStyle: {
          backgroundColor: theme.backgroundColor
        },
        headerTintColor: theme.textColor,
      }} />
      <FourOhFour />
    </>
  );
}
