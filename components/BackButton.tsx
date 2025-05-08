import React from "react";
import { useRouter, useNavigation, usePathname } from "expo-router";
import { Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';


type BackButtonProps = {
  color: string
}

function BackButton({color}: BackButtonProps) {
  const router = useRouter();
  const navigation = useNavigation();

  const path = usePathname();

  return (
    <Pressable
      onPress={() => {
        if (path === '/learn') {
          router.push("/settings");
        } else if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          router.push("/");
        }
      }}
      style={{ marginLeft: 15 }}
    >
      <Ionicons name="arrow-back" size={24} color={color} />
    </Pressable>
  );
}

export default React.memo(BackButton);