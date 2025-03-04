import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

import Menu from '@/components/Menu';

import { useTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        ...theme.screenOptions,
        headerRight: () => <Menu color={theme.screenOptions.headerTintColor} />
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('titles.home'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
          headerTitle: t('titles.home')
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          title: t('titles.play'),
          tabBarLabel: t('titles.play'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'play-back-circle-sharp' : 'play-back-circle-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          
          title: t('titles.history'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'time-sharp' : 'time-outline'} color={color} size={24} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'cog-sharp' : 'cog-outline'} color={color} size={24} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
