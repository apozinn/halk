import { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Chat } from "@/types";

interface ChatsInterface {
  chats: Chat[];
  updateChats: (newChats: Chat[]) => void;
}

export const ChatsContext = createContext<ChatsInterface>({} as ChatsInterface);

export const ChatsProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loaded, setLoaded] = useState(false);

  const updateChats = async (newChats: Chat[]) => {
    try {
      setChats(newChats);
      await AsyncStorage.setItem("chats", JSON.stringify(newChats));
    } catch (err) {
      console.error("Erro ao salvar chats:", err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("chats");
        if (stored) {
          setChats(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Erro ao carregar chats:", err);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  if (!loaded) return null;

  return (
    <ChatsContext.Provider value={{ chats, updateChats }}>
      {children}
    </ChatsContext.Provider>
  );
};
