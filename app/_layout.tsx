import React from 'react';
import { Drawer } from "expo-router/drawer";
import { ToastProvider } from "expo-toast";
import { useTranslation } from 'react-i18next';

import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import Menu from "@/components/Menu";
import BackButton from "@/components/BackButton";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <RootNav />
      </ToastProvider>
    </ThemeProvider>
  );
}

function RootNav() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Drawer
      screenOptions={{
        ...theme.screenOptions,
        drawerPosition: "right",
        drawerStyle: { backgroundColor: theme.backgroundColor },
        drawerContentStyle: { backgroundColor: theme.backgroundColor },
        drawerLabelStyle: { color: theme.textColor },
        drawerActiveTintColor: theme.screenOptions.headerTintColor,
        drawerInactiveTintColor: theme.screenOptions.headerTintColor,
        headerRight: () => <Menu color={theme.screenOptions.headerTintColor} />,
        headerLeft: () => <BackButton color={theme.screenOptions.headerTintColor} />,
        headerStyle: {
          backgroundColor: theme.backgroundColor
        },
        headerTintColor: theme.textColor,
      }}
    >
      <Drawer.Screen name="(tabs)" options={{
        headerShown: false,
        title: t('titles.home'),
        drawerIcon: HomeIcon
      }} />
      <Drawer.Screen name="+not-found" options={{ title: t('titles.notFound'), drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="learn" options={{ title: "", drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="terms" options={{
        title: t('titles.terms'),
        drawerIcon: TermsIcon
      }} />
      <Drawer.Screen name="settings" options={{
        title: t('titles.settings'),
        drawerIcon: SettingsIcon
      }} />
    </Drawer>
  );
}


type IconProps = {
  color: string;
  focused: boolean;
  size: number;
}
const SettingsIcon = ({ color, focused, size }: IconProps) => (
  <Ionicons name={focused ? 'cog-sharp' : 'cog-outline'} color={color} size={size} />
);
const HomeIcon = ({ color, focused, size }: IconProps) => (
  <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={size} />
);
const TermsIcon = ({ color, focused, size }: IconProps) => (
  <Ionicons name={focused ? 'book-sharp' : 'book-outline'} color={color} size={size} />
);