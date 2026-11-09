import { ThemedSafeAreaView } from "@/components/themed/themedSafeAreaView";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

export default function VideoViewer() {
  const { video } = useLocalSearchParams<{ video?: string }>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const player = useVideoPlayer(video ?? "", (player) => {
    player.loop = false;
    player.muted = false;
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {error && (
        <View style={styles.loaderContainer}>
          <MaterialIcons name="error-outline" size={60} color="#777" />
        </View>
      )}

      {video && !error && (
        <VideoView
          player={player}
          style={{ flex: 1 }}
          contentFit="contain"
          nativeControls
          onFirstFrameRender={() => setLoading(false)}
        />
      )}

      <ThemedSafeAreaView style={styles.overlay}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>
      </ThemedSafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    position: "absolute",
    left: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
