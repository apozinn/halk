import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserInterface {
  logged: boolean;
  newUser: {
    completedTour: Array;
    isNew: boolean;
  };
  user: {
    id: string;
    phone: string;
    profile: {
      name: string;
      username: string;
      avatar: string;
      bio: string;
    };
  };
  updateUser: Function;
}

export const UserContext = createContext<UserInterface>({} as UserInterface);

export const UserProvider = ({ children }: any) => {
  const [loads, setLoads] = useState(0);

  const updateUser = (newUser: any) => {
    AsyncStorage.getItem("user").then((data: any) => {
      var dt = JSON.parse(data);
      setUser({
        logged: newUser.logged ? newUser.logged : dt.logged,
        newUser: newUser.newUser ? newUser.newUser : dt.newUser,
        user: newUser.user ? newUser.user : dt.user,
        updateUser,
      })
    });
  };

  const initialValue: UserInterface = {
    logged: false,
    newUser: {
      completedTour: [],
      isNew: true,
    },
    user: {
      id: "",
      phone: "",
      profile: {
        name: "",
        username: "",
        avatar: "",
        bio: "",
      },
    },
    updateUser: updateUser,
  };

  const [user, setUser] = useState<UserInterface>(initialValue);

  useEffect(() => {
    AsyncStorage.getItem("user").then((data: any) => {
      const dt = JSON.parse(data);

      if (dt) {
        updateUser(dt);
      } else updateUser(initialValue);
    });
  }, []);

  useEffect(() => {
    if (user !== initialValue) {
      AsyncStorage.setItem("user", JSON.stringify(user));
    }

    setLoads(loads + 1);
  }, [user]);

  if (loads === 0) return;

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
