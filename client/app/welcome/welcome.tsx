import { ThemedSafeAreaView } from "@/components/themedSafeAreaView";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function WelcomePage() {
  const { t } = useTranslation();
  return (
    <ThemedSafeAreaView style={styles.mainContainer}>
      
      <ThemedView style={styles.appLogoContainer}>
        <Image
          source={require("../../assets/images/halk.png")}
          resizeMode="contain"
          style={styles.logo}
        />
      </ThemedView>

      <ThemedView style={styles.welcomeTextsContainer}>
        <ThemedText style={styles.welcomeTitle}>
          {t('welcomeTitle')}
        </ThemedText>
        <ThemedText style={styles.welcomeDescription}>
          {t('welcomeDescription')}
        </ThemedText>
      </ThemedView>

      <ThemedView>
        <TouchableOpacity onPress={() => { }}>
          <ThemedText>
            {t('welcomeButtonSignIn')}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { }}>
          <ThemedText>
            {t('welcomeButtonSignUp')}
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
    marginTop: 20
  },
  welcomeDescription: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center'
  }
});