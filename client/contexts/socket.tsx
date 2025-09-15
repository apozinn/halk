import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from './user';
import { CreateSocketConnection } from '../utils/socket'; 

interface SocketInterface {
  socket: any | null;
}

export const SocketContext = createContext<SocketInterface>({
  socket: null,
});

export const SocketProvider = ({ children }: any) => {
  const { user } = useContext(UserContext);
  const [socket, setSocket] = useState<any | null>(null);

  useEffect(() => {
   
    if (user && user.id) { 
      const newSocket = CreateSocketConnection({ userId: user.id}); 

      if (newSocket) {
        setSocket(newSocket);

        return () => {
          newSocket.disconnect();
        };
      }
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]); 

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};