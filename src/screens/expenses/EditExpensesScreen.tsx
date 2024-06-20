import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Text, TextInput} from 'react-native-paper';
import {RootStackParamList} from '../../../App';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Pressable, ScrollView, View} from 'react-native';
import {globalColors} from '../../themes/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';
import DropDown from 'react-native-paper-dropdown';
import {showToastError, showToastSuccess} from '../../utils/ToastActions';
import {styleEditExpenses} from './style';
import Icon from 'react-native-vector-icons/Ionicons';
import {ExpenseRequest} from '../../utils/ExpenseRequest';
import {editExpensePersonal} from './services/personalExpense';
import {Expense} from '../../utils/Expense';
import {ExpenseEdit} from '../../utils/ExpenseEdit';
import {getCategory} from '../../utils/GetCategories';
import {getTags} from '../../utils/GetTags';
import {Category} from '../../utils/Category';
import {getCategorias} from './services/categorias';
import {getMyTags} from './services/tags';
import { Tag } from '../../utils/Tag';

type EditExpensesScreenRouteProp = RouteProp<
  RootStackParamList,
  'EditExpenses'
>;

export const EditExpensesScreen = () => {
  const route = useRoute<EditExpensesScreenRouteProp>();
  const {item, navigation} = route.params;

  const [expense, setExpense] = useState<ExpenseRequest>({
    nombre: item.nombre,
    descripcion: item.descripcion,
    monto: Number(item.monto),
    fecha: item.fecha.toString(),
    id_categoria: item.id_categoria,
    tags: item.tags && item.tags.length > 0 ? [item.tags[0].GastoTag.id] : [],
    saldado: item.monto === item.monto_pagado,
  });
  const [categoryToEdit, setCategoryToEdit] = useState<string>('');
  const [tagToEdit, setTagToEdit] = useState<string>('');

  const [checked, setChecked] = useState(item.monto === item.monto_pagado);
  const [showDropDownCategories, setShowDropDownCategories] = useState(false);
  const [showDropDownTags, setShowDropDownTags] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(item.id_categoria);
  const [currentTag, setCurrentTag] = useState(item.tags);
  const [categoriesList, setCategoriesList] = useState<LabelValue[]>([]);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date(item.fecha));
  const [tagsList, setTagsList] = useState<LabelValue[]>([]);

  interface LabelValue {
    label: string;
    value: string;
  }
  const transformCategories = (categories: Category[]): LabelValue[] => {
    return categories.map(category => ({
      label: category.nombre,
      value: category.nombre,
    }));
  };

  function transformTags(tags: Tag[]): LabelValue[] {
    return tags.map(tag => ({
      label: tag.nombre,
      value: tag.nombre.toLowerCase().replace(/\s+/g, ''),
    }));
  }

  const configureTagsAndCategories = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const categoryToEdit = await getCategory(expense.id_categoria, token);
      setCategoryToEdit(categoryToEdit);
      const tagToEdit = await getTags(expense.tags[0], token);
      setTagToEdit(tagToEdit);

      const categoriasObtenidas = await getCategorias(token);
      const categoriasSeteadas = transformCategories(categoriasObtenidas);
      setCategoriesList(categoriasSeteadas);

      const tagsObtenidos = await getMyTags(token);
      const tagsSeteadas = transformTags(tagsObtenidos);
      setTagsList(tagsSeteadas);
    }
  };

  useEffect(() => {
    configureTagsAndCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateExpense = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const expenseToEdit: ExpenseEdit = {
          nombre: expense.nombre,
          monto: Number(expense.monto),
          fecha: expense.fecha,
          categoria: categoryToEdit,
          etiquetas: tagToEdit,
        };
        await editExpensePersonal(expenseToEdit, token, item.id);
        showToastSuccess('Gasto actualizado!', '');
        navigation.goBack();
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
                setExpense({...expense, saldado: !checked});
              }}
            />
          </View>
          <View style={styleEditExpenses.inputContainer}>
            <Text variant="headlineSmall" style={styleEditExpenses.inputTitle}>
              Nombre
            </Text>
            <TextInput
              placeholder="Nombre"
              value={expense.nombre}
              onChangeText={text => setExpense({...expense, nombre: text})}
              style={styleEditExpenses.inputButtons}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
          </View>
          <View style={styleEditExpenses.inputContainer}>
            <Text variant="headlineSmall" style={styleEditExpenses.inputTitle}>
              Descripción
            </Text>
            <TextInput
              placeholder="Descripción"
              value={expense.descripcion}
              onChangeText={text => setExpense({...expense, descripcion: text})}
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
              value={expense.monto.toString()}
              onChangeText={text => {
                const amount = parseFloat(text);
                setExpense({...expense, monto: isNaN(amount) ? 0 : amount});
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
                setExpense({...expense, fecha: date.toISOString()});
              }}
              onCancel={() => {
                setOpen(false);
              }}
              mode="date"
            />
          </View>
          <View
            style={[styleEditExpenses.inputContainer, styleEditExpenses.drop]}>
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
                setExpense({...expense, id_categoria: parseInt(text)});
              }}
              list={categoriesList}
              dropDownStyle={styleEditExpenses.dropDownStyle}
              dropDownItemSelectedStyle={
                styleEditExpenses.dropDownItemSelectedStyle
              }
              dropDownItemStyle={styleEditExpenses.dropDownItemStyle}
              dropDownItemTextStyle={styleEditExpenses.dropDownItemTextStyle}
              activeColor={globalColors.background}
              inputProps={[
                styleEditExpenses.inputButtons,
                styleEditExpenses.dropdown,
              ]}
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
                setExpense({...expense, tags: [parseInt(text)]});
              }}
              list={tagsList}
              dropDownStyle={styleEditExpenses.dropDownStyle}
              dropDownItemSelectedStyle={
                styleEditExpenses.dropDownItemSelectedStyle
              }
              dropDownItemStyle={styleEditExpenses.dropDownItemStyle}
              dropDownItemTextStyle={styleEditExpenses.dropDownItemTextStyle}
              activeColor={globalColors.background}
              inputProps={[
                styleEditExpenses.inputButtons,
                styleEditExpenses.dropdown,
              ]}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styleEditExpenses.buttonContainer}>
        <Button
          mode="contained"
          onPress={updateExpense}
          style={styleEditExpenses.button}>
          Actualizar
        </Button>
      </View>
    </View>
  );
};
