import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, FlatList } from 'react-native';
import { Button, Checkbox, Modal, Portal, Text, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalColors } from '../../themes/theme';
import { Expense } from '../../utils/Expense';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDown from 'react-native-paper-dropdown';
import { styleListExpenses } from './style';
import { showToastError, showToastSuccess } from '../../utils/ToastActions';
import DatePicker from 'react-native-date-picker';

export const ExpensesScreen = () => {
  const [showDropDownCategories, setShowDropDownCategories] = useState(false);
  const [showDropDownTags, setShowDropDownTags] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentTag, setCurrentTag] = useState('');

  const [visibleModalFinished, setVisibleModalFinished] = useState(false);
  const [visibleModalRemove, setVisibleModalRemove] = useState(false);

  const showModalFinished = () => setVisibleModalFinished(true);
  const hideModalFinished = () => setVisibleModalFinished(false);
  const showModalRemove = () => setVisibleModalRemove(true);
  const hideModalRemove = () => setVisibleModalRemove(false);

  const [categoriesList, setCategoriesList] = useState([
    { label: 'Comida', value: 'comida' },
    { label: 'Ropa', value: 'ropa' },
    { label: 'Higiene', value: 'higiene' },
    { label: 'Tecnología', value: 'tecnologia' },
    { label: 'Bebidas', value: 'bebidas' },
    { label: 'Farmacia', value: 'farmacia' },
    { label: 'Entretenimiento', value: 'entretenimiento' },
    { label: 'Otro', value: 'otro' },
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [tagList, setTagList] = useState([]);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [expense, setExpense] = useState<Expense>({
    id: Date.now() * Math.floor(Math.random() * 100) + 10,
    name: '',
    description: '',
    amount: 0,
    expirationDate: undefined,
    category: '',
    isFixed: false,
    tag: '',
    date: new Date(),
  });
  const [checked, setChecked] = useState(false);

  const addExpense = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('expenses');
      const expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
      expenses.push(expense);
      await AsyncStorage.setItem('expenses', JSON.stringify(expenses));

      setExpense({
        id: Date.now() * Math.floor(Math.random() * 100) + 10,
        name: '',
        description: '',
        amount: 0,
        expirationDate: undefined,
        category: '',
        isFixed: checked,
        date: new Date(),
      });
      showToastSuccess('Gasto añadido!', '');
    } catch (error) {
      showToastError('Error', 'No se pudo agregar el gasto');
      console.error('Error saving expense:', error);
    }
  };

  const addTag = async () => {
    if (!newTag.trim()) {
      showToastError('Error', 'El tag no puede estar vacío');
      return;
    }

    const newTagItem = {
      label: newTag,
      value: newTag.toLowerCase(),
    };

    try {
      const storedTags = await AsyncStorage.getItem('tags');
      const tags = storedTags ? JSON.parse(storedTags) : [];
      const updatedTags = [...tags, newTagItem];
      await AsyncStorage.setItem('tags', JSON.stringify(updatedTags));
      setTagList(prevTag => [...prevTag, newTagItem]);
      setNewTag('');
      hideModalFinished();
      showToastSuccess('Tag añadido!', '');
    } catch (error) {
      showToastError('Error', 'No se pudo agregar el tag');
      console.error('Error saving tag:', error);
    }
  };

  const removeTag = async () => {
    try {
      const storedTags = await AsyncStorage.getItem('tags');
      let tags = storedTags ? JSON.parse(storedTags) : [];
      tags = tags.filter((tag: any) => !selectedTags.includes(tag.value));
      await AsyncStorage.setItem('tags', JSON.stringify(tags));
      setTagList(tags);
      setSelectedTags([]);
      hideModalRemove();
      showToastSuccess('Tags eliminados!', '');
    } catch (error) {
      showToastError('Error', 'No se pudo eliminar los tags');
      console.error('Error removing tags:', error);
    }
  };

  const toggleTagSelection = (tagValue: string) => {
    setSelectedTags(prevSelected => {
      if (prevSelected.includes(tagValue)) {
        return prevSelected.filter(value => value !== tagValue);
      } else {
        return [...prevSelected, tagValue];
      }
    });
  };

  useEffect(() => {
    const loadTags = async () => {
      try {
        const storedTags = await AsyncStorage.getItem('tags');
        if (storedTags) {
          setTagList(JSON.parse(storedTags));
        }
      } catch (error) {
        console.error('Error loading tags:', error);
      }
    };

    loadTags();
  }, []);

  useEffect(() => {
    setExpense({ ...expense, category: currentCategory });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory]);

  useEffect(() => {
    setExpense({ ...expense, tag: currentTag });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTag]);

  useEffect(() => {
    setExpense({ ...expense, date: date });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <View style={styleListExpenses.container}>
      <Text variant="displayLarge" style={styleListExpenses.title}>
        Agregar Gastos
      </Text>
      <ScrollView contentContainerStyle={styleListExpenses.scrollViewContent}>
        <View style={styleListExpenses.mainContainer}>
          <View style={styleListExpenses.inputContainer}>
            <Text variant="headlineSmall" style={styleListExpenses.inputTitle}>
              Nombre
            </Text>
            <TextInput
              placeholder="Nombre"
              value={expense.name}
              onChangeText={text => setExpense({ ...expense, name: text })}
              style={styleListExpenses.inputButtons}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
          </View>
          <View style={styleListExpenses.inputContainer}>
            <Text variant="headlineSmall" style={styleListExpenses.inputTitle}>
              Descripción
            </Text>
            <TextInput
              placeholder="Descripción"
              value={expense.description}
              onChangeText={text => setExpense({ ...expense, description: text })}
              style={styleListExpenses.inputButtons}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
          </View>
          <View style={styleListExpenses.inputContainer}>
            <Text variant="headlineSmall" style={styleListExpenses.inputTitle}>
              Monto
            </Text>
            <TextInput
              placeholder="Monto"
              value={expense.amount.toString()}
              onChangeText={text =>
                setExpense({ ...expense, amount: parseFloat(text) })
              }
              keyboardType="numeric"
              style={styleListExpenses.inputButtons}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
          </View>
          <View style={[styleListExpenses.inputContainer, { marginBottom: 10 }]}>
            <Text variant="headlineSmall" style={styleListExpenses.inputTitle}>
              Fecha
            </Text>
            <Pressable onPress={() => setOpen(true)} style={styleListExpenses.datePickerButton}>
              <Text style={styleListExpenses.datePickerButtonText}>
                {date.toDateString()}
              </Text>
              <Icon name="calendar" size={24} color={globalColors.primary} />
            </Pressable>
            <DatePicker
              modal
              open={open}
              date={date}
              onConfirm={(date) => {
                setOpen(false);
                setDate(date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
              mode="date"
            />
          </View>
          <View style={[styleListExpenses.inputContainer, { marginBottom: 10 }]}>
            <Text variant="headlineSmall" style={styleListExpenses.inputTitle}>
              Categoría
            </Text>
            <DropDown
              mode={'outlined'}
              placeholder="Categoría"
              visible={showDropDownCategories}
              showDropDown={() => setShowDropDownCategories(true)}
              onDismiss={() => setShowDropDownCategories(false)}
              value={currentCategory}
              setValue={setCurrentCategory}
              list={categoriesList}
              dropDownStyle={styleListExpenses.dropDownStyle}
              dropDownItemSelectedStyle={styleListExpenses.dropDownItemSelectedStyle}
              dropDownItemStyle={styleListExpenses.dropDownItemStyle}
              dropDownItemTextStyle={styleListExpenses.dropDownItemTextStyle}
              activeColor={globalColors.background}
              inputProps={[styleListExpenses.inputButtons, styleListExpenses.dropdown]}
            />
          </View>
          <View style={styleListExpenses.inputContainer}>
            <View style={styleListExpenses.inputContainer}>
              <Text variant="headlineSmall" style={styleListExpenses.inputTitle}>
                Tags
              </Text>
              <DropDown
                mode={'outlined'}
                placeholder="Tags"
                visible={showDropDownTags}
                showDropDown={() => setShowDropDownTags(true)}
                onDismiss={() => setShowDropDownTags(false)}
                value={currentTag}
                setValue={setCurrentTag}
                list={tagList}
                dropDownStyle={styleListExpenses.dropDownStyle}
                dropDownItemSelectedStyle={styleListExpenses.dropDownItemSelectedStyle}
                dropDownItemStyle={styleListExpenses.dropDownItemStyle}
                dropDownItemTextStyle={styleListExpenses.dropDownItemTextStyle}
                activeColor={globalColors.background}
                inputProps={[styleListExpenses.inputButtons, styleListExpenses.dropdown]}
              />
            </View>
            <View style={styleListExpenses.inputRowContainer}>
              <Pressable
                style={styleListExpenses.addCategoriesButton}
                onPress={showModalFinished}>
                <Text
                  variant="titleMedium"
                  style={styleListExpenses.addCategoriesButtonText}>
                  Tag
                </Text>
                <Icon
                  name={'add-outline'}
                  size={25}
                  color={globalColors.background}
                />
              </Pressable>
              <Pressable
                style={styleListExpenses.addCategoriesButton}
                onPress={showModalRemove}>
                <Text
                  variant="titleMedium"
                  style={styleListExpenses.addCategoriesButtonText}>
                  Tag
                </Text>
                <Icon
                  name={'remove-outline'}
                  size={25}
                  color={globalColors.background}
                />
              </Pressable>
            </View>
          </View>
        </View>
        <View style={styleListExpenses.buttonContainer}>
          <View
            style={[
              styleListExpenses.fixedExpense,
              checked === false && styleListExpenses.notCheckedButtom,
            ]}>
            <Text
              variant="titleMedium"
              style={[
                styleListExpenses.addCategoriesButtonText,
                checked === false && styleListExpenses.notCheckedText,
              ]}>
              Gasto Fijo
            </Text>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              color={globalColors.background}
              onPress={() => {
                setChecked(!checked);
                setExpense({ ...expense, isFixed: !checked });
              }}
            />
          </View>
          <Button mode="contained" onPress={addExpense} style={styleListExpenses.button}>
            Añadir
          </Button>
        </View>
      </ScrollView>
      <Portal>
        <Modal
          visible={visibleModalFinished}
          onDismiss={hideModalFinished}
          contentContainerStyle={styleListExpenses.containerStyle}>
          <View style={styleListExpenses.modalContainer}>
            <Text variant="titleLarge" style={styleListExpenses.nameTitleModal}>
              Agregar nuevo Tag
            </Text>
            <TextInput
              placeholder="Nombre del nuevo tag"
              value={newTag}
              onChangeText={text => setNewTag(text)}
              style={styleListExpenses.inputButtons}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
            <View style={styleListExpenses.buttomModalButtons}>
              <Button onPress={addTag}>
                <Text variant="titleMedium" style={styleListExpenses.nameTitleModal}>
                  Añadir
                </Text>
              </Button>
              <Button onPress={hideModalFinished}>
                <Text variant="titleMedium" style={styleListExpenses.nameTitleModal}>
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
          contentContainerStyle={styleListExpenses.containerStyle}>
          <View style={styleListExpenses.modalContainer}>
            <Text variant="titleLarge" style={styleListExpenses.nameTitleModal}>
              Eliminar Tags
            </Text>
            <FlatList
              data={tagList}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <View style={styleListExpenses.categoryItem}>
                  <Checkbox
                    status={
                      selectedTags.includes(item.value)
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => toggleTagSelection(item.value)}
                  />
                  <Text style={styleListExpenses.categoryItemText}>{item.label}</Text>
                </View>
              )}
            />
            <View style={styleListExpenses.buttomModalButtons}>
              <Button onPress={removeTag}>
                <Text variant="titleMedium" style={styleListExpenses.nameTitleModal}>
                  Eliminar
                </Text>
              </Button>
              <Button onPress={hideModalRemove}>
                <Text variant="titleMedium" style={styleListExpenses.nameTitleModal}>
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

export default ExpensesScreen;
