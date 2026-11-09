import { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { Text } from "@/components/themed/Themed";
import { getColors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ThemedSafeAreaView } from "@/components/themed/themedSafeAreaView";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { t } = useTranslation();
  const router = useRouter();
  const colors = getColors();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  async function takePhoto() {
    if (!cameraRef.current) return;
    setLoading(true);
    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.7 });

      router.navigate({
        pathname: "camera/captured",
        params: {
          imageUri: result.uri
        }
      });
    } finally {
      setLoading(false);
    }
  }

  if (!permission) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedSafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <Text>{t("camera.permissionDenied")}</Text>
        <Pressable
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>{t("camera.grantPermission")}</Text>
        </Pressable>
      </ThemedSafeAreaView>
    );
  }

  return (
    <ThemedSafeAreaView style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      <View style={styles.controls}>
        <Pressable
          style={[styles.captureButton, { borderColor: colors.tint }]}
          onPress={takePhoto}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.tint} />
          ) : (
            <MaterialIcons name="camera-alt" size={32} color={colors.tint} />
          )}
        </Pressable>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={28} color={colors.tint} />
        </Pressable>
        <Pressable
          style={styles.flipButton}
          onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
        >
          <MaterialCommunityIcons name="camera-flip-outline" size={28} color={colors.tint} />
        </Pressable>
      </View>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 70,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 30,
  },
  flipButton: {
    position: "absolute",
    right: 30,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewText: {
    fontSize: 16,
    opacity: 0.8,
  },
});
