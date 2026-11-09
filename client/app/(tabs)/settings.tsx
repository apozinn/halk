import { useContext } from "react";
import {
  View,
  StyleSheet,
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
import { Text } from "@/components/themed/Themed";
import { UserContext } from "@/contexts/user";
import { ChatsContext } from "@/contexts/chats";
import { Avatar } from "@kolking/react-native-avatar";
import { getColors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { t } from "i18next";
import { ThemedSafeAreaView } from "@/components/themed/themedSafeAreaView";

export default function SettingsScreen() {
  const { user, updateUser } = useContext(UserContext);
  const { chats, updateChats } = useContext(ChatsContext);
  const colors = getColors();
  const navigation = useRouter();

  const exit = () => {
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
    updateChats([]);
    navigation.replace("/welcome/welcome");
  };

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

  return user ? (
    <ThemedSafeAreaView style={{ paddingHorizontal: 10 }}>
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.profileContainer} onPress={() => { }}>
          <Avatar
            size={60}
            name={user.profile.username}
            source={user.profile.avatar ? { uri: user.profile.avatar } : undefined}
            colorize
            style={{ marginRight: 10 }}
          />
          <View>
            <Text style={styles.profileName}>{user.profile.name}</Text>
            <Text style={styles.profileBio}>{user.profile.username}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.linksContainer}>
        {/* <Section title={t("settings.general")}>
          <Link icon={<MaterialCommunityIcons name="account-reactivate" size={25} color={colors.tint} />} title={t("settings.setStatus")} />
          <Link icon={<MaterialIcons name="account-box" size={25} color={colors.tint} />} title={t("settings.profile")} />
          <Link icon={<MaterialCommunityIcons name="pencil" size={25} color={colors.tint} />} title={t("settings.editProfile")} />
          <Link icon={<MaterialIcons name="security" size={25} color={colors.tint} />} title={t("settings.privacySecurity")} />
        </Section> */}

        {/* <Section title={t("settings.app")}>
          <Link icon={<MaterialIcons name="mark-chat-unread" size={25} color={colors.tint} />} title={t("settings.chats")} />
          <Link icon={<MaterialIcons name="translate" size={25} color={colors.tint} />} title={t("settings.language")} />
          <Link icon={<MaterialIcons name="storage" size={25} color={colors.tint} />} title={t("settings.storage")} />
          <Link icon={<MaterialIcons name="notifications" size={25} color={colors.tint} />} title={t("settings.notifications")} />
          <Link icon={<FontAwesome5 name="palette" size={25} color={colors.tint} />} title={t("settings.appearance")} />
        </Section> */}

        {/* <Section title={t("settings.support")}>
          <Link icon={<MaterialIcons name="help" size={25} color={colors.tint} />} title={t("settings.supportHelp")} />
          <Link icon={<MaterialIcons name="report" size={25} color={colors.tint} />} title={t("settings.report")} />
          <Link icon={<Ionicons name="star" size={25} color={colors.tint} />} title={t("settings.acknowledgements")} />
        </Section> */}

        <Section title={t("settings.account")}>
          <Link icon={<MaterialIcons name="exit-to-app" size={25} color={colors.tint} />} title={t("settings.logout")} onPress={exit} />
          {/* <Link icon={<AntDesign name="swap" size={25} color={colors.tint} />} title={t("settings.switchAccount")} /> */}
        </Section>

        {/* <Section title={t("settings.updates")}>
          <Link icon={<MaterialIcons name="update" size={25} color={colors.tint} />} title={t("settings.whatsNew")} />
        </Section> */}

        {/* <Section title={t("settings.developer")}>
          <Link icon={<FontAwesome5 name="code" size={22} color={colors.tint} />} title={t("settings.sourceCode")} />
          <Link icon={<FontAwesome5 name="file-alt" size={22} color={colors.tint} />} title={t("settings.licenses")} />
          <Link icon={<FontAwesome5 name="bug" size={22} color={colors.tint} />} title={t("settings.debugLogs")} />
          <Link icon={<FontAwesome5 name="info-circle" size={22} color={colors.tint} />} title={t("settings.clientInfo")} />
          <Link icon={<FontAwesome5 name="server" size={22} color={colors.tint} />} title={t("settings.apiInfo")} />
        </Section> */}
      </ScrollView>
    </ThemedSafeAreaView>
  ) : null;
}

const styles = StyleSheet.create({
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
