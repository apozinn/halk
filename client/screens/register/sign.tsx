import { View, Image, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { RootStackScreenProps } from "../../types";
import { Text } from "../../src/components/Themed";
import { Ionicons } from '@expo/vector-icons';
import { TextInput, Button } from "react-native-paper";
import { getColors } from "../../constants/Colors";
import { useState } from "react";

export default function SignScreen({ navigation }: RootStackScreenProps<"Sign">) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const colors = getColors();

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color="white" />
                </TouchableOpacity>
                <Image source={require("../../assets/images/halk_icon.png")} style={styles.logo} />
            </View>

            <View style={styles.mainContainert}>
                <Text style={{ fontSize: 40, fontWeight: "bold" }}>Sign</Text>
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
                    label="Email"
                    mode="outlined"
                    value={email}
                    placeholder="Email"
                    activeOutlineColor={colors.tint}
                    outlineColor={colors.secondary}
                    placeholderTextColor={colors.text}
                    onChangeText={(newEmail) => setEmail(newEmail)}
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
            <TouchableOpacity style={{ ...styles.registerButton, ...{ backgroundColor: colors.tint } }} onPress={() => navigation.navigate("Root")}>
                <Text style={{ fontSize: 17, fontWeight: "bold" }}>Continue</Text>
            </TouchableOpacity>
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
});