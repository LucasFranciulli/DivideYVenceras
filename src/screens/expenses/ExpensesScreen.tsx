import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, Pressable, FlatList} from 'react-native';
import {
  Button,
  Checkbox,
  Modal,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {globalColors} from '../../themes/theme';
import {Expense} from '../../utils/Expense';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDown from 'react-native-paper-dropdown';

export const ExpensesScreen = () => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');

  const [visibleModalFinished, setVisibleModalFinished] = useState(false);
  const [visibleModalRemove, setVisibleModalRemove] = useState(false);

  const showModalFinished = () => setVisibleModalFinished(true);
  const hideModalFinished = () => setVisibleModalFinished(false);
  const showModalRemove = () => setVisibleModalRemove(true);
  const hideModalRemove = () => setVisibleModalRemove(false);

  const [newCategory, setNewCategory] = useState('');
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [expense, setExpense] = useState<Expense>({
    id: Date.now(),
    name: '',
    description: '',
    amount: 0,
    expirationDate: undefined,
    category: '',
    isFixed: false,
    tag: '',
  });
  const [checked, setChecked] = React.useState(false);

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
        isFixed: !checked,
      });
      showToastSuccess('Gasto añadido!');
    } catch (error) {
      showToastError('No se pudo agregar el gasto');
      console.error('Error saving expense:', error);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      showToastError('La categoría no puede estar vacía');
      return;
    }

    const newCategoryItem = {
      label: newCategory,
      value: newCategory.toLowerCase(),
    };

    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      const categories = storedCategories ? JSON.parse(storedCategories) : [];
      const updatedCategories = [...categories, newCategoryItem];
      await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
      setCategoriesList(prevCategories => [...prevCategories, newCategoryItem]);
      setNewCategory('');
      hideModalFinished();
      showToastSuccess('Categoría añadida!');
    } catch (error) {
      showToastError('No se pudo agregar la categoría');
      console.error('Error saving category:', error);
    }
  };

  const removeCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      let categories = storedCategories ? JSON.parse(storedCategories) : [];
      categories = categories.filter((category: any) => !selectedCategories.includes(category.value));
      await AsyncStorage.setItem('categories', JSON.stringify(categories));
      setCategoriesList(categories);
      setSelectedCategories([]);
      hideModalRemove();
      showToastSuccess('Categorías eliminadas!');
    } catch (error) {
      showToastError('No se pudo eliminar las categorías');
      console.error('Error removing categories:', error);
    }
  };

  const toggleCategorySelection = (categoryValue: string) => {
    setSelectedCategories(prevSelected => {
      if (prevSelected.includes(categoryValue)) {
        return prevSelected.filter(value => value !== categoryValue);
      } else {
        return [...prevSelected, categoryValue];
      }
    });
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

  useEffect(() => {
    setExpense({...expense, category: currentCategory});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory]);

  return (
    <View style={styles.container}>
      <Text variant="displayLarge" style={styles.title}>
        Agregar Gastos
      </Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
            <View style={styles.inputContainer}>
              <Text variant="headlineSmall" style={styles.inputTitle}>
                Categoría
              </Text>
              <DropDown
                mode={'outlined'}
                placeholder="Categoría"
                visible={showDropDown}
                showDropDown={() => setShowDropDown(true)}
                onDismiss={() => setShowDropDown(false)}
                value={currentCategory}
                setValue={setCurrentCategory}
                list={categoriesList}
                dropDownStyle={styles.dropDownStyle}
                dropDownItemSelectedStyle={styles.dropDownItemSelectedStyle}
                dropDownItemStyle={styles.dropDownItemStyle}
                dropDownItemTextStyle={styles.dropDownItemTextStyle}
                activeColor={globalColors.background}
                inputProps={[styles.inputButtons, styles.dropdown]}
              />
            </View>
            <View style={styles.inputRowContainer}>
              <Pressable style={styles.addCategoriesButton} onPress={showModalFinished}>
                <Text
                  variant="titleMedium"
                  style={styles.addCategoriesButtonText}>
                  Categoría
                </Text>
                <Icon
                  name={'add-outline'}
                  size={25}
                  color={globalColors.background}
                />
              </Pressable>
              <Pressable style={styles.addCategoriesButton} onPress={showModalRemove}>
                <Text
                  variant="titleMedium"
                  style={styles.addCategoriesButtonText}>
                  Categoría
                </Text>
                <Icon
                  name={'remove-outline'}
                  size={25}
                  color={globalColors.background}
                />
              </Pressable>
            </View>
              <View
                style={[
                  styles.fixedExpense,
                  checked === false && styles.notCheckedButtom,
                ]}>
                <Text
                  variant="titleMedium"
                  style={[
                    styles.addCategoriesButtonText,
                    checked === false && styles.notCheckedText,
                  ]}>
                  Gasto Fijo
                </Text>
                <Checkbox
                  status={checked ? 'checked' : 'unchecked'}
                  color={globalColors.background}
                  onPress={() => {
                    setChecked(!checked);
                  }}
                />
              </View>
          </View>
          <View style={styles.inputContainer}>
            <Text variant="headlineSmall" style={styles.inputTitle}>
              Tag
            </Text>
            <TextInput
              placeholder="Tag"
              value={expense.tag}
              onChangeText={text => setExpense({...expense, tag: text})}
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
      </ScrollView>
      <Portal>
        <Modal
          visible={visibleModalFinished}
          onDismiss={hideModalFinished}
          contentContainerStyle={styles.containerStyle}>
          <View style={styles.modalContainer}>
            <Text variant="titleLarge" style={styles.nameTitleModal}>
              Agregar nueva categoría
            </Text>
            <TextInput
              placeholder="Nombre de la nueva categoría"
              value={newCategory}
              onChangeText={text => setNewCategory(text)}
              style={styles.inputButtons}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
            <View style={styles.buttomModalButtons}>
              <Button onPress={addCategory}>
                <Text variant="titleMedium" style={styles.nameTitleModal}>
                  Añadir
                </Text>
              </Button>
              <Button onPress={hideModalFinished}>
                <Text variant="titleMedium" style={styles.nameTitleModal}>
                  Cancelar
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
      <Portal>
        <Modal
          visible={visibleModalRemove}
          onDismiss={hideModalRemove}
          contentContainerStyle={styles.containerStyle}>
          <View style={styles.modalContainer}>
            <Text variant="titleLarge" style={styles.nameTitleModal}>
              Eliminar categoría
            </Text>
            <FlatList
              data={categoriesList}
              keyExtractor={item => item.value}
              renderItem={({item}) => (
                <View style={styles.categoryItem}>
                  <Checkbox
                    status={selectedCategories.includes(item.value) ? 'checked' : 'unchecked'}
                    onPress={() => toggleCategorySelection(item.value)}
                  />
                  <Text style={styles.categoryItemText}>{item.label}</Text>
                </View>
              )}
            />
            <View style={styles.buttomModalButtons}>
              <Button onPress={removeCategories}>
                <Text variant="titleMedium" style={styles.nameTitleModal}>
                  Eliminar
                </Text>
              </Button>
              <Button onPress={hideModalRemove}>
                <Text variant="titleMedium" style={styles.nameTitleModal}>
                  Cancelar
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 30,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 15,
  },
  mainContainer: {
    width: '100%',
  },
  buttonContainer: {
    paddingTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: globalColors.secondary,
    width: '80%',
    alignSelf: 'center',
  },
  title: {
    color: globalColors.primary,
    paddingBottom: 30,
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
    width: '100%',
  },
  inputTitle: {
    color: globalColors.primary,
  },
  inputContainer: {
    gap: 10,
    width: '100%',
  },
  inputRowContainer: {
    alignItems: 'center',
    gap: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  addCategoriesButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    width: 150,
    borderRadius: 30,
    backgroundColor: globalColors.secondary,
  },
  addCategoriesButtonText: {
    color: globalColors.background,
  },
  fixedExpense: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    width: 150,
    height: 45,
    borderRadius: 30,
    backgroundColor: globalColors.secondary,
  },
  notCheckedButtom: {
    borderWidth: 1,
    color: globalColors.dark,
    backgroundColor: globalColors.background,
  },
  notCheckedText: {
    color: globalColors.dark,
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
  containerStyle: {
    backgroundColor: 'white',
    alignSelf: 'center',
    padding: 20,
    width: '80%',
    borderRadius: 10,
  },
  nameTitleModal: {
    color: globalColors.primary,
  },
  nameBodyModal: {
    textAlign: 'center',
  },
  modalContainer: {
    alignItems: 'center',
    gap: 20,
  },
  buttomModalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryItemText: {
    marginLeft: 10,
  },
});

export default ExpensesScreen;
