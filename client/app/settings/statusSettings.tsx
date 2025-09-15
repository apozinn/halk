import { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Switch, ScrollView } from "react-native";
import { Text } from "@/components/ui/Themed";
import {
	Menu,
	MenuOptions,
	MenuOption,
	MenuTrigger,
} from "react-native-popup-menu";
import { getColors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function StatusSettings() {
	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
	const [checked, setChecked] = useState(false);
	const colors = getColors();

	const optionsStyles = {
		optionsContainer: {
			backgroundColor: colors.defaultColors.card,
			padding: 5,
			top: 0,
			width: 110,
		},
	};
	const optionStyles = {
		optionText: {
			color: colors.text,
			fontSize: 17,
			fontWeight: 'bold' as 'bold',
		},
	};

	return (
		<View style={styles.container}>
			<ScrollView>
				<View style={styles.configBlock}>
					<View style={styles.configTexts}>
						<Text style={styles.configTitle}>
							Permitir download de mídia
						</Text>
						<Text style={styles.configDescription}>
							Permitir que usuários façam o download dos seus
							status
						</Text>
					</View>
					<Switch
						trackColor={{ false: "#767577", true: "#81b0ff" }}
						thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
						ios_backgroundColor="#3e3e3e"
						onValueChange={toggleSwitch}
						value={isEnabled}
					/>
				</View>
				<View style={styles.configBlock}>
					<View style={styles.configTexts}>
						<Text style={styles.configTitle}>
							Permitir respostas
						</Text>
						<Text style={styles.configDescription}>
							Permitir que usuários respondam aos status
						</Text>
					</View>
					<Switch
						trackColor={{ false: "#767577", true: "#81b0ff" }}
						thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
						ios_backgroundColor="#3e3e3e"
						onValueChange={toggleSwitch}
						value={isEnabled}
					/>
				</View>
				<View style={styles.configBlock}>
					<View style={styles.configTexts}>
						<Text style={styles.configTitle}>Tempo de remoção</Text>
						<Text style={styles.configDescription}>
							Selecione em quanto tempo os status serão removidos
						</Text>
					</View>
					<Menu>
						<MenuTrigger>
							<View
								style={[
									styles.customDeleteView,
									{
										backgroundColor: colors.background,
										borderColor:
											colors.defaultColors.border,
									},
								]}
							>
								<Text
									style={{
										marginRight: 5,
										fontWeight: "bold",
									}}
								>
									12 horas
								</Text>
								<MaterialIcons
									name="keyboard-arrow-down"
									size={25}
									color={colors.tint}
								/>
							</View>
						</MenuTrigger>
						<MenuOptions customStyles={optionsStyles}>
							<MenuOption
								onSelect={() => alert(`Save`)}
								text="1 hora"
								customStyles={optionStyles}
							/>
							<MenuOption
								onSelect={() => alert(`Save`)}
								text="12 horas"
								customStyles={optionStyles}
							/>
							<MenuOption
								onSelect={() => alert(`Save`)}
								text="1 dia"
								customStyles={optionStyles}
							/>
							<MenuOption
								onSelect={() => alert(`Save`)}
								text="2 dias"
								customStyles={optionStyles}
							/>
						</MenuOptions>
					</Menu>
				</View>

				<View style={{ padding: 10, marginBottom: 10 }}>
					<View style={styles.configTexts}>
						<Text style={styles.configTitle}>
							Privacidade de status
						</Text>
						<Text style={styles.configDescription}>
							Quem pode visualizar seus status
						</Text>
					</View>
					<View style={styles.checkView}>
						<RadioButton
							value={checked ? "checked" : "unchecked"}
							onPress={() => {
								setChecked(!checked);
							}}
						/>
						<Text style={styles.checkText}>
							Todos que tenho adicionados
						</Text>
					</View>
					<View style={styles.checkView}>
						<RadioButton
							value={checked ? "checked" : "unchecked"}
							onPress={() => {
								setChecked(!checked);
							}}
						/>
						<Text style={styles.checkText}>
							Todos que tenho adicionados
						</Text>
					</View>
					<View style={styles.checkView}>
						<RadioButton
							value={checked ? "checked" : "unchecked"}
							onPress={() => {
								setChecked(!checked);
							}}
						/>
						<Text style={styles.checkText}>
							Todos que tenho adicionados
						</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	configBlock: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		marginBottom: 5,
		justifyContent: "space-between",
	},
	configTexts: {
		maxWidth: "75%",
	},
	configTitle: {
		fontWeight: "bold",
		fontSize: 15,
	},
	configDescription: {
		fontSize: 12,
	},
	customDeleteView: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		padding: 5,
		borderRadius: 10,
	},
	checkView: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 5,
	},
	checkText: {
		fontWeight: "bold",
	},
});
