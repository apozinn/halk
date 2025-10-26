import { useContext, useCallback } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import { Text } from "@/components/ui/Themed";
import { UserContext } from "@/contexts/user";
import { Avatar } from "@kolking/react-native-avatar";
import { getColors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { t } from "i18next";

export default function SettingsScreen() {
  const { user, updateUser } = useContext(UserContext);
  const colors = getColors();
  const navigation = useRouter();

  const exit = useCallback(() => {
    updateUser({
      logged: false,
      user: {
        id: "",
        phone: "",
        profile: {
          name: "",
          username: "",
          avatar: "",
          bio: "",
        },
      },
    });
    navigation.replace("/welcome/welcome");
  }, [updateUser, navigation]);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View
      style={[
        styles.section,
        { borderTopWidth: 1, borderTopColor: colors.defaultColors.border },
      ]}
    >
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const Link = ({ icon, title, onPress }: { icon: React.ReactNode; title: string; onPress?: () => void }) => (
    <TouchableOpacity style={styles.link} onPress={onPress}>
      {icon}
      <Text style={styles.linkTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.topContainer,
          { borderBottomWidth: 1, borderBottomColor: colors.defaultColors.border },
        ]}
      >
        <TouchableOpacity style={styles.profileContainer} onPress={() => {}}>
          {user.profile.avatar ? (
            <Avatar
              size={60}
              name={user.profile.username}
              source={{ uri: user.profile.avatar }}
              colorize
              style={{ marginRight: 10 }}
            />
          ) : (
            <Avatar
              size={60}
              name={user.profile.username}
              colorize
              style={{ marginRight: 10 }}
            />
          )}

          <View>
            <Text style={styles.profileName}>{user.profile.name}</Text>
            <Text style={styles.profileBio}>{user.profile.bio}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.linksContainer}>
        <Section title={t("settings_general")}>
          <Link
            icon={<MaterialCommunityIcons name="account-reactivate" size={25} color={colors.tint} />}
            title={t("settings_setStatus")}
          />
          <Link
            icon={<MaterialIcons name="account-box" size={25} color={colors.tint} />}
            title={t("settings_profile")}
          />
          <Link
            icon={<MaterialCommunityIcons name="pencil" size={25} color={colors.tint} />}
            title={t("settings_editProfile")}
          />
          <Link
            icon={<MaterialIcons name="security" size={25} color={colors.tint} />}
            title={t("settings_privacySecurity")}
          />
        </Section>

        <Section title={t("settings_app")}>
          <Link
            icon={<MaterialIcons name="mark-chat-unread" size={25} color={colors.tint} />}
            title={t("settings_chats")}
          />
          <Link
            icon={<MaterialIcons name="translate" size={25} color={colors.tint} />}
            title={t("settings_language")}
          />
          <Link
            icon={<MaterialIcons name="storage" size={25} color={colors.tint} />}
            title={t("settings_storage")}
          />
          <Link
            icon={<MaterialIcons name="notifications" size={25} color={colors.tint} />}
            title={t("settings_notifications")}
          />
          <Link
            icon={<FontAwesome5 name="palette" size={25} color={colors.tint} />}
            title={t("settings_appearance")}
          />
        </Section>

        <Section title={t("settings_support")}>
          <Link
            icon={<MaterialIcons name="help" size={25} color={colors.tint} />}
            title={t("settings_supportHelp")}
          />
          <Link
            icon={<MaterialIcons name="report" size={25} color={colors.tint} />}
            title={t("settings_report")}
          />
          <Link
            icon={<Ionicons name="star" size={25} color={colors.tint} />}
            title={t("settings_acknowledgements")}
          />
        </Section>

        <Section title={t("settings_account")}>
          <Link
            icon={<MaterialIcons name="exit-to-app" size={25} color={colors.tint} />}
            title={t("settings_logout")}
            onPress={exit}
          />
          <Link
            icon={<AntDesign name="swap" size={25} color={colors.tint} />}
            title={t("settings_switchAccount")}
          />
        </Section>

        <Section title={t("settings_updates")}>
          <Link
            icon={<MaterialIcons name="update" size={25} color={colors.tint} />}
            title={t("settings_whatsNew")}
          />
        </Section>

        <Section title={t("settings_developer")}>
          <Link
            icon={<FontAwesome5 name="code" size={22} color={colors.tint} />}
            title={t("settings_sourceCode")}
          />
          <Link
            icon={<FontAwesome5 name="file-alt" size={22} color={colors.tint} />}
            title={t("settings_licenses")}
          />
          <Link
            icon={<FontAwesome5 name="bug" size={22} color={colors.tint} />}
            title={t("settings_debugLogs")}
          />
          <Link
            icon={<FontAwesome5 name="info-circle" size={22} color={colors.tint} />}
            title={t("settings_clientInfo")}
          />
          <Link
            icon={<FontAwesome5 name="server" size={22} color={colors.tint} />}
            title={t("settings_apiInfo")}
          />
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    marginHorizontal: 10,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  profileName: {
    fontWeight: "bold",
    fontSize: 17,
    marginLeft: 10,
  },
  profileBio: {
    fontSize: 12,
    marginLeft: 10,
    opacity: 0.8,
  },
  linksContainer: {
    marginTop: 5,
  },
  section: {
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 13,
    opacity: 0.8,
    marginBottom: 5,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    marginBottom: 5,
  },
  linkTitle: {
    marginLeft: 10,
  },
});
