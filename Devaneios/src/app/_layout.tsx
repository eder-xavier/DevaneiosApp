import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';

// Definindo os tipos das rotas
export type RootStackParamList = {
  index: undefined;
  cadastro: undefined;
  principal: undefined;
  questionarioSocioeconomico: undefined;
  asi: { isAfterCeremony?: boolean }; // Adicionado isAfterCeremony como opcional
  perfil: undefined;
  esm: { notificationId: string };
};

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.light.primary },
        headerTintColor: '#FFFFFF',
        contentStyle: { backgroundColor: Colors.light.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="cadastro"
        options={{ title: 'Cadastro' }}
      />
      <Stack.Screen
        name="perfil"
        options={{ title: 'Perfil' }}
      />
      <Stack.Screen
        name="principal"
        options={{ headerShown: false }} // Remove o header (incluindo o botão de voltar)
      />
      <Stack.Screen
        name="questionarioSocioeconomico"
        options={{ title: 'Questionário Socioeconômico' }}
      />
      <Stack.Screen
        name="asi"
        options={{ title: 'Questionário ASI' }}
      />
      <Stack.Screen
        name="esm"
        options={{ title: 'Questionário ESM' }}
      />
    </Stack>
  );
}