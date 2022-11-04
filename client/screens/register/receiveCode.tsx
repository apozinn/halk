import { useEffect, useState, useContext } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "../../types";
import { Text } from "../../src/components/Themed";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import useColorScheme from "../../src/hooks/useColorScheme";
import { UserContext } from "../../src/contexts/user";
import { verifyCode } from "../../middleware/api";
import { ChatsContext } from '../../src/contexts/chats';

export default function ReceiveCode({
  navigation,
}: RootStackScreenProps<"ReceiveCode">) {
  const theme = useColorScheme();
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: 6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const { user, updateUser } = useContext(UserContext);
  const { chats, updateChats } = useContext(ChatsContext);

  useEffect(() => {
    if (value.length === 6) {
      verifyCode(user.id, value).then((data) => {
        if(data.verify) {
          if(data.existingAccount) {
          updateUser({
            user: data.user,
            logged: true,
          });
          updateChats({chats: data.chats});
          navigation.navigate("Root");
        } else navigation.navigate("CreateProfile");
        }
        if(data.invalidCode) {
          alert("Código inválido, tente novamente");
        }
        if(data.error) {
          alert("Houve um erro em nossos servidores, tente novamente mais tarde.");
        }
      });
    }
  }, [value]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/verificationCode.png")}
        style={styles.image}
      />
      <Text style={styles.description}>
        Insíra abaixo com o código de verificação enviado para o seu número
      </Text>
      <View style={styles.codeContainer}>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={(code) => setValue(code)}
          cellCount={6}
          rootStyle={{
            ...styles.codeFieldRoot,
            borderColor: theme === "dark" ? "#333" : "#00000030",
          }}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[
                {
                  ...styles.cell,
                  borderColor: theme === "dark" ? "#333" : "#00000030",
                },
              ]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 100,
    marginBottom: 10,
  },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 50,
    lineHeight: 50,
    fontSize: 24,
    borderWidth: 2,
    textAlign: "center",
    borderRadius: 5,
    marginRight: 5,
  },
  codeContainer: {
    marginHorizontal: 10,
  },
  description: {
    fontSize: 12,
    textAlign: "center",
    width: 290,
    opacity: 0.9,
  },
});
