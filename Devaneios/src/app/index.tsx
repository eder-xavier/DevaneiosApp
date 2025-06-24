import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const IndexScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const requestPermissions = async () => {
      console.log('Solicitando permissões de notificação...');
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('Status da permissão:', status);
      if (status !== 'granted') {
        Alert.alert(
          'Permissões Necessárias',
          'O aplicativo precisa de permissão para enviar notificações. Por favor, permita nas configurações.',
          [
            { text: 'OK', onPress: () => console.log('Permissão negada') },
            { text: 'Abrir Configurações', onPress: () => Notifications.getPermissionsAsync() },
          ]
        );
      } else {
        console.log('Permissões concedidas com sucesso!');
      }
    };

    const checkUser = async () => {
      await requestPermissions(); // Solicita permissão antes de verificar o usuário
      const user = await AsyncStorage.getItem('user');
      if (!user) {
        // Permanece na tela de início se não houver usuário
        console.log('Nenhum usuário encontrado, permanecendo na tela de início.');
      } else {
        navigation.replace('principal'); // Redireciona para principal se usuário existir
      }
    };
    checkUser();
  }, [navigation]);

  const handleStart = () => {
    navigation.navigate('cadastro');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/icon.png')} style={styles.icon} />
        <Text style={styles.title}>Devaneios</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Começar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B6D3E7',
    padding: 24,
  },
  header: {
    position: 'absolute',
    top: 200,
    alignItems: 'center',
  },
  icon: {
    width: 190,
    height: 190,
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2C5D7D',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2C5D7D',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    width: '80%',
    position: 'absolute',
    bottom: 160,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default IndexScreen;