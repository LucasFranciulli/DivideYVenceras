import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {globalColors} from '../../themes/theme';
import {Expense} from '../../utils/Expense';
import Toast from 'react-native-toast-message';

export const ExpensesScreen = () => {
  const [expense, setExpense] = useState<Expense>({
    id: Date.now(),
    name: '',
    description: '',
    amount: 0,
    expirationDate: undefined,
    category: '',
  });

  const showToastError = () => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'No se pudo agregar el gasto',
    });
  };

  const showToastSuccess = () => {
    Toast.show({
      type: 'success',
      text1: 'Gasto añadido!',
      text2: '',
    });
  };

  const addExpense = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('expenses');
      const expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
      expenses.push(expense);
      await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
      setExpense({
        id: Date.now(),
        name: '',
        description: '',
        amount: 0,
        expirationDate: undefined,
        category: '',
      });
      showToastSuccess();
    } catch (error) {
      showToastError();
      console.error('Error saving expense:', error);
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
            onChangeText={text =>
              setExpense({...expense, amount: parseFloat(text)})
            }
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
        <Button mode="contained" onPress={addExpense} style={styles.button}>
          Añadir
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
