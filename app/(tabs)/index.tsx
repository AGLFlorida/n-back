import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

import Button from "@/components/Button";
import { getGlobalStyles } from "@/styles/globalStyles";

import security from "@/util/security";

export default function Index() {
  const router = useRouter();
  const styles = getGlobalStyles();

  return (
    <View style={[styles.container, { alignItems: 'center', paddingHorizontal: 30, paddingVertical: 10, }]}>
      <Text style={styles.heading}>How to Play</Text>
      <View style={styles.listItem}>
        <Text style={styles.number}>1.</Text>
        <Text style={styles.text}>You will see a sequence of squares on a grid.</Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.number}>2.</Text>
        <Text style={styles.text}>Compare the current item to the one "N" steps back. For example: If you are playing 2-back, compare the current item with the one 2 steps back. For 3-back, 3 steps... etc.</Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.number}>3.</Text>
        <Text style={styles.text}>
          If they match, tap the match button. If they don't, don't tap anything.
        </Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.number}>4.</Text>
        <Text style={styles.text}>
          The grid squares are the single cue mode. There are additional modes where you play with multiple cues. You have to track each queue separately but the idea is the same.
        </Text>
      </View>
      <View style={[styles.listItem, { paddingBottom: 20 }]}>
        <Text style={styles.number}>5.</Text>
        <Text style={styles.text}>Keep playing to challenge your working memory!</Text>
      </View>
      <Button label=" Get Started " onPress={() => router.push('/play')} />
    </View>
  );
}
