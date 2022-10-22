import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ChatsInterface {
  chats: Array;
  updateUser: Function;
}

export const ChatsContext = createContext<ChatsInterface>({} as ChatsInterface);

export const ChatsProvider = ({ children }: any) => {
  const [loads, setLoads] = useState(0);

  const updateChats = (newChats: any) => {
    setChats({
      chats: newChats.chats,
      updateChats: updateChats,
    });
  };

  const initialValue: ChatsInterface = {
    chats: [],
    updateChats: updateChats,
  };

  const [chats, setChats] = useState<ChatsInterface>(initialValue);

  useEffect(() => {
    AsyncStorage.getItem("chats").then((data: any) => {
      const dt = JSON.parse(data);

      if (dt) {
        updateChats(dt);
      } else updateChats(initialValue);
    });
  }, []);

  useEffect(() => {
    if (chats !== initialValue) {
      AsyncStorage.setItem("chats", JSON.stringify(chats));
    }
    setLoads(loads + 1);
  }, [chats]);

  if (loads === 0) return;

  return (
    <ChatsContext.Provider value={chats}>
      {children}
    </ChatsContext.Provider>
  );
};
