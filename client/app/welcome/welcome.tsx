import { ThemedSafeAreaView } from "@/components/themed/themedSafeAreaView";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getColors } from "@/constants/Colors";
import { router } from "expo-router";

export default function WelcomePage() {
  const colors = getColors();
  const { t } = useTranslation();

  return (
    <ThemedSafeAreaView style={styles.mainContainer}>

      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedView style={styles.appLogoContainer}>
          <Image
            source={require("../../assets/images/halk.png")}
            resizeMode="contain"
            style={styles.logo}
          />
        </ThemedView>

        <ThemedView style={styles.welcomeTextsContainer}>
          <ThemedText style={styles.welcomeTitle}>
            {t('welcome.title')}
          </ThemedText>
          <ThemedText style={styles.welcomeDescription}>
            {t('welcome.description')}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.welcomeButtonsContainer}>

        <TouchableOpacity style={{ ...styles.signUpButton, ...{ backgroundColor: colors.tint, borderColor: colors.border } }} onPress={() => {router.navigate("/welcome/signUp")}}>
          <ThemedText style={{ color: "white", fontWeight: "bold" }}>
            {t('welcome.button.signUp')}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={{ ...styles.signInButton, ...{ borderColor: colors.border } }} onPress={() => {router.navigate("/welcome/signIn")}}>
          <ThemedText style={{ fontWeight: "bold" }}>
            {t('welcome.button.signIn')}
          </ThemedText>
        </TouchableOpacity>

      </ThemedView>

    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  appLogoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200
  },
  welcomeTextsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    padding: 5
  },
  welcomeDescription: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    padding: 5

  },
  welcomeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    gap: 10,
  },
  signUpButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  signInButton: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center'

  }
});