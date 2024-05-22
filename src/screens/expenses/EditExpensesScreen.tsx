import React, {useState} from 'react';
import {Button, Text, TextInput} from 'react-native-paper';
import {RootStackParamList} from '../../../App';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {globalColors} from '../../themes/theme';
import {Expense} from '../../utils/Expense';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

type EditExpensesScreenRouteProp = RouteProp<
  RootStackParamList,
  'EditExpenses'
>;

export const EditExpensesScreen = () => {
  const route = useRoute<EditExpensesScreenRouteProp>();
  const {item, navigation} = route.params;
  const [expense, setExpense] = useState<Expense>({
    id: item.id,
    name: item.name,
    description: item.description,
    amount: item.amount,
    expirationDate: item.expirationDate,
    category: item.category,
  });

  const showToastError = (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
    });
  };

  const showToastSuccess = (message: string) => {
    Toast.show({
      type: 'success',
      text1: message,
      text2: '',
    });
  };

  const updateExpense = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('expenses');
      const expenses = storedExpenses ? JSON.parse(storedExpenses) : [];

      const expenseIndex = expenses.findIndex(
        (exp: Expense) => exp.id === expense.id,
      );

      if (expenseIndex !== -1) {
        expenses[expenseIndex] = expense;
        await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
        showToastSuccess('Gasto actualizado!');
        navigation.goBack();
      } else {
        showToastError('No se encontró el gasto para actualizar');
      }
    } catch (error) {
      showToastError('No se pudo actualizar el gasto');
      console.error('Error updating expense:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="displayLarge" style={styles.title}>
        Agregar Gastos
      </Text>
      <View style={styles.mainContainer}>
        <View style={styles.inputContainer}>
          <Text variant="headlineSmall" style={styles.inputTitle}>
            Nombre
          </Text>
          <TextInput
            placeholder="Nombre"
            value={expense.name}
            onChangeText={text => setExpense({...expense, name: text})}
            style={styles.inputButtons}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text variant="headlineSmall" style={styles.inputTitle}>
            Descipción
          </Text>
          <TextInput
            placeholder="Descripción"
            value={expense.description}
            onChangeText={text => setExpense({...expense, description: text})}
            style={styles.inputButtons}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text variant="headlineSmall" style={styles.inputTitle}>
            Monto
          </Text>
          <TextInput
            placeholder="Monto"
            value={expense.amount.toString()}
            onChangeText={text => {
              const amount = parseFloat(text);
              setExpense({...expense, amount: isNaN(amount) ? 0 : amount});
            }}
            keyboardType="numeric"
            style={styles.inputButtons}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text variant="headlineSmall" style={styles.inputTitle}>
            Categoría
          </Text>
          <TextInput
            placeholder="Categoría"
            value={expense.category}
            onChangeText={text => setExpense({...expense, category: text})}
            style={styles.inputButtons}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={updateExpense} style={styles.button}>
          Actualizar
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  mainContainer: {
    width: '100%',
  },
  buttonContainer: {
    paddingTop: 20,
    width: '50%',
  },
  button: {
    backgroundColor: globalColors.secondary,
    width: '80%',
    alignSelf: 'center',
  },
  title: {
    color: globalColors.primary,
    paddingBottom: 50,
    alignSelf: 'flex-start',
  },
  inputButtons: {
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  inputTitle: {
    color: globalColors.primary,
  },
  inputContainer: {
    gap: 10,
  },
});
