import { useContext, useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { UserContext } from "@/contexts/user";

export default function VerifyIfUserIsLogged({ children }: { children: React.ReactNode }) {
  const { logged } = useContext(UserContext);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "welcome";

    if (!logged && !inAuthGroup) {
      router.replace("/welcome/welcome");
    } else if (logged && inAuthGroup) {
      router.replace("/");
    }
  }, [logged, segments]);

  return children;
}
