import { StyleSheet, Platform, Pressable, Text } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

type Props = {
  label: string;
  onPress?: () => void;
};

export default function Button({ label, onPress }: Props) {
  return (
    <Pressable style={styles.buttonContainer} onPress={onPress}>
      <Svg style={StyleSheet.absoluteFill} height="100%" width="100%">
        <Defs>
          <RadialGradient
            id="buttonGradient"
            cx="50%"
            cy="50%"
            rx="70%"
            ry="70%"
            fx="40%"
            fy="40%"
            gradientUnits="objectBoundingBox"
          >
            <Stop offset="20%" stopColor="#1f3c4a" stopOpacity="1" />
            <Stop offset="100%" stopColor="#36687d" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect
          width="100%"
          height="100%"
          fill="url(#buttonGradient)"
          rx="14"
          ry="14"
        />
      </Svg>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 24,
    margin: 20,
  },
});