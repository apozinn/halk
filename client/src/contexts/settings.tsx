import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingsInterface {
  statusSettings: {
    privacity: String;
    duration: String;
  };
  chatsSettings: {
    theme: String;
  };
  updateSettings: Function;
}

export const SettingsContext = createContext<SettingsInterface>(
  {} as SettingsInterface
);

export const SettingsProvider = ({ children }: any) => {
  const [loads, setLoads] = useState(0);

  const updateSettings = (newSettings: any) => {
    setSettings({
      statusSettings: newSettings.statusSettings,
      chatsSettings: newSettings.chatsSettings,
      updateSettings: updateSettings,
    });
  };

  const initialValue: SettingsInterface = {
    statusSettings: {
      privacity: "all",
      duration: "24hrs",
    },
    chatsSettings: {
      theme: "default",
    },
    updateSettings: updateSettings,
  };

  const [settings, setSettings] = useState<SettingsInterface>(initialValue);

  useEffect(() => {
    AsyncStorage.getItem("settings").then((data: any) => {
      const dt = JSON.parse(data);

      if (dt) {
        updateSettings(dt);
      } else updateSettings(initialValue);
    });
  }, []);

  useEffect(() => {
    if (settings !== initialValue) {
      AsyncStorage.setItem("settings", JSON.stringify(settings));
    }
    setLoads(loads + 1);
  }, [settings]);

  if (loads === 0) return;

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};
