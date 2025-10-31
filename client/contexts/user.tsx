import { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";

interface UserInterface {
  logged: boolean;
  user: User | null;
  updateUser: (u: Partial<User>) => Promise<void>;
}

export const UserContext = createContext<UserInterface>({} as UserInterface);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userState, setUserState] = useState<Omit<UserInterface, "updateUser">>({
    logged: false,
    user: null,
  });
  const [loaded, setLoaded] = useState(false);

  const updateUser = async (newData: Partial<User>) => {
    setUserState((prev) => {
      const updated = { ...prev, user: { ...prev.user, ...newData } as User };
      AsyncStorage.setItem("user", JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserState(parsed);
        }
      } catch (err) {
        console.error("error in user context:", err);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  if (!loaded) return null;

  return (
    <UserContext.Provider
      value={{
        ...userState,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
