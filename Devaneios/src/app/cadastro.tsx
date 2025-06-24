import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const CadastroScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataCerimonia, setDataCerimonia] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    if (!nome || !email || !senha || !dataCerimonia) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    const today = new Date('2025-06-22T16:15:00-03:00'); // Data e hora atuais
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3); // Mínimo 3 dias depois (25/06/2025)
    const selectedDate = new Date(dataCerimonia);

    if (selectedDate < minDate) {
      Alert.alert('Erro', 'A data de início da cerimônia deve ser pelo menos 3 dias após o cadastro (a partir de 25/06/2025).');
      return;
    }

    const userData = {
      nomeCompleto: nome,
      email,
      senha,
      dataCerimonia: selectedDate.toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.replace('principal'); // Redireciona permanentemente para principal
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados.');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDataCerimonia(selectedDate);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <ImageBackground source={require('../../assets/images/background_before.png')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Cadastro</Text>

          <Text style={styles.label}>Nome *</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} />

          <Text style={styles.label}>E-mail *</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

          <Text style={styles.label}>Senha *</Text>
          <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />

          <Text style={styles.label}>Data de Início da Cerimônia *</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text style={styles.dateText}>{formatDate(dataCerimonia) || 'Selecione a data'}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dataCerimonia || new Date()}
              mode="date"
              display="default"
              minimumDate={new Date('2025-06-25T00:00:00-03:00')} // Mínimo 25/06/2025
              onChange={onDateChange}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: 'rgba(140, 181, 207, 0.7)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(85px)',
    borderRadius: 12,
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C5D7D',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#2C5D7D',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#8CB5CF',
    fontSize: 16,
    fontWeight: '400',
    color: '#2C5D7D',
  },
  dateText: {
    color: '#2C5D7D',
    fontSize: 16,
    padding: 16,
  },
  button: {
    backgroundColor: '#2C5D7D',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CadastroScreen;