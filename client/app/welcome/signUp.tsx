import { View, Image, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { Text } from "../../components/themed/Themed";
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from "react-native-paper";
import { getColors } from "../../constants/Colors";
import { useState, useContext } from "react";
import { signUp } from "../../middleware/api";
import { UserContext } from "@/contexts/user";
import { useRouter } from "expo-router"; import { t } from "i18next";
import { ThemedSafeAreaView } from "@/components/themed/themedSafeAreaView";

export default function SignUpPage() {
    const { updateUser } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorReason, setErrorReason] = useState("");
    const colors = getColors();
    const navigation = useRouter();

    async function SignUpRequest() {
        const result = await signUp(username, password);
        if (result.created) {
            updateUser({
                logged: true,
                user: result.user
            });
            navigation.navigate("/welcome/createProfile");
        } else {
            setErrorReason(result.reason);
            setUsername("");
            setPassword("");
        }
    }

    return (
        <ThemedSafeAreaView>
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={() => navigation.back()}>
                    <Ionicons name="chevron-back" size={28} color={colors.icon} />
                </TouchableOpacity>
                <Image source={require("../../assets/images/halk.png")} style={styles.logo} />
            </View>
            <View style={styles.mainContainert}>
                <View style={{ ...styles.titleContainer }}>
                    <View style={styles.titleContainer}>
                        <Text style={{ fontSize: 40, fontWeight: "bold" }}>{t("common.signUp")}</Text>
                        <View style={{ ...styles.titleLine, ...{ backgroundColor: colors.tint } }}></View>
                    </View>
                </View>
                <TextInput
                    label={t("common.username")}
                    mode="outlined"
                    value={username}
                    activeOutlineColor={colors.tint}
                    outlineColor={colors.secondary}
                    onChangeText={(newUsername) => setUsername(newUsername)}
                    style={{
                        backgroundColor: colors.background,
                    }}
                    textColor={colors.text}
                />
                <TextInput
                    label={t("common.password")}
                    mode="outlined"
                    value={password}
                    activeOutlineColor={colors.tint}
                    outlineColor={colors.secondary}
                    placeholderTextColor={colors.text}
                    onChangeText={(newPassword) => setPassword(newPassword)}
                    style={{
                        backgroundColor: colors.background,
                    }}
                    textColor={colors.text}
                />
            </View>
            <TouchableOpacity style={{ ...styles.registerButton, ...{ backgroundColor: colors.tint } }} onPress={() => SignUpRequest()}>
                <Text style={{ fontSize: 17, fontWeight: "bold", color: "white" }}>{t("common.continue")}</Text>
            </TouchableOpacity>
            <Text style={styles.errorReason}>{errorReason}</Text>
        </ThemedSafeAreaView>
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
        alignSelf: "flex-start",
        flexDirection: "column",
        gap: 5
    },
    titleLine: {
        height: 5,
        borderRadius: 100
    },
    errorReason: {
        color: "red",
        textAlign: "center",
    }
});