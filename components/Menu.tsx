import React from 'react';
import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";

type Props = {
  color: string
}

function Menu({ color }: Props) {
  const navigation = useNavigation();
  const onPress = () => navigation.dispatch(DrawerActions.openDrawer());


  return (
    <Pressable onPress={onPress}>
      <Ionicons name="menu" size={24} color={color} style={{ marginRight: 10 }} />
    </Pressable>
  )
}

export default React.memo(Menu);