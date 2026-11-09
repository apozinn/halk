import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/themed/Themed";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export default function NotFoundScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("notFound.title")}</Text>
      <TouchableOpacity onPress={() => router.replace("/")} style={styles.link}>
        <Text style={styles.linkText}>{t("notFound.goHome")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
