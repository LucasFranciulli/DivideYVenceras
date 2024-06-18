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
import Icon from 'react-native-vector-icons/Ionicons';
import DropDown from 'react-native-paper-dropdown';
import {styleListExpenses} from './style';
import {showToastError, showToastSuccess} from '../../utils/ToastActions';
import DatePicker from 'react-native-date-picker';
import {getCategorias} from './services/categorias';
import {Category} from '../../utils/Category';
import { ExpenseRequest } from '../../utils/ExpenseRequest';
import { postExpenseGrupal } from './services/grupalExpense';
import { postExpensePersonal } from './services/personalExpense';
import { GroupRequest } from '../../utils/GroupRequest';
import { getMyGroups } from './services/getMyGroups';

export const ExpensesScreen = () => {
  const [showDropDownCategories, setShowDropDownCategories] = useState(false);
  const [showDropDownTags, setShowDropDownTags] = useState(false);

  const [showDropDownFrequency, setShowDropDownFrequency] = useState(false);
  const [frequency, setFrequency] = useState("anualmente");
  const frequencyOptions = [
    { label: "Semanalmente", value: "semanalmente" },
    { label: "Mensualmente", value: "mensualmente" },
    { label: "Anualmente", value: "anualmente" }
  ];

  const [visibleModalFinished, setVisibleModalFinished] = useState(false);
  const [visibleModalRemove, setVisibleModalRemove] = useState(false);

  const showModalFinished = () => setVisibleModalFinished(true);
  const hideModalFinished = () => setVisibleModalFinished(false);
  const showModalRemove = () => setVisibleModalRemove(true);
  const hideModalRemove = () => setVisibleModalRemove(false);

  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categotySelected, setCategotySelected] = useState<Category | null>(
    null,
  );
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentTag, setCurrentTag] = useState('');

  const [newTag, setNewTag] = useState('');
  const [tagList, setTagList] = useState([]);
  
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [expense, setExpense] = useState<ExpenseRequest>({
    nombre: "",
    descripcion: "",
    monto: 0,
    fecha: "",
    id_categoria: 0,
    tags: [],
    saldado: false
  });
  const [checked, setChecked] = useState(false);
  const [checkedPagado, setCheckedPagado] = useState(false);

  //TODO ESTO SACARLO
  const [groupList, setGroupList] = useState<GroupRequest[]>([]);
  const [currentGroup, setCurrentGroup] = useState<number>();
  const [showDropDownGroups, setShowDropDownGroups] = useState(false);
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if(token) {
          const myGroups = await getMyGroups(token);
          setGroupList(myGroups);
        }
      } catch (error) {
        console.error('Error loading groups:', error);
      }
    };
    loadGroups();

    const loadCategories = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const categories = await getCategorias(token);
        setCategoriesList(categories);
      }
    };
    loadCategories();
  }, []);

  const addExpense = async () => {
    try {
      const typeExpense = checked ? "fijo" : "casual";
      const token = await AsyncStorage.getItem("token");
      if (token) {
        if (currentGroup) {
          await postExpenseGrupal(expense, token, typeExpense, currentGroup);
        } else {
          await postExpensePersonal(expense, token, typeExpense);
        }
      }

      setExpense({
        nombre: "",
        descripcion: "",
        monto: 0,
        fecha: "",
        id_categoria: 0,
        tags: [],
        saldado: false
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
    setExpense({...expense, id_categoria: parseInt(currentCategory)});
    const c = categoriesList.find(obj => obj.nombre === currentCategory);
    if (c) {
      setCategotySelected(c);
      setExpense({...expense, id_categoria: c.id});
    }
  }, [currentCategory]);

  // useEffect(() => {
  //   setExpense({...expense, tags: tags});
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentTag]);

  useEffect(() => {
    setExpense({...expense, fecha: date.toString()});
  }, [date]);

  // useEffect(() => {
  //   setExpense({...expense, group: currentGroup});
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentGroup]);

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
              value={expense.nombre}
              onChangeText={text => setExpense({...expense, nombre: text})}
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
              value={expense.descripcion}
              onChangeText={text => setExpense({...expense, descripcion: text})}
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
              value={expense.monto.toString()}
              onChangeText={text =>
                setExpense({...expense, monto: Number(text)})
              }
              keyboardType="numeric"
              style={styleListExpenses.inputButtons}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
          </View>
          <View style={[styleListExpenses.inputContainer, {marginBottom: 10}]}>
            <Text variant="headlineSmall" style={styleListExpenses.inputTitle}>
              Fecha
            </Text>
            <Pressable
              onPress={() => setOpen(true)}
              style={styleListExpenses.datePickerButton}>
              <Text style={styleListExpenses.datePickerButtonText}>
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
          <View style={[styleListExpenses.inputContainer, {marginBottom: 10}]}>
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
              list={categoriesList.map(c => ({
                label: c.nombre.toUpperCase(),
                value: c.id,
              }))}
              dropDownStyle={styleListExpenses.dropDownStyle}
              dropDownItemSelectedStyle={
                styleListExpenses.dropDownItemSelectedStyle
              }
              dropDownItemStyle={styleListExpenses.dropDownItemStyle}
              dropDownItemTextStyle={styleListExpenses.dropDownItemTextStyle}
              activeColor={globalColors.background}
              inputProps={[
                styleListExpenses.inputButtons,
                styleListExpenses.dropdown,
              ]}
            />
          </View>
          <View style={styleListExpenses.inputContainer}>
            <Text variant="headlineSmall" style={styleListExpenses.inputTitle}>
              Grupo
            </Text>
            <DropDown
              label={'Seleccionar grupo'}
              mode={'outlined'}
              visible={showDropDownGroups}
              showDropDown={() => setShowDropDownGroups(true)}
              onDismiss={() => setShowDropDownGroups(false)}
              value={currentGroup}
              setValue={setCurrentGroup}
              list={groupList.map(gr => ({
                label: gr.nombre,
                value: gr.id
              }))}
            />
          </View>
          {
            currentGroup &&
            <View style={styleListExpenses.inputContainer}>
              <DropDown
                label={"Frecuencia"}
                mode={"outlined"}
                visible={showDropDownFrequency}
                showDropDown={() => setShowDropDownFrequency(true)}
                onDismiss={() => setShowDropDownFrequency(false)}
                value={frequency}
                setValue={setFrequency}
                list={frequencyOptions}
              />
            </View>
          }
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
              dropDownItemSelectedStyle={
                styleListExpenses.dropDownItemSelectedStyle
              }
              dropDownItemStyle={styleListExpenses.dropDownItemStyle}
              dropDownItemTextStyle={styleListExpenses.dropDownItemTextStyle}
              activeColor={globalColors.background}
              inputProps={[
                styleListExpenses.inputButtons,
                styleListExpenses.dropdown,
              ]}
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
              }}
            />
          </View>
          <View
            style={[
              styleListExpenses.fixedExpense,
              checked === false && styleListExpenses.notCheckedButtom,
            ]}>
            <Text
              variant="titleMedium"
              style={[
                styleListExpenses.addCategoriesButtonText,
                checkedPagado === false && styleListExpenses.notCheckedText,
              ]}>
              Pagado
            </Text>
            <Checkbox
              status={checkedPagado ? 'checked' : 'unchecked'}
              color={globalColors.background}
              onPress={() => {
                setCheckedPagado(!checkedPagado);
                setExpense({...expense, saldado: !checkedPagado});
              }}
            />
          </View>
          <Button
            mode="contained"
            onPress={addExpense}
            style={styleListExpenses.button}>
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
                <Text
                  variant="titleMedium"
                  style={styleListExpenses.nameTitleModal}>
                  Añadir
                </Text>
              </Button>
              <Button onPress={hideModalFinished}>
                <Text
                  variant="titleMedium"
                  style={styleListExpenses.nameTitleModal}>
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
              renderItem={({item}) => (
                <View style={styleListExpenses.categoryItem}>
                  <Checkbox
                    status={
                      selectedTags.includes(item.value)
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => toggleTagSelection(item.value)}
                  />
                  <Text style={styleListExpenses.categoryItemText}>
                    {item.label}
                  </Text>
                </View>
              )}
            />
            <View style={styleListExpenses.buttomModalButtons}>
              <Button onPress={removeTag}>
                <Text
                  variant="titleMedium"
                  style={styleListExpenses.nameTitleModal}>
                  Eliminar
                </Text>
              </Button>
              <Button onPress={hideModalRemove}>
                <Text
                  variant="titleMedium"
                  style={styleListExpenses.nameTitleModal}>
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
