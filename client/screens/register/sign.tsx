import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { RootStackScreenProps } from "../../types";
import { Text } from "../../src/components/Themed";
import { StatusBar } from 'expo-status-bar';

export default function SignScreen({ navigation }: RootStackScreenProps<"Sign">) {
    return (
        <View style={styles.container}>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 300,
      },
});