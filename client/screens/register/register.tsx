import React, { useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "../../types";
import * as RNLocalize from "react-native-localize";
import CountryPicker, {
  getCallingCode,
} from "react-native-country-picker-modal";
import { Text, TextInput } from "../../src/components/Themed";
import VerifyPhoneFormat from "../../src/components/verifyPhoneFormat";
import { AsYouType } from "libphonenumber-js";

export default function Register({
  navigation,
}: RootStackScreenProps<"Register">) {
  const [phone, setPhone] = useState<any>("");
  const [callingCode, setCallingCode] = useState<any>("");
  const [country, setCountry] = useState<any>(RNLocalize.getCountry());

  useEffect(() => {
    getCallingCode(country).then((c) => {
      setCallingCode("+" + c);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/icon.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Se registe com seu numero</Text>
      <View style={styles.numberContainer}>
        <CountryPicker
          countryCode={country}
          containerButtonStyle={styles.countryButton}
          withAlphaFilter
          withCallingCode
          withCloseButton
          withCurrency
          withEmoji
          withFilter
          withFlag
          withFlagButton
          withModal
          onSelect={(c) => {
            setCountry(c.cca2);
            setCallingCode(c.callingCode[0]);
          }}
        />
        <TextInput
          placeholder="Seu numero"
          style={styles.input}
          onChangeText={(value) => {
            if (phone.includes(callingCode)) {
              setPhone(value);
            } else setPhone(`${callingCode}${value}`);
          }}
          value={new AsYouType(country).input(phone)}
          textContentType={"telephoneNumber"}
          keyboardType={"number-pad"}
        />
      </View>
      <Text style={styles.description}>
        Após a confirmação, será enviado um código de verificação para o seu
        número.
      </Text>
      <VerifyPhoneFormat phone={phone} navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 20,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
  },
  numberContainer: {
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 10,
    width: "70%",
    height: 40,
    marginTop: 5,
    flexDirection: "row",
  },
  input: {
    width: "100%",
    height: "100%",
    borderLeftWidth: 1,
    borderLeftColor: "#222",
    paddingLeft: 10,
  },
  countryButton: {
    width: 35,
    height: 0,
    marginLeft: 5,
    marginTop: 3,
  },
  description: {
    fontSize: 11,
    textAlign: "center",
    width: 250,
    opacity: 0.8,
    marginTop: 3,
  },
});
