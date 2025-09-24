import { useContext, useEffect } from "react";
import { UserContext } from "@/contexts/user";
import { useRouter, Stack } from "expo-router";

export default function VerifyIfUserIsLogged({ children }: { children: React.ReactNode }) {
  const { logged } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (logged) {
      router.replace("/");
    } else {
      router.replace("/welcome/welcome");
    }

    router.replace("/welcome/welcome");
  }, [logged]);

  return children
}
