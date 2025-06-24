import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definindo o tipo para as respostas
type ResponseKeys = 'feeling' | 'mindWandering' | 'awareness' | 'pastThoughts' | 'emotionalDistraction';
type Responses = {
  [key in ResponseKeys]: number | null;
};

const EsmScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { notificationId } = route.params as { notificationId: string };

  const [responses, setResponses] = useState<Responses>({
    feeling: null,
    mindWandering: null,
    awareness: null,
    pastThoughts: null,
    emotionalDistraction: null,
  });
  const [timestamp, setTimestamp] = useState(new Date().toISOString());

  useEffect(() => {
    // Define o timestamp quando a tela é aberta
    setTimestamp(new Date().toISOString());
  }, []);

  const handleResponseChange = (question: ResponseKeys, value: number) => {
    setResponses((prev) => ({ ...prev, [question]: value }));
  };

  const saveResponses = async () => {
    if (Object.values(responses).some((value) => value === null)) {
      Alert.alert('Erro', 'Por favor, responda a todas as perguntas.');
      return;
    }

    const esmData = {
      notificationId,
      timestamp,
      responses,
    };

    try {
      const existingData = await AsyncStorage.getItem('esmResponses');
      const esmResponses = existingData ? JSON.parse(existingData) : [];
      esmResponses.push(esmData);
      await AsyncStorage.setItem('esmResponses', JSON.stringify(esmResponses));
      await AsyncStorage.setItem('esmCompleted', 'true'); // Marca como concluído após salvar
      // Recarrega a tela principal para atualizar o estado
      navigation.reset({
        index: 0,
        routes: [{ name: 'principal' }],
      });
      console.log('ESM concluído, botão oculto após salvamento, ID:', notificationId);
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar as respostas.');
    }
  };

  const renderScale = (question: ResponseKeys, label: string) => (
    <View style={styles.questionContainer}>
      <Text style={styles.question}>{label}</Text>
      <View style={styles.scaleContainer}>
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.scaleButton,
              responses[question] === value && styles.selectedScaleButton,
            ]}
            onPress={() => handleResponseChange(question, value)}
          >
            <Text style={[
              styles.scaleText,
              responses[question] === value && styles.selectedText,
            ]}>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Questionário ESM</Text>
      {renderScale('feeling', '1) Como você está se sentindo agora? (1: horrível, 5: incrível)')}
      {renderScale('mindWandering', '2) Quando você recebeu esta notificação, qual o nível de divagação da sua mente? (1: nem um pouco/estava completamente focado, 5: completamente, minha mente estava em outro lugar)')}
      {renderScale('awareness', '3) A que nível você estava ciente de onde estava a sua atenção? (1: nem um pouco, 5: completamente ciente)')}
      {renderScale('pastThoughts', '4) Quando você recebeu esta notificação, a que nível você estava pensando em coisas que aconteceram? (1: nem um pouco, 5: bastante)')}
      {renderScale('emotionalDistraction', '5) Quando você recebeu esta notificação, a que nível você estava distraído com seus sentimentos? (1: nem um pouco, 5: bastante)')}
      <TouchableOpacity style={styles.button} onPress={saveResponses}>
        <Text style={styles.buttonText}>Salvar Respostas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B6D3E7',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#3F789D',
    textAlign: 'center',
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    color: '#3F789D',
    marginBottom: 10,
    fontWeight: '500',
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  selectedScaleButton: {
    backgroundColor: '#3F789D',
  },
  scaleText: {
    fontSize: 16,
    color: '#3F789D',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#3F789D',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EsmScreen;