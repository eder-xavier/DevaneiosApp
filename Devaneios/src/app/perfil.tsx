import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PerfilScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataCerimonia, setDataCerimonia] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const data = JSON.parse(user);
        setNome(data.nomeCompleto || '');
        setEmail(data.email || '');
        setSenha(data.senha || '');
        setDataCerimonia(data.dataCerimonia || '');
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    if (!nome || !email || !senha || !dataCerimonia) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    const userData = {
      nomeCompleto: nome,
      email,
      senha,
      dataCerimonia,
      timestamp: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.content}>
        <Text style={styles.title}>Perfil</Text>

        <Text style={styles.label}>Nome *</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>E-mail *</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Senha *</Text>
        <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />

        <Text style={styles.label}>Data de Início da Cerimônia *</Text>
        <TextInput style={styles.input} value={dataCerimonia} onChangeText={setDataCerimonia} placeholder="Exemplo: 23 de junho de 2025" />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B6D3E7',
  },
  contentContainer: {
    paddingBottom: 100,
  },
  content: {
    padding: 26,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#3F789D',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3F789D',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#93C5FD',
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#3F789D',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PerfilScreen;