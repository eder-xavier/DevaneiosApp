import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { DateTriggerInput } from 'expo-notifications';

export default function QuestionarioSocioeconomicoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState('');
  const [corPele, setCorPele] = useState('');
  const [escolaridade, setEscolaridade] = useState('');
  const [rendaFamiliar, setRendaFamiliar] = useState('');
  const [pessoasRenda, setPessoasRenda] = useState('');
  const [telefone, setTelefone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [linguaMaterna, setLinguaMaterna] = useState('');
  const [estado, setEstado] = useState('');
  const [condicoesSaude, setCondicoesSaude] = useState<string[]>([]);
  const [usaMedicamento, setUsaMedicamento] = useState('');
  const [medicamentos, setMedicamentos] = useState('');
  const [xicarasCafe, setXicarasCafe] = useState('');
  const [tempoSemCafe, setTempoSemCafe] = useState('');
  const [frequenciaTabaco, setFrequenciaTabaco] = useState('');
  const [tempoSemTabaco, setTempoSemTabaco] = useState('');
  const [unidadesAlcool, setUnidadesAlcool] = useState('');
  const [tempoSemAlcool, setTempoSemAlcool] = useState('');
  const [frequenciaCannabis, setFrequenciaCannabis] = useState('');
  const [tempoSemCannabis, setTempoSemCannabis] = useState('');
  const [frequenciaPsicodelicos, setFrequenciaPsicodelicos] = useState('');
  const [tempoSemPsicodelicos, setTempoSemPsicodelicos] = useState('');
  const [mdma, setMdma] = useState('');
  const [estimulantes, setEstimulantes] = useState('');
  const [opioides, setOpioides] = useState('');
  const [sedativos, setSedativos] = useState('');
  const [substancia1, setSubstancia1] = useState('');
  const [quando1, setQuando1] = useState('');
  const [dose1, setDose1] = useState('');
  const [substancia2, setSubstancia2] = useState('');
  const [quando2, setQuando2] = useState('');
  const [dose2, setDose2] = useState('');

  const [ayahuasca, setAyahuasca] = useState('');
  const [dmtCristais, setDmtCristais] = useState('');
  const [changa, setChanga] = useState('');
  const [vinhoJurema, setVinhoJurema] = useState('');
  const [rapeDmt, setRapeDmt] = useState('');
  const [meoDmt, setMeoDmt] = useState('');
  const [lsd, setLsd] = useState('');
  const [psilocibina, setPsilocibina] = useState('');
  const [mescalina, setMescalina] = useState('');

  useEffect(() => {
    const checkSubmission = async () => {
      const socioeconomico = await AsyncStorage.getItem('socioeconomico');
      if (socioeconomico) {
        navigation.replace('principal'); // Redireciona diretamente se já preenchido
      }
    };
    checkSubmission();
  }, [navigation]);

  const handleSubmit = async () => {
    const isMedicamentosRequired = usaMedicamento === 'Sim' && !medicamentos;
    if (!email || !nomeCompleto || !dataNascimento || !idade || !sexo || !corPele || !escolaridade || !rendaFamiliar || !pessoasRenda || !telefone || !whatsapp || !linguaMaterna || !estado || !usaMedicamento || !xicarasCafe || !tempoSemCafe || !frequenciaTabaco || !tempoSemTabaco || !unidadesAlcool || !tempoSemAlcool || !frequenciaCannabis || !tempoSemCannabis || !frequenciaPsicodelicos || !tempoSemPsicodelicos || !mdma || !estimulantes || !opioides || !sedativos || !substancia1 || !quando1 || !dose1 || !substancia2 || !quando2 || !dose2 || !ayahuasca || !dmtCristais || !changa || !vinhoJurema || !rapeDmt || !meoDmt || !lsd || !psilocibina || !mescalina || isMedicamentosRequired) {
      if (isMedicamentosRequired) {
        Alert.alert('Erro', 'Por favor, informe quais medicamentos você faz uso se respondeu "Sim" à pergunta 15.');
      } else {
        Alert.alert('Erro', 'Todos os campos são obrigatórios. Por favor, preencha todos os itens.');
      }
      return;
    }

    const socioeconomicoData = {
      email,
      nomeCompleto,
      dataNascimento,
      idade,
      sexo,
      corPele,
      escolaridade,
      rendaFamiliar,
      pessoasRenda,
      telefone,
      whatsapp,
      linguaMaterna,
      estado,
      condicoesSaude,
      usaMedicamento,
      medicamentos,
      xicarasCafe,
      tempoSemCafe,
      frequenciaTabaco,
      tempoSemTabaco,
      unidadesAlcool,
      tempoSemAlcool,
      frequenciaCannabis,
      tempoSemCannabis,
      frequenciaPsicodelicos,
      tempoSemPsicodelicos,
      mdma,
      estimulantes,
      opioides,
      sedativos,
      substancia1,
      quando1,
      dose1,
      substancia2,
      quando2,
      dose2,
      ayahuasca,
      dmtCristais,
      changa,
      vinhoJurema,
      rapeDmt,
      meoDmt,
      lsd,
      psilocibina,
      mescalina,
      timestamp: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem('socioeconomico', JSON.stringify(socioeconomicoData));
      await Notifications.cancelAllScheduledNotificationsAsync();
      Alert.alert('Sucesso', 'Questionário Socioeconômico enviado com sucesso! Sua conta foi criada.');
      navigation.replace('principal'); // Redireciona permanentemente para principal
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.content}>
        <Text style={styles.title}>Questionário Socioeconômico</Text>

        <Text style={styles.question}>1. E-mail *</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.question}>2. Qual é o seu nome completo? *</Text>
        <TextInput style={styles.input} value={nomeCompleto} onChangeText={setNomeCompleto} />

        <Text style={styles.question}>3. Data de nascimento: * (Exemplo: 7 de janeiro de 2019)</Text>
        <TextInput style={styles.input} value={dataNascimento} onChangeText={setDataNascimento} />

        <Text style={styles.question}>4. Qual a sua idade? *</Text>
        <TextInput style={styles.input} value={idade} onChangeText={setIdade} keyboardType="numeric" />

        <Text style={styles.question}>5. Por favor, qual o sexo atribuído ao seu nascimento? *</Text>
        {['Masculino', 'Feminino', 'Outro:'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, sexo === option && styles.selectedOption]}
            onPress={() => setSexo(option)}
          >
            <Text style={[styles.optionText, sexo === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>6. Com qual cor de pele você se auto-declara? *</Text>
        {['Preta', 'Parda', 'Branca', 'Indígena', 'Amarela', 'Prefiro não declarar', 'Outro:'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, corPele === option && styles.selectedOption]}
            onPress={() => setCorPele(option)}
          >
            <Text style={[styles.optionText, corPele === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>7. Qual sua escolaridade? *</Text>
        {['Não estudei', 'Ensino Fundamental Incompleto', 'Ensino Fundamental Completo', 'Ensino Médio Incompleto', 'Ensino Médio Completo', 'Ensino Superior Incompleto', 'Ensino Superior Completo', 'Pós-graduação Incompleta', 'Pós-graduação Completa', 'Outro:'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, escolaridade === option && styles.selectedOption]}
            onPress={() => setEscolaridade(option)}
          >
            <Text style={[styles.optionText, escolaridade === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>8. Qual a renda familiar mensal em salários mínimos? (SM = R$ 1.518) *</Text>
        {['Menos que 1', '1', 'De 1 a 2', 'De 2 a 3', 'De 3 a 5', 'De 5 a 10', 'Mais de 10', 'Prefiro não dizer', 'Outro:'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, rendaFamiliar === option && styles.selectedOption]}
            onPress={() => setRendaFamiliar(option)}
          >
            <Text style={[styles.optionText, rendaFamiliar === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>9. Quantas pessoas contribuem para esta renda? *</Text>
        <TextInput style={styles.input} value={pessoasRenda} onChangeText={setPessoasRenda} keyboardType="numeric" />

        <Text style={styles.question}>10. Qual o seu telefone? * (Lembre-se de colocar o DDD)</Text>
        <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

        <Text style={styles.question}>11. Seu telefone tem whatsapp? *</Text>
        {['Sim', 'Não'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, whatsapp === option && styles.selectedOption]}
            onPress={() => setWhatsapp(option)}
          >
            <Text style={[styles.optionText, whatsapp === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>12. Qual sua língua materna? *</Text>
        {['Português', 'Espanhol', 'Outro:'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, linguaMaterna === option && styles.selectedOption]}
            onPress={() => setLinguaMaterna(option)}
          >
            <Text style={[styles.optionText, linguaMaterna === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>13. Você mora em qual estado do Brasil? *</Text>
        {['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins', 'Não resido no Brasil'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, estado === option && styles.selectedOption]}
            onPress={() => setEstado(option)}
          >
            <Text style={[styles.optionText, estado === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>14. Assinale as alternativas que se encaixem com sua condição de saúde ATUAL *</Text>
        {['Insuficiência Cardíaca, Hepática ou Renal', 'Hipertensão arterial (pressão alta)', 'Doença Pulmonar Obstrutiva Crônica (DPOC) ou Asma em atividade', 'Obesidade grave (IMC > 40 kg/m²)', 'Epilepsia ou convulsões', 'Hipo ou hipertireoidismo', 'Transtorno Afetivo Bipolar tipo I ou II', 'Esquizofrenia', 'Uso problemático ou abuso de álcool e/ou outras drogas', 'Transtorno dissociativo', 'Depressão', 'Nenhuma das alternativas anteriores', 'Outro:'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, condicoesSaude.includes(option) && styles.selectedOption]}
            onPress={() => {
              setCondicoesSaude(prev => prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]);
            }}
          >
            <Text style={[styles.optionText, condicoesSaude.includes(option) && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>15. No momento faz uso de algum medicamento? *</Text>
        {['Sim', 'Não'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, usaMedicamento === option && styles.selectedOption]}
            onPress={() => setUsaMedicamento(option)}
          >
            <Text style={[styles.optionText, usaMedicamento === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}
        {usaMedicamento === 'Sim' && (
          <TextInput style={styles.input} placeholder="16. Se fizer, por favor, nos diga qual ou quais medicamentos faz uso" value={medicamentos} onChangeText={setMedicamentos} />
        )}

        <Text style={styles.question}>17. Quantas xícaras de café você consome por dia? *</Text>
        <TextInput style={styles.input} value={xicarasCafe} onChangeText={setXicarasCafe} keyboardType="numeric" />

        <Text style={styles.question}>18. Quanto tempo você consegue ficar sem consumir café sem ficar com abstinência (sentir falta)? *</Text>
        {['menos que 3h', '3h', '6h', '12h', '24h', 'mais que 24h', 'Não consumo'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, tempoSemCafe === option && styles.selectedOption]}
            onPress={() => setTempoSemCafe(option)}
          >
            <Text style={[styles.optionText, tempoSemCafe === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>19. Qual sua frequência de uso de tabaco (p.ex. cigarros, rapé)? *</Text>
        {['diária', 'cada 3 dias', 'cada semana', 'cada 2 semanas', 'cada mês', 'menos de cada mês', 'nunca'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, frequenciaTabaco === option && styles.selectedOption]}
            onPress={() => setFrequenciaTabaco(option)}
          >
            <Text style={[styles.optionText, frequenciaTabaco === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>20. Quanto tempo você consegue ficar sem consumir tabaco sem ficar com abstinência (sentir falta)? *</Text>
        {['menos que 3h', '3h', '6h', '12h', '24h', 'mais de 24h', 'Não faço uso de tabaco'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, tempoSemTabaco === option && styles.selectedOption]}
            onPress={() => setTempoSemTabaco(option)}
          >
            <Text style={[styles.optionText, tempoSemTabaco === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>21. Quantas unidades de bebida alcoólica você consome por mês? (p.ex. latinhas de cerveja, taças de vinho, copos de cachaça, etc) *</Text>
        <TextInput style={styles.input} value={unidadesAlcool} onChangeText={setUnidadesAlcool} keyboardType="numeric" />

        <Text style={styles.question}>22. Quanto tempo você consegue ficar sem consumir álcool sem ficar com abstinência (sentir falta)? *</Text>
        {['menos de 1 dia', '1 dia', '7 dias', '14 dias', '1 mês', 'mais de 1 mês', 'Não consumo'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, tempoSemAlcool === option && styles.selectedOption]}
            onPress={() => setTempoSemAlcool(option)}
          >
            <Text style={[styles.optionText, tempoSemAlcool === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>23. Qual sua frequência de uso de cannabis ("maconha")? *</Text>
        {['diário', 'cada 3 dias', 'cada semana', 'cada 2 semanas', 'cada mês', 'menos de cada mês', 'nunca'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, frequenciaCannabis === option && styles.selectedOption]}
            onPress={() => setFrequenciaCannabis(option)}
          >
            <Text style={[styles.optionText, frequenciaCannabis === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>24. Quanto tempo você consegue ficar sem consumir cannabis sem ficar com abstinência (sentir falta)? *</Text>
        {['menos que 1 dia', '1 dia', '7 dias', '14 dias', '1 mês', 'mais que 1 mês', 'Não consumo'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, tempoSemCannabis === option && styles.selectedOption]}
            onPress={() => setTempoSemCannabis(option)}
          >
            <Text style={[styles.optionText, tempoSemCannabis === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>25. Qual sua frequência de uso de psicodélicos (incluindo microdoses)? *</Text>
        {['diário', 'cada 3 dias', 'cada semana', 'cada 2 semanas', 'cada mês', 'cada 3 meses', 'cada 6 meses', 'menos de cada 6 meses', 'nunca'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, frequenciaPsicodelicos === option && styles.selectedOption]}
            onPress={() => setFrequenciaPsicodelicos(option)}
          >
            <Text style={[styles.optionText, frequenciaPsicodelicos === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>26. Quanto tempo você consegue ficar sem consumir psicodélicos sem ficar com abstinência (sentir falta)? *</Text>
        {['menos que 1 dia', '1 dia', '7 dias', '14 dias', '1 mês', 'mais que 1 mês', 'Não consumo'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, tempoSemPsicodelicos === option && styles.selectedOption]}
            onPress={() => setTempoSemPsicodelicos(option)}
          >
            <Text style={[styles.optionText, tempoSemPsicodelicos === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>27. Quantas vezes na vida você já consumiu MDMA ("Ecstasy", "bala")? *</Text>
        <TextInput style={styles.input} value={mdma} onChangeText={setMdma} />

        <Text style={styles.question}>28. Quantas vezes na vida você já consumiu estimulantes (p. ex. cocaína, crack, anfetamina)? *</Text>
        <TextInput style={styles.input} value={estimulantes} onChangeText={setEstimulantes} />

        <Text style={styles.question}>29. Quantas vezes na vida você já consumiu opióides (p. ex. ópio, heroína, tramadol, morfina, fentanil, etc)? *</Text>
        <TextInput style={styles.input} value={opioides} onChangeText={setOpioides} />

        <Text style={styles.question}>30. Quantas vezes na vida você já consumiu sedativos (p. ex. benzodiazepínicos como rivotril, lexotan, frontal, diazepam, lorazepam, barbitúricos)? *</Text>
        <TextInput style={styles.input} value={sedativos} onChangeText={setSedativos} />

        <Text style={styles.question}>31. Por favor, relembre da última vez que você consumiu uma substância ilícita... Qual substância foi? *</Text>
        <TextInput style={styles.input} value={substancia1} onChangeText={setSubstancia1} />
        <Text style={styles.question}>32. ... Quando foi? *</Text>
        <TextInput style={styles.input} value={quando1} onChangeText={setQuando1} />
        <Text style={styles.question}>33. ... Qual foi a dose? *</Text>
        {['muito baixa (microdose)', 'baixa', 'média', 'alta', 'muito alta'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, dose1 === option && styles.selectedOption]}
            onPress={() => setDose1(option)}
          >
            <Text style={[styles.optionText, dose1 === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.question}>34. Por favor, relembre da última vez que você consumiu uma substância psicodélica (p. ex. Ayahuasca, DMT, Jurema, Changa, LSD ou "doce", "cogumelos mágicos", cacto peyote, etc.)... Qual substância foi? *</Text>
        <TextInput style={styles.input} value={substancia2} onChangeText={setSubstancia2} />
        <Text style={styles.question}>35. ... Quando foi? *</Text>
        <TextInput style={styles.input} value={quando2} onChangeText={setQuando2} />
        <Text style={styles.question}>36. ... Qual foi a dose? *</Text>
        {['muito baixa (microdose)', 'baixa', 'média', 'alta', 'muito alta'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, dose2 === option && styles.selectedOption]}
            onPress={() => setDose2(option)}
          >
            <Text style={[styles.optionText, dose2 === option && styles.selectedOptionText]}>{option}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.section}>Experiência com Triptaminas</Text>
        <Text style={styles.question}>37. Quantas vezes você já consumiu ayahuasca (bebida que contém DMT)? *</Text>
        <TextInput style={styles.input} value={ayahuasca} onChangeText={setAyahuasca} keyboardType="numeric" />

        <Text style={styles.question}>38. Quantas vezes você já consumiu cristais de DMT (DMT free base para fumo)? *</Text>
        <TextInput style={styles.input} value={dmtCristais} onChangeText={setDmtCristais} keyboardType="numeric" />

        <Text style={styles.question}>39. Quantas vezes você já consumiu changa (mistura de ervas e DMT para fumo)? *</Text>
        <TextInput style={styles.input} value={changa} onChangeText={setChanga} keyboardType="numeric" />

        <Text style={styles.question}>40. Quantas vezes você já consumiu vinho de jurema (bebida que contém DMT)? *</Text>
        <TextInput style={styles.input} value={vinhoJurema} onChangeText={setVinhoJurema} keyboardType="numeric" />

        <Text style={styles.question}>41. Quantas vezes você já consumiu rapé com DMT (yopo)? *</Text>
        <TextInput style={styles.input} value={rapeDmt} onChangeText={setRapeDmt} keyboardType="numeric" />

        <Text style={styles.question}>42. Quantas vezes você já consumiu 5-MeO-DMT (5-metoxi-N,N-dimetiltriptamina)? *</Text>
        <TextInput style={styles.input} value={meoDmt} onChangeText={setMeoDmt} keyboardType="numeric" />

        <Text style={styles.section}>Experiência com outros Psicodélicos</Text>
        <Text style={styles.question}>43. Quantas vezes você já consumiu LSD ("doce")? *</Text>
        <TextInput style={styles.input} value={lsd} onChangeText={setLsd} keyboardType="numeric" />

        <Text style={styles.question}>44. Quantas vezes você já consumiu psilocibina ("cogumelos mágicos")? *</Text>
        <TextInput style={styles.input} value={psilocibina} onChangeText={setPsilocibina} keyboardType="numeric" />

        <Text style={styles.question}>45. Quantas vezes você já consumiu mescalina (cacto Peyote, São Pedro, etc.)? *</Text>
        <TextInput style={styles.input} value={mescalina} onChangeText={setMescalina} keyboardType="numeric" />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3F789D',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  question: {
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
  option: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#93C5FD',
    alignItems: 'center',
    minHeight: 60,
  },
  selectedOption: {
    backgroundColor: '#3F789D',
  },
  optionText: {
    color: '#3F789D',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#3F789D',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});