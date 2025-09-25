import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { getColors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";

export default function Welcome() {
  const router = useRouter();
  const colors = getColors();

  return (
    <SafeAreaView style={styles.container}>

      <ThemedView style={styles.contentArea}>
        <ThemedText style={styles.title}>
          Your Conversations Elevated.
        </ThemedText>

        <Image
          source={require("../../assets/images/halk_icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <ThemedText style={styles.description}>
          Lightweight, blazing fast, and designed for flow. Halk keeps your chats seamless, simple, and always within reach.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => router.navigate("welcome/signIn")}
          style={{...styles.primaryButton, backgroundColor: colors.tint }}
        >
          <ThemedText style={{ ...styles.primaryButtonText, color: colors.background }}>Sign In</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.navigate("welcome/signUp")}
          style={{ ...styles.secondaryButton, borderColor: colors.tint }}
        >
          <ThemedText style={{ ...styles.secondaryButtonText, color: colors.tint }}>Sign Up</ThemedText>
        </TouchableOpacity>
      </ThemedView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10
  },

  title: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 30,
    textAlign: 'center',
  },

  logo: {
    width: 200,
    height: 200,
    marginVertical: 30,
  },

  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 10,
  },

  buttonsContainer: {
    paddingHorizontal: 10,
  },

  primaryButton: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 15,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});