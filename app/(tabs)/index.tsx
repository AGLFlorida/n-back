import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import Button from "@/components/Button";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button label=" Start " onPress={() => router.push('/play')} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
  },
  grid: {
    alignItems: "center",
    width: "100%",
    backgroundColor: "#000",
  },
  row: {
    flexDirection: "row",
  }
});