import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Text, TextInput} from 'react-native-paper';
import {RootStackParamList} from '../../../App';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Pressable, ScrollView, View} from 'react-native';
import {globalColors} from '../../themes/theme';
import {Expense} from '../../utils/Expense';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';
import DropDown from 'react-native-paper-dropdown';
import { showToastError, showToastSuccess } from '../../utils/ToastActions';
import { styleEditExpenses } from './style';
import Icon from 'react-native-vector-icons/Ionicons';

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
    tag: item.tag,
    date: item.date,
  });
  const [checked, setChecked] = React.useState(item.isFixed);
  const [showDropDownCategories, setShowDropDownCategories] = useState(false);
  const [showDropDownTags, setShowDropDownTags] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(item.category);
  const [currentTag, setCurrentTag] = useState(item.tag);
  const [categoriesList, setCategoriesList] = useState([
    {label: 'Comida', value: 'comida'},
    {label: 'Ropa', value: 'ropa'},
    {label: 'Higiene', value: 'higiene'},
    {label: 'Tecnología', value: 'tecnologia'},
    {label: 'Bebidas', value: 'bebidas'},
    {label: 'Farmacia', value: 'farmacia'},
    {label: 'Entretenimiento', value: 'entretenimiento'},
    {label: 'Otro', value: 'otro'},
  ]);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const [tagsList, setTagsList] = useState([]);

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
    const loadTags = async () => {
      try {
        const storedTags = await AsyncStorage.getItem('tags');
        if (storedTags) {
          setTagsList(JSON.parse(storedTags));
        }
      } catch (error) {
        console.error('Error loading tags:', error);
      }
    };

    loadTags();
  }, []);

  return (
    <View style={styleEditExpenses.container}>
      <Text variant="displayLarge" style={styleEditExpenses.title}>
        Editar Gasto
      </Text>
      <ScrollView contentContainerStyle={styleEditExpenses.scrollViewContent}>
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
        <View style={styleEditExpenses.datePickerContainer}>
            <Text variant="headlineSmall" style={styleEditExpenses.inputTitle}>
              Fecha
            </Text>
            <Pressable
              onPress={() => setOpen(true)}
              style={styleEditExpenses.datePickerButton}>
              <Text style={styleEditExpenses.datePickerButtonText}>
                {date.toDateString()}
              </Text>
              <Icon name="calendar" size={24} color={globalColors.primary} />
            </Pressable>
            <DatePicker
              modal
              open={open}
              date={date}
              onConfirm={date => {
                setOpen(false);
                setDate(date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
              mode="date"
            />
          </View>
        <View style={[styleEditExpenses.inputContainer, styleEditExpenses.drop]}>
          <Text variant="headlineSmall" style={styleEditExpenses.inputTitle}>
            Categoría
          </Text>
          <DropDown
            mode={'outlined'}
            placeholder="Categoría"
            visible={showDropDownCategories}
            showDropDown={() => setShowDropDownCategories(true)}
            onDismiss={() => setShowDropDownCategories(false)}
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
          <DropDown
            mode={'outlined'}
            placeholder="Tags"
            visible={showDropDownTags}
            showDropDown={() => setShowDropDownTags(true)}
            onDismiss={() => setShowDropDownTags(false)}
            value={currentTag}
            setValue={text => {
              setCurrentTag(text);
              setExpense({...expense, tag: text});
            }}
            list={tagsList}
            dropDownStyle={styleEditExpenses.dropDownStyle}
            dropDownItemSelectedStyle={styleEditExpenses.dropDownItemSelectedStyle}
            dropDownItemStyle={styleEditExpenses.dropDownItemStyle}
            dropDownItemTextStyle={styleEditExpenses.dropDownItemTextStyle}
            activeColor={globalColors.background}
            inputProps={[styleEditExpenses.inputButtons, styleEditExpenses.dropdown]}
          />
        </View>
      </View>
      </ScrollView>
      <View style={styleEditExpenses.buttonContainer}>
        <Button mode="contained" onPress={updateExpense} style={styleEditExpenses.button}>
          Actualizar
        </Button>
      </View>
    </View>
  );
};