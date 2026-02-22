import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { supabase } from '../utils/supabase'; // Ajuste o path se necessário
import { PublicRoutes } from './public-routes';
import { PrivateRoutes } from './private-routes';
import { Session } from '@supabase/supabase-js';
import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';

export default function Routes() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca a sessão atual ao abrir o app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuta mudanças (Login, Logout, Refresh Token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box className="flex-1 bg-atosBlue justify-center items-center">
        <Spinner size="large" color="$atosAmber" />
      </Box>
    );
  }

  return (
    <NavigationContainer>
      {session ? <PrivateRoutes /> : <PublicRoutes />}
    </NavigationContainer>
  );
}