import { useContext } from "react";
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
import { Avatar } from '@kolking/react-native-avatar';
import { getColors } from "@//constants/Colors";
import { useRouter } from "expo-router";


const badgeProps = {
  size: 50,
  borderRadius: 50,
  animate: true,
};

export default function SettingsScreen() {
  const { user, updateUser } = useContext(UserContext);
  const colors = getColors();
  const navigation = useRouter();

  function exit(): void {
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
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.topContainer,
          {
            borderBottomWidth: 1,
            borderBottomColor: colors.defaultColors.border,
          },
        ]}
      >
        <TouchableOpacity style={styles.profileContainer} onPress={() => { }}>
          {user.profile.avatar.length ? (
            <Avatar
              size={60}
              name={user.profile.username}
              source={{ uri: user.profile.avatar }}
              colorize={true}
              badge={true}
              badgeColor={"#919191"}
              badgeProps={badgeProps}
              style={{ marginRight: 10 }}
            />
          ) : (
            <Avatar
              size={60}
              name={user.profile.avatar}
              colorize={true}
              badge={true}
              badgeColor={"#919191"}
              badgeProps={badgeProps}
              style={{ marginRight: 10 }}
            />
          )}
          <View>
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>{user.profile.name}</Text>
            <Text style={{ fontSize: 14 }}>{user.profile.username}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.swapAccount}>
          <AntDesign name="swap" size={25} color={colors.tint} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.linksContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Geral</Text>

          <TouchableOpacity style={styles.link}>
            <MaterialCommunityIcons
              name="account-reactivate"
              size={25}
              color={colors.tint}
            />
            <Text style={styles.linkTitle}>Definir status</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <MaterialIcons name="account-box" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>Conta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <MaterialCommunityIcons
              name="pencil"
              size={25}
              color={colors.tint}
            />
            <Text style={styles.linkTitle}>Editar perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <MaterialIcons name="security" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>Privacidade e segurança</Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.section,
            { borderTopWidth: 1, borderTopColor: colors.defaultColors.border },
          ]}
        >
          <Text style={styles.sectionTitle}>Aplicativo</Text>

          <TouchableOpacity style={styles.link}>
            <MaterialIcons
              name="mark-chat-unread"
              size={25}
              color={colors.tint}
            />
            <Text style={styles.linkTitle}>Conversas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <MaterialIcons name="translate" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>Idioma</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <MaterialIcons name="storage" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>Armazenamento</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <MaterialIcons name="notifications" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>Notificação</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <FontAwesome5 name="palette" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>Aparência</Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.section,
            { borderTopWidth: 1, borderTopColor: colors.defaultColors.border },
          ]}
        >
          <Text style={styles.sectionTitle}>Suporte</Text>

          <TouchableOpacity style={styles.link}>
            <MaterialIcons name="help" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>Suporte</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <MaterialIcons name="report" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>reportar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <Ionicons name="star" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>Reconhecimentos</Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.section,
            { borderTopWidth: 1, borderTopColor: colors.defaultColors.border },
          ]}
        >
          <Text style={styles.sectionTitle}>Conta</Text>
          <TouchableOpacity style={styles.link} onPress={() => exit()}>
            <MaterialIcons name="exit-to-app" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>Sair</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <AntDesign name="swap" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>Mudar de conta</Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.section,
            { borderTopWidth: 1, borderTopColor: colors.defaultColors.border },
          ]}
        >
          <Text style={styles.sectionTitle}>Updates</Text>
          <TouchableOpacity style={styles.link}>
            <MaterialIcons name="update" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>Novidades</Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.section,
            { borderTopWidth: 1, borderTopColor: colors.defaultColors.border },
          ]}
        >
          <Text style={styles.sectionTitle}>Developer</Text>
          <TouchableOpacity style={styles.link}>
            <FontAwesome5 name="dev" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>Código fonte</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <FontAwesome5 name="dev" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>Licenças</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <FontAwesome5 name="dev" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>debug logs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <FontAwesome5 name="dev" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>Client-info</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <FontAwesome5 name="dev" size={25} color={colors.tint} />
            <Text style={styles.linkTitle}>Api-info</Text>
          </TouchableOpacity>
        </View>
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
  linkTitle: {
    marginLeft: 10,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    marginBottom: 5,
  },
  swapAccount: {
    padding: 5,
  },
});
