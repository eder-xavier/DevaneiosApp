import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Platform, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { DateTriggerInput, TimeIntervalTriggerInput } from 'expo-notifications';
import { SvgXml } from 'react-native-svg';

// Configuração do handler de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowList: true,
  }),
});

// Definindo a interface para os dados da notificação
interface NotificationData {
  type: string;
  notificationId?: string;
  [key: string]: unknown;
}

// SVG do ícone de perfil
const profileIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
  <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/>
</svg>
`;

const PrincipalScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isAfterCeremony, setIsAfterCeremony] = useState(false);
  const [userData, setUserData] = useState<{ dataCerimonia: string } | null>(null);
  const [showEsmButton, setShowEsmButton] = useState(false);
  const [showAsiButton, setShowAsiButton] = useState(false);
  const [notificationId, setNotificationId] = useState<string>('default');
  const [socioeconomicoCompleted, setSocioeconomicoCompleted] = useState(false);
  const [asiCompleted, setAsiCompleted] = useState(false);
  const [showSocioeconomicoButton, setShowSocioeconomicoButton] = useState(true);
  const isInitialized = useRef(false);

  // Cálculo de backgroundImage e colors dentro do componente
  const backgroundImage = isAfterCeremony && socioeconomicoCompleted && asiCompleted
    ? require('../../assets/images/background_after.png')
    : require('../../assets/images/background_before.png');

  const colors = isAfterCeremony && socioeconomicoCompleted && asiCompleted
    ? { primary: '#2D602D', secondary: '#4F8B4F', accent: '#7BB47B', background: '#A8DDAB', highlight: '#3C753C' }
    : { primary: '#2C5D7D', secondary: '#568CAD', accent: '#8CB5CF', background: '#B6D3E7', highlight: '#3F789D' };

  useEffect(() => {
    if (isInitialized.current) return;

    const initialize = async () => {
      const user = await AsyncStorage.getItem('user');
      console.log('Usuário encontrado no AsyncStorage:', user ? 'Sim' : 'Não', 'Dados:', user);
      if (!user) {
        navigation.replace('index');
        console.log('Nenhum usuário encontrado, permanecendo na tela de início.');
        return;
      }

      if (!(await AsyncStorage.getItem('permissionsRequested'))) {
        console.log('Solicitando permissões de notificação no Principal...');
        const { status } = await Notifications.requestPermissionsAsync();
        console.log('Status da permissão no Principal:', status);
        if (status !== 'granted') {
          Alert.alert('Permissões Necessárias', 'O aplicativo precisa de permissão para enviar notificações.');
        } else {
          console.log('Permissões concedidas com sucesso!');
        }
        await AsyncStorage.setItem('permissionsRequested', 'true');
      }

      const data = await AsyncStorage.getItem('user');
      if (data) {
        const parsedData = JSON.parse(data);
        setUserData(parsedData);
        const ceremonyDate = new Date(parsedData.dataCerimonia);
        setIsAfterCeremony(new Date() > ceremonyDate);
        console.log('Dados do usuário carregados:', parsedData);
      }
      const socioeconomico = await AsyncStorage.getItem('socioeconomico');
      setSocioeconomicoCompleted(!!socioeconomico);
      setShowSocioeconomicoButton(!socioeconomico);

      const asiCompletedStatus = await AsyncStorage.getItem('asiCompleted');
      const asiPostCeremony = await AsyncStorage.getItem('asiPostCeremony');
      setAsiCompleted(!!asiCompletedStatus);
      if (!asiCompletedStatus && !isAfterCeremony) {
        setShowAsiButton(true); // Mostra antes da cerimônia
      } else if (asiCompletedStatus && isAfterCeremony && !asiPostCeremony) {
        setShowAsiButton(true); // Mostra um dia após para novo preenchimento
      } else {
        setShowAsiButton(false);
      }

      const esmCompleted = await AsyncStorage.getItem('esmCompleted');
      if (!esmCompleted) {
        setShowEsmButton(true);
        console.log('ESM não concluído, botão visível.');
      } else {
        setShowEsmButton(false);
        console.log('ESM já concluído, botão oculto.');
      }

      // Notificação de Boas-vindas
      const welcomeShown = await AsyncStorage.getItem('welcomeShown');
      if (!welcomeShown) {
        await Notifications.scheduleNotificationAsync({
          content: { title: 'Bem-vindo ao Devaneios!', body: 'Obrigado por usar nosso aplicativo.', data: { type: 'welcome' } },
          trigger: null,
        });
        await AsyncStorage.setItem('welcomeShown', 'true');
        console.log('Notificação de boas-vindas enviada!');
      }

      // Notificação ESM Inicial
      const initialEsmShown = await AsyncStorage.getItem('initialEsmShown');
      if (!initialEsmShown) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await Notifications.scheduleNotificationAsync({
          content: { title: 'Devaneios', body: 'Preencha o Questionário ESM!', data: { type: 'initial-esm', notificationId: 'initial-esm' } },
          trigger: null,
        });
        await AsyncStorage.setItem('initialEsmShown', 'true');
        console.log('Notificação ESM inicial enviada!');
      }

      // Notificação ASI Lembrete (dia da cerimônia)
      const asiReminderShown = await AsyncStorage.getItem('asiReminderShown');
      if (userData && !asiReminderShown && !asiCompleted) {
        const reminderDate = new Date(userData.dataCerimonia);
        reminderDate.setHours(9, 0, 0, 0);
        await Notifications.scheduleNotificationAsync({
          content: { title: 'Lembrete', body: 'Preencha o Questionário ASI antes da cerimônia!', data: { type: 'asi-reminder' } },
          trigger: { type: 'date', date: reminderDate } as DateTriggerInput,
        });
        await AsyncStorage.setItem('asiReminderShown', 'true');
        console.log('Notificação ASI lembrete agendada.');
      }

      const scheduleEsmNotifications = async () => {
        const scheduledKey = 'esmNotificationsScheduled';
        if (await AsyncStorage.getItem(scheduledKey)) return;
        const now = new Date('2025-06-24T18:27:00.000Z');
        const startDate = new Date(now); startDate.setDate(now.getDate() + 1);
        await Notifications.cancelAllScheduledNotificationsAsync();
        for (let day = 0; day < 4; day += 2) {
          const triggerDate = new Date(startDate); triggerDate.setDate(startDate.getDate() + day);
          let lastTriggerTime = 9 * 60 * 60 * 1000;
          for (let i = 0; i < 8; i++) {
            let triggerTime = 9 * 60 * 60 * 1000 + Math.random() * (21 - 9) * 60 * 60 * 1000;
            if (i > 0) triggerTime = Math.max(triggerTime, lastTriggerTime + 17 * 60 * 1000);
            lastTriggerTime = triggerTime;
            const trigger = new Date(triggerDate); trigger.setHours(0, 0, 0, 0); trigger.setMilliseconds(trigger.getMilliseconds() + triggerTime);
            await Notifications.scheduleNotificationAsync({
              content: { title: 'Devaneios', body: 'É hora de preencher o Questionário ESM!', data: { type: 'esm', notificationId: `esm-${day}-${i}` } },
              trigger: { type: 'date', date: trigger } as DateTriggerInput,
            });
          }
        }
        await AsyncStorage.setItem(scheduledKey, 'true');
      };

      const scheduleSocioeconomicoReminder = async () => {
        const reminderKey = 'socioeconomicoReminderScheduled';
        if (!socioeconomicoCompleted && !(await AsyncStorage.getItem(reminderKey))) {
          const reminderDate = new Date('2025-06-24T18:27:00.000Z'); reminderDate.setDate(reminderDate.getDate() + 1); reminderDate.setHours(9, 0, 0, 0);
          await Notifications.scheduleNotificationAsync({
            content: { title: 'Lembrete', body: 'Preencha o Questionário Socioeconômico!', data: { type: 'reminder' } },
            trigger: { type: 'date', date: reminderDate } as DateTriggerInput,
          });
          await AsyncStorage.setItem(reminderKey, 'true');
        }
      };

      await scheduleEsmNotifications();
      await scheduleSocioeconomicoReminder();

      const subscription = Notifications.addNotificationReceivedListener((notification) => {
        const data = notification.request.content.data as NotificationData;
        console.log('Notificação recebida - Dados:', data);
        if (data.type === 'esm' || data.type === 'initial-esm') {
          setNotificationId(data.notificationId || 'default');
          setShowEsmButton(true);
          console.log('Botão ESM ativado para tipo:', data.type, 'ID:', data.notificationId);
        }
      });

      const responseSubscription = Notifications.addNotificationResponseReceivedListener(async (response) => {
        const data = response.notification.request.content.data as NotificationData;
        const esmCompleted = await AsyncStorage.getItem('esmCompleted');
        if (data.type === 'esm' || data.type === 'initial-esm') {
          if (esmCompleted) {
            Alert.alert('Aviso', 'Este questionário já foi preenchido.');
          } else {
            navigation.navigate('esm', { notificationId: data.notificationId || 'default' });
          }
        }
      });

      isInitialized.current = true;
      return () => { subscription.remove(); responseSubscription.remove(); };
    };

    initialize().catch(error => console.error('Erro na inicialização:', error));
  }, [navigation]);

  const handleEsmSubmit = async () => {
    if (showEsmButton) {
      const esmCompleted = await AsyncStorage.getItem('esmCompleted');
      if (esmCompleted) {
        Alert.alert('Aviso', 'Este questionário já foi preenchido.');
      } else {
        navigation.navigate('esm', { notificationId });
      }
    }
  };

  const handleSocioeconomicoSubmit = () => {
    if (!socioeconomicoCompleted) {
      navigation.navigate('questionarioSocioeconomico');
    } else {
      Alert.alert('Aviso', 'Este questionário já foi preenchido.');
    }
  };

  const handleAsiSubmit = async () => {
    if (showAsiButton) {
      const asiCompleted = await AsyncStorage.getItem('asiCompleted');
      if (asiCompleted && !isAfterCeremony) {
        Alert.alert('Aviso', 'Este questionário já foi preenchido antes da cerimônia.');
      } else {
        navigation.navigate('asi', { isAfterCeremony });
      }
    }
  };

  const handleProfilePress = () => {
    if (!socioeconomicoCompleted || !asiCompleted) {
      Alert.alert('Aviso', 'Preencha os questionários Socioeconômico e ASI antes de prosseguir.');
    } else {
      navigation.navigate('perfil');
    }
  };

  const clearStorage = async () => {
    await AsyncStorage.clear();
    setSocioeconomicoCompleted(false);
    setShowSocioeconomicoButton(true);
    setShowEsmButton(false);
    setAsiCompleted(false);
    setShowAsiButton(false);
    Alert.alert('Sucesso', 'Dados do AsyncStorage limpos. Recarregue o app para reiniciar.');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
            <SvgXml xml={profileIconSvg} width="40" height="40" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Devaneios</Text>
        <View style={styles.buttonContainer}>
          {showEsmButton && (
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.secondary }]} onPress={handleEsmSubmit}>
              <Text style={styles.iconText}>🦜 Preencher Questionário ESM</Text>
            </TouchableOpacity>
          )}
          {showSocioeconomicoButton && (
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.secondary }]} onPress={handleSocioeconomicoSubmit}>
              <Text style={styles.iconText}>📊 Questionário Socioeconômico</Text>
            </TouchableOpacity>
          )}
          {showAsiButton && (
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.secondary }]} onPress={handleAsiSubmit}>
              <Text style={styles.iconText}>🍂 Preencher Questionário ASI</Text>
            </TouchableOpacity>
          )}
          {__DEV__ && (
            <Button title="Limpar Dados (Dev)" onPress={clearStorage} color="#FF4444" />
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  header: { position: 'absolute', top: 53, right: 20 },
  title: {
    fontSize: 52, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', marginBottom: 50, marginTop: -100,
    letterSpacing: 2, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2,
  },
  profileIcon: { padding: 10 },
  buttonContainer: { marginTop: 20, width: '80%' },
  iconButton: { padding: 12, borderRadius: 8, marginBottom: 30, alignItems: 'center' },
  iconText: { color: '#FFFFFF', fontSize: 16 },
  esmButton: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 8, marginBottom: 30, alignItems: 'center' },
  esmButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default PrincipalScreen;