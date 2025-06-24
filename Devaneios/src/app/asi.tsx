import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Response = 'sim' | 'nao' | null;

const AsiScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { isAfterCeremony } = route.params as { isAfterCeremony: boolean };

  const [responses, setResponses] = useState<{ [key: number]: Response }>({});
  const [timestamp, setTimestamp] = useState(new Date().toISOString());

  useEffect(() => {
    setTimestamp(new Date().toISOString());
  }, []);

  const handleResponseChange = (question: number, value: Response) => {
    setResponses(prev => ({ ...prev, [question]: value }));
  };

  const saveResponses = async () => {
    if (Object.values(responses).some(value => value === null || value === undefined)) {
      Alert.alert('Erro', 'Por favor, responda a todas as perguntas.');
      return;
    }

    const asiData = { timestamp, responses, isAfterCeremony };
    try {
      const existingData = await AsyncStorage.getItem('asiResponses');
      const asiResponses = existingData ? JSON.parse(existingData) : [];
      asiResponses.push(asiData);
      await AsyncStorage.setItem('asiResponses', JSON.stringify(asiResponses));
      if (!isAfterCeremony) {
        await AsyncStorage.setItem('asiCompleted', 'true');
      } else {
        await AsyncStorage.setItem('asiPostCeremony', 'true');
      }
      Alert.alert('Sucesso', 'Respostas salvas com sucesso!');
      navigation.reset({ index: 0, routes: [{ name: 'principal' }] });
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar as respostas.');
    }
  };

  const questions = [
    '1) Coisas de menor importância de repente pareceram especialmente importantes ou significativas para você?',
    '2) Você sentiu que estava à beira de algo realmente grande, mas não tinha certeza do que era?',
    '3) Seus sentidos lhe pareceram apurados?',
    '4) Você se sentiu como se estivesse rapidamente chegando ao auge dos seus poderes intelectuais?',
    '5) Você notou pequenos detalhes que não tinha notado antes e que pareceram importantes?',
    '6) Você sentiu que era importante descobrir algo, mas não tinha certeza do que era?',
    '7) Você passou por períodos em que se sentiu especialmente religioso(a) ou místico(a)?',
    '8) Você se dificuldade de identificar se estava empolgado(a), assustado(a), aflito(a) ou ansioso(a)?',
    '9) Você passou por períodos de percepção mais aguçada?',
    '10) Você sentiu a necessidade de dar sentido a situações ou ocorrências aparentemente ao acaso?',
    '11) Você sentiu que estava encontrando a peça que estava faltando em um quebra-cabeça?',
    '12) Você sentiu que podia ouvir com uma clareza maior?',
    '13) Você sentiu que era uma pessoa especialmente evoluída espiritualmente?',
    '14) Observações normalmente insignificantes assumiram um significado ameaçador?',
    '15) Você passou por períodos em que as músicas pareceram ter um significado importante para sua vida?',
    '16) Você atribuiu importância a objetos que você normalmente não faria?',
    '17) Você sentiu que estava prestes a descobrir algo realmente grande ou importante, mas não tinha certeza do que era?',
    '18) Seu paladar parece mais intenso?',
    '19) Você sentiu que segredos estavam sendo revelados para você?',
    '20) Você se sentiu inspirado por coisas ao seu redor?',
    '21) Você sentiu uma conexão especial com o universo?',
    '22) Seus sonhos pareceram mais vívidos ou significativos?',
    '23) Você sentiu que tinha insights profundos sobre si mesmo(a)?',
    '24) Você percebeu padrões em eventos externos que outros não notariam?',
    '25) Você se pegou procurando por significados ocultos?',
    '26) Você sentiu que entendia o mundo de uma forma mais profunda do que fazia normalmente?',
    '27) Você notou que sons ou imagens que normalmente ignoraria chamaram sua atenção?',
    '28) Seus sentidos pareceram mais sensíveis, como se você pudesse perceber mais do ambiente?',
    '29) Percepções ou pensamentos normalmente triviais assumiram um significado especial?'
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Questionário ASI</Text>
      {questions.map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.question}>{question}</Text>
          <View style={styles.scaleContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => handleResponseChange(index + 1, 'sim')}
            >
              <Text style={styles.checkboxText}>{responses[index + 1] === 'sim' ? '✔' : '□'}</Text>
            </TouchableOpacity>
            <Text style={styles.optionText}>Sim</Text>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => handleResponseChange(index + 1, 'nao')}
            >
              <Text style={styles.checkboxText}>{responses[index + 1] === 'nao' ? '✔' : '□'}</Text>
            </TouchableOpacity>
            <Text style={styles.optionText}>Não</Text>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={saveResponses}>
        <Text style={styles.buttonText}>Salvar Respostas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B6D3E7' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '600', color: '#3F789D', textAlign: 'center', marginBottom: 20 },
  questionContainer: { marginBottom: 20 },
  question: { fontSize: 16, color: '#3F789D', marginBottom: 10, fontWeight: '500' },
  scaleContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  checkbox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#93C5FD' },
  checkboxText: { fontSize: 16, color: '#3F789D' },
  optionText: { fontSize: 16, color: '#3F789D' },
  button: { backgroundColor: '#3F789D', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default AsiScreen;