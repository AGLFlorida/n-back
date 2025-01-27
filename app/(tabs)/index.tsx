import { View } from "react-native";
import { useRouter } from "expo-router";

import Button from "@/components/Button";
import { getGlobalStyles } from "@/styles/globalStyles";

export default function Index() {
  const router = useRouter();
  const styles = getGlobalStyles();

  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center'}]}>
      <Button label=" Start " onPress={() => router.push('/play')} />
    </View>
  );
}
