import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { supabase } from "../utils/supabase";
import { PublicRoutes } from "./public-routes";
import { PrivateRoutes } from "./private-routes";
import { OnboardingRoutes } from "./onboarding-routes";
import { Session } from "@supabase/supabase-js";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import * as Linking from "expo-linking";

const prefix = Linking.createURL("/");

const linking = {
  prefixes: [prefix, "atosapp://"],
  config: {
    screens: {
      // Configuramos para capturar as rotas padrão se necessário
    },
  },
};

export default function Routes() {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        if (session) {
          const profileCompleted =
            session.user.user_metadata?.profile_completed;
          setIsNewUser(profileCompleted !== true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        const profileCompleted = session.user.user_metadata?.profile_completed;
        setIsNewUser(profileCompleted !== true);
      } else {
        setIsNewUser(false);
      }
      setIsInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isInitialized) {
    return (
      <Box className="flex-1 bg-[#0F172A] justify-center items-center">
        <Spinner size="large" className="text-[#F59E0B]" />
      </Box>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      {!session ? (
        <PublicRoutes />
      ) : isNewUser ? (
        <OnboardingRoutes />
      ) : (
        <PrivateRoutes />
      )}
    </NavigationContainer>
  );
}
