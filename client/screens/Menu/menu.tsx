import { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  SectionList,
  ScrollView,
} from "react-native";
import { RootTabScreenProps } from "../../types";
import {
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import { Text, TextInput } from "../../src/components/Themed";
import { UserContext } from "../../src/contexts/user";
import { ChatsContext } from "../../src/contexts/chats";
import { Userpic } from "react-native-userpic";
import { getColors } from "../../constants/Colors";

const badgeProps = {
  size: 50,
  borderRadius: 50,
  animate: true,
};

export default function Menu({ navigation }: RootTabScreenProps<"Menu">) {
  const { user } = useContext(UserContext);
  const { chats } = useContext(ChatsContext);
  const [calls, setCalls] = useState([]);
  const colors = getColors();

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
        <TouchableOpacity style={styles.profileContainer} onPress={() => {}}>
          <Userpic
            size={60}
            name={user.profile.name}
            source={{ uri: user.profile.avatar }}
            colorize={true}
            borderRadius="50%"
            badge={true}
            badgeColor={"#2f95dc"}
            badgePosition={"bottom-right"}
            badgeProps={badgeProps}
            style={{ marginRight: 10 }}
          />

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
            <Text style={styles.linkTitle}>Aparecnia</Text>
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
          <TouchableOpacity style={styles.link}>
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
