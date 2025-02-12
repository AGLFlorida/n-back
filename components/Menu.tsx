import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  color: string
}

export default function Menu({ color }: Props) {
  const onPress = () => {};


  return (
    <Pressable onPress={onPress}>
      <Ionicons name="menu" size={24} color={color} style={{ marginLeft: 15 }} />
    </Pressable>
  )
}