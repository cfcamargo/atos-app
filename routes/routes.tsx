import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { supabase } from '../utils/supabase'; 
import { PublicRoutes } from './public-routes';
import { PrivateRoutes } from './private-routes';
import { Session } from '@supabase/supabase-js';
import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Routes() {
  const [session, setSession] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error(error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
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
    <NavigationContainer>
      {session ? <PrivateRoutes /> : <PublicRoutes />}
    </NavigationContainer>
  );
}