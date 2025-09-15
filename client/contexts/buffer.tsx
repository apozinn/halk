import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface BufferInterface {
  statusBuffer: {
    openned: Array;
    posted: Array;
  };
  updateBuffer: Function;
}

export const BufferContext = createContext<BufferInterface>(
  {} as BufferInterface
);

export const BufferProvider = ({ children }: any) => {
  const [loads, setLoads] = useState(0);

  const updateBuffer = (newBuffer: any) => {
    AsyncStorage.getItem("buffer").then((data: any) => {
      const dt = JSON.parse(data);

      setBuffer({
        statusBuffer: newBuffer.statusBuffer
          ? newBuffer.statusBuffer
          : dt.statusBuffer,
        updateBuffer,
      });
    });
  };

  const initialValue: BufferInterface = {
    statusBuffer: {
      openned: [],
      posted: [],
    },
    updateBuffer: updateBuffer,
  };

  const [buffer, setBuffer] = useState<BufferInterface>(initialValue);

  useEffect(() => {
    AsyncStorage.getItem("buffer").then((data: any) => {
      const dt = JSON.parse(data);

      if (dt) {
        updateBuffer(dt);
      } else updateBuffer(initialValue);
    });
  }, []);

  useEffect(() => {
    if (buffer !== initialValue) {
      AsyncStorage.setItem("buffer", JSON.stringify(buffer));
    }
    setLoads(loads + 1);
  }, [buffer]);

  if (loads === 0) return null;

  return (
    <BufferContext.Provider value={buffer}>{children}</BufferContext.Provider>
  );
};
