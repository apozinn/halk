import { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";
import RegisterForPushNotificationsAsync from "@/notifications/notificationsInitializer";

interface UserInterface {
  logged: boolean;
  user: User | null;
  updateUser: (newData: { user?: Partial<User>, logged?: boolean}) => Promise<void>;
}

export const UserContext = createContext<UserInterface>({} as UserInterface);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userState, setUserState] = useState<Omit<UserInterface, "updateUser">>({
    logged: false,
    user: null,
  });
  const [loaded, setLoaded] = useState(false);

  const updateUser = async (newData: { user?: Partial<User>, logged?: boolean}) => {
    setUserState((prev) => {
      let newObject = {
        logged: newData?.logged ?? prev?.logged,
        user: newData?.user as User ?? prev?.user as User
      };
      AsyncStorage.setItem("user", JSON.stringify(newObject)).catch(console.error);
      return newObject;
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

  useEffect(() => {
  if (userState?.user?.id?.length) {
    (async () => {
      const token = await RegisterForPushNotificationsAsync();
    })();
  }
}, [userState?.user?.id]);

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
