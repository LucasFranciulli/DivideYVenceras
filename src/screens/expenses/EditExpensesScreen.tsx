import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Text, TextInput} from 'react-native-paper';
import {RootStackParamList} from '../../../App';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {globalColors} from '../../themes/theme';
import {Expense} from '../../utils/Expense';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import DropDown from 'react-native-paper-dropdown';
import { showToastError, showToastSuccess } from '../../utils/ToastActions';
import { styleEditExpenses } from './style';

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
    isFixed: item.isFixed,
  });
  const [checked, setChecked] = React.useState(item.isFixed);
  const [showDropDown, setShowDropDown] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(item.category);
  const [categoriesList, setCategoriesList] = useState([]);

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
        showToastSuccess('Gasto actualizado!', '');
        navigation.goBack();
      } else {
        showToastError('Error', 'No se encontró el gasto para actualizar');
      }
    } catch (error) {
      showToastError('Error', 'No se pudo actualizar el gasto');
      console.error('Error updating expense:', error);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const storedCategories = await AsyncStorage.getItem('categories');
        if (storedCategories) {
          setCategoriesList(JSON.parse(storedCategories));
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  return (
    <View style={styleEditExpenses.container}>
      <Text variant="displayLarge" style={styleEditExpenses.title}>
        Editar Gasto
      </Text>
      <View style={styleEditExpenses.mainContainer}>
        <View style={styleEditExpenses.inputRowContainer}>
          <Text variant="headlineMedium" style={styleEditExpenses.inputTitle}>
            Gasto Fijo:
          </Text>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            color={globalColors.primary}
            onPress={() => {
              setChecked(!checked);
              setExpense({...expense, isFixed: !checked});
            }}
          />
        </View>
        <View style={styleEditExpenses.inputContainer}>
          <Text variant="headlineSmall" style={styleEditExpenses.inputTitle}>
            Nombre
          </Text>
          <TextInput
            placeholder="Nombre"
            value={expense.name}
            onChangeText={text => setExpense({...expense, name: text})}
            style={styleEditExpenses.inputButtons}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />
        </View>
        <View style={styleEditExpenses.inputContainer}>
          <Text variant="headlineSmall" style={styleEditExpenses.inputTitle}>
            Descipción
          </Text>
          <TextInput
            placeholder="Descripción"
            value={expense.description}
            onChangeText={text => setExpense({...expense, description: text})}
            style={styleEditExpenses.inputButtons}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />
        </View>
        <View style={styleEditExpenses.inputContainer}>
          <Text variant="headlineSmall" style={styleEditExpenses.inputTitle}>
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
            style={styleEditExpenses.inputButtons}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />
        </View>
        <View style={[styleEditExpenses.inputContainer, styleEditExpenses.drop]}>
          <Text variant="headlineSmall" style={styleEditExpenses.inputTitle}>
            Categoría
          </Text>
          <DropDown
            mode={'outlined'}
            placeholder="Categoría"
            visible={showDropDown}
            showDropDown={() => setShowDropDown(true)}
            onDismiss={() => setShowDropDown(false)}
            value={currentCategory}
            setValue={text => {
              setCurrentCategory(text);
              setExpense({...expense, category: text});
            }}
            list={categoriesList}
            dropDownStyle={styleEditExpenses.dropDownStyle}
            dropDownItemSelectedStyle={styleEditExpenses.dropDownItemSelectedStyle}
            dropDownItemStyle={styleEditExpenses.dropDownItemStyle}
            dropDownItemTextStyle={styleEditExpenses.dropDownItemTextStyle}
            activeColor={globalColors.background}
            inputProps={[styleEditExpenses.inputButtons, styleEditExpenses.dropdown]}
          />
        </View>
        <View style={styleEditExpenses.inputContainer}>
          <Text variant="headlineSmall" style={styleEditExpenses.inputTitle}>
            Tag
          </Text>
          <TextInput
            value={expense.tag}
            onChangeText={text => setExpense({...expense, tag: text})}
            style={styleEditExpenses.inputButtons}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />
        </View>
      </View>
      <View style={styleEditExpenses.buttonContainer}>
        <Button mode="contained" onPress={updateExpense} style={styleEditExpenses.button}>
          Actualizar
        </Button>
      </View>
    </View>
  );
};