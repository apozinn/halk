import { View, Image, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { RootStackScreenProps } from "@/types";
import { Text } from "../../components/ui/Themed";
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from "react-native-paper";
import { getColors } from "../../constants/Colors";
import { useEffect, useState, useContext } from "react";
import * as Crypto from 'expo-crypto';
import { SignIn } from "../../middleware/api";
import { UserContext } from "@/contexts/user";
import { useRouter } from "expo-router";


export default function SignInScreen() {
    const { user, updateUser } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorReason, setErrorReason] = useState("");
    const colors = getColors();
  const router = useRouter();


    async function SignInRequest() {
        const encrypted_password = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256, password
        );
        const result = await SignIn(username, password);

        if (result.logged) {
            updateUser({
                logged: true,
                user: result.user
            });
            router.navigate("app/(tabs)/index");
        } else {
            setErrorReason(result.reason);
            setPassword("");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color="white" />
                </TouchableOpacity>
                <Image source={require("../../assets/images/halk_icon.png")} style={styles.logo} />
            </View>
            <View style={styles.mainContainert}>
                <View style={styles.titleContainer}>
                    <Text style={{ fontSize: 40, fontWeight: "bold" }}>Sign In</Text>
                    <View style={{ ...styles.titleLine, ...{ backgroundColor: colors.tint } }}></View>
                </View>
                <TextInput
                    label="Username"
                    mode="outlined"
                    placeholder="Username"
                    value={username}
                    activeOutlineColor={colors.tint}
                    outlineColor={colors.secondary}
                    onChangeText={(newUsername) => setUsername(newUsername)}
                    theme={{
                        colors: {
                            text: colors.text,
                            placeholder: colors.text,
                            background: colors.background,
                        }
                    }}
                />
                <TextInput
                    label="Password"
                    mode="outlined"
                    value={password}
                    placeholder="Password"
                    activeOutlineColor={colors.tint}
                    outlineColor={colors.secondary}
                    placeholderTextColor={colors.text}
                    onChangeText={(newPassword) => setPassword(newPassword)}
                    theme={{
                        colors: {
                            text: colors.text,
                            placeholder: colors.text,
                            background: colors.background,
                        }
                    }}
                />
            </View>
            <TouchableOpacity style={{ ...styles.registerButton, ...{ backgroundColor: colors.tint } }} onPress={() => SignInRequest()}>
                <Text style={{ fontSize: 17, fontWeight: "bold" }}>Continue</Text>
            </TouchableOpacity>
            <Text style={styles.errorReason}>{errorReason}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
    },
    topContainer: {
        padding: 15,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center"
    },
    logo: {
        width: 50,
        height: 50,
    },
    mainContainert: {
        paddingTop: "20%",
        paddingHorizontal: 15,
        gap: 10,
    },
    registerButton: {
        padding: 13,
        flexDirection: "row",
        justifyContent: "center",
        margin: 15,
        borderRadius: 5
    },
    titleContainer: {
    },
    titleLine: {
        width: 130,
        height: 5,
        borderRadius: 100
    },
    errorReason: {
        color: "red",
        textAlign: "center",
    }
});