import { createContext, useContext, useState, useEffect } from "react";
import { UserContext } from "./user";
import { CreateSocketConnection } from "../utils/socket";

export const SocketContext = createContext();
export const SocketProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [socket, setSocket] = useState(
    user.id ? CreateSocketConnection({ userId: user.id }) : {}
  );

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
