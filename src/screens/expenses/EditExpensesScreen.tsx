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

  const [tagsList, setTagsList] = useState([]);

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
    <View style={styles.container}>
      <Text variant="displayLarge" style={styles.title}>
        Editar Gasto
      </Text>
      <View style={styles.mainContainer}>
        <View style={styles.inputRowContainer}>
          <Text variant="headlineMedium" style={styles.inputTitle}>
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
        <View style={[styles.inputContainer, styles.drop]}>
          <Text variant="headlineSmall" style={styles.inputTitle}>
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
            dropDownStyle={styles.dropDownStyle}
            dropDownItemSelectedStyle={styles.dropDownItemSelectedStyle}
            dropDownItemStyle={styles.dropDownItemStyle}
            dropDownItemTextStyle={styles.dropDownItemTextStyle}
            activeColor={globalColors.background}
            inputProps={[styles.inputButtons, styles.dropdown]}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text variant="headlineSmall" style={styles.inputTitle}>
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
            dropDownStyle={styles.dropDownStyle}
            dropDownItemSelectedStyle={styles.dropDownItemSelectedStyle}
            dropDownItemStyle={styles.dropDownItemStyle}
            dropDownItemTextStyle={styles.dropDownItemTextStyle}
            activeColor={globalColors.background}
            inputProps={[styles.inputButtons, styles.dropdown]}
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
  inputRowContainer: {
    alignItems: 'center',
    gap: 10,
    paddingBottom: 20,
    flexDirection: 'row',
  },
  dropDownStyle: {
    backgroundColor: globalColors.background,
  },
  dropDownItemSelectedStyle: {
    backgroundColor: globalColors.secondary,
  },
  dropDownItemStyle: {
    backgroundColor: globalColors.background,
  },
  dropDownItemTextStyle: {
    color: globalColors.dark,
  },
  dropdown: {
    backgroundColor: globalColors.background,
  },
  drop: {
    paddingBottom: 10,
  },
});
