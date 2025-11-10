import { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SectionList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "@/components/themed/Themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed/ThemedView";
import { useTranslation } from "react-i18next";

interface CallSection {
  title: string;
  data: { props: any | null }[];
}

export default function Calls() {
  const [calls, setCalls] = useState<CallSection[]>([]);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  useEffect(() => {
    if (!calls.length) {
      setCalls([
        {
          title: t("calls.recent"),
          data: [{ props: null }],
        },
      ]);
    }
  }, [calls.length, t]);

  function CallContainer({ call }: { call: { props: any | null } }) {
    if (!call?.props) return null;
    return null;
  }

  return (
    <ThemedView style={[styles.container, { marginTop: insets.top }]}>
      <TouchableOpacity style={styles.newCall} onPress={() => {}}>
        <View style={styles.newCallButton}>
          <MaterialIcons name="add-ic-call" size={27} color="white" />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.newCallTitle}>{t("calls.newCall")}</Text>
          <Text style={styles.newCallDescription}>
            {t("calls.newCallDescription")}
          </Text>
        </View>
      </TouchableOpacity>

      <SectionList
        sections={calls}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item }) => <CallContainer call={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionTitle}>{title}</Text>
        )}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  newCall: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  newCallButton: {
    backgroundColor: "#2f95dc",
    borderRadius: 100,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  newCallTitle: {
    fontWeight: "bold",
    fontSize: 15,
  },
  newCallDescription: {
    fontSize: 12,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 13,
    opacity: 0.8,
    marginTop: 5,
  },
});
