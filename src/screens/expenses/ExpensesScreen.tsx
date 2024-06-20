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
import {ExpenseRequest} from '../../utils/ExpenseRequest';
import {postExpenseGrupal} from './services/grupalExpense';
import {postExpensePersonal} from './services/personalExpense';
import {GroupRequest} from '../../utils/GroupRequest';
import {getMyGroups} from './services/getMyGroups';
import {getMyTags, getMyTagsGroups, postTag} from './services/tags';
import {Tag} from '../../utils/Tag';

export const ExpensesScreen = () => {
  const [showDropDownCategories, setShowDropDownCategories] = useState(false);
  const [showDropDownTags, setShowDropDownTags] = useState(false);

  const [showDropDownFrequency, setShowDropDownFrequency] = useState(false);
  const [frequency, setFrequency] = useState('anualmente');
  const frequencyOptions = [
    {label: 'Semanalmente', value: 'semanalmente'},
    {label: 'Mensualmente', value: 'mensualmente'},
    {label: 'Anualmente', value: 'anualmente'},
  ];

  const [visibleModalFinished, setVisibleModalFinished] = useState(false);
  const [visibleModalRemove, setVisibleModalRemove] = useState(false);

  const showModalFinished = () => setVisibleModalFinished(true);
  const hideModalFinished = () => setVisibleModalFinished(false);
  const showModalRemove = () => setVisibleModalRemove(true);
  const hideModalRemove = () => setVisibleModalRemove(false);

  const [categoriesList, setCategoriesList] = useState<Category[]>([]);

  const [categotySelected, setCategotySelected] = useState<Category | null>(
    null,
  );
  const [currentCategory, setCurrentCategory] = useState('');

  const [newTag, setNewTag] = useState('');
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [expense, setExpense] = useState<ExpenseRequest>({
    nombre: '',
    descripcion: '',
    monto: 0,
    fecha: '19/06/2024',
    id_categoria: 1,
    tags: [],
    saldado: false,
  });
  const [checked, setChecked] = useState(false);
  const [checkedPagado, setCheckedPagado] = useState(false);

  const [groupList, setGroupList] = useState<GroupRequest[]>([]);
  const [currentGroup, setCurrentGroup] = useState<number>();
  const [showDropDownGroups, setShowDropDownGroups] = useState(false);
  const loadGroups = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const myGroups = await getMyGroups(token);
        setGroupList(myGroups);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };
  const loadCategories = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const categories = await getCategorias(token);
      setCategoriesList(categories);
    }
  };
  /* const loadTags = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const tags = await getMyTags(token);
      setTagList(tags);
    }
  }; */
  const loadTags = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        if (currentGroup) {
          const storedTags = await getMyTagsGroups(token, currentGroup);
          if (storedTags !== undefined) {
            setTagList(storedTags);
          }
        } else {
          const storedTags = await getMyTags(token);
          if (storedTags !== undefined) {
            setTagList(storedTags);
          }
        }
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };
  useEffect(() => {
    loadGroups();

    loadCategories();

    loadTags();
  }, []);

  const addExpense = async () => {
    try {
      const typeExpense = checked ? 'fijo' : 'casual';
      const token = await AsyncStorage.getItem('token');
      if (token) {
        if (currentGroup) {
          await postExpenseGrupal(expense, token, typeExpense, currentGroup);
        } else {
          if (typeExpense === 'fijo') {
            const newExpense = {
              nombre: expense.nombre,
              descripcion: expense.descripcion,
              monto: expense.monto,
              fecha: expense.fecha,
              id_categoria: expense.id_categoria,
              tags: expense.tags,
              saldado: expense.saldado,
              frecuencia: 'mensualmente',
            };
            await postExpensePersonal(newExpense, token, typeExpense);
          } else {
            await postExpensePersonal(expense, token, typeExpense);
          }
        }
      }

      setExpense({
        nombre: '',
        descripcion: '',
        monto: 0,
        fecha: '19/06/2024',
        id_categoria: 1,
        tags: [],
        saldado: false,
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

    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const newTagReq = {
          nombre: newTag,
          descripcion: '',
          color: '',
        };
        const resultTags = await postTag(newTagReq, token);
        /* newTagReq.id_grupo = currentGroup ? currentGroup : undefined; */

        setTagList(prevTag => [...prevTag, resultTags as unknown as Tag]);
        setNewTag('');
        hideModalFinished();
        showToastSuccess('Tag añadido!', '');
      }
    } catch (error) {
      showToastError('Error', 'No se pudo agregar el tag');
      console.error('Error saving tag:', error);
    }
  };

  const removeTag = async () => {
    try {
      let tags = tagList.filter(tag => !selectedTags.includes(tag));
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
    setExpense({...expense, id_categoria: parseInt(currentCategory)});
    const c = categoriesList.find(obj => obj.nombre === currentCategory);
    if (c) {
      setCategotySelected(c);
      setExpense({...expense, id_categoria: c.id});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory]);

  function formatDateToDDMMYYYY(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    const fechaFormateada = formatDateToDDMMYYYY(date);
    setExpense({...expense, fecha: fechaFormateada});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(() => {
    loadTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGroup]);

  useEffect(() => {
    setExpense({...expense, tags: [Number(currentTag)]});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags, currentTag]);


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
                value: gr.id,
              }))}
            />
          </View>
          {/* {currentGroup && (
            <View style={styleListExpenses.inputContainer}>
              <DropDown
                label={'Frecuencia'}
                mode={'outlined'}
                visible={showDropDownFrequency}
                showDropDown={() => setShowDropDownFrequency(true)}
                onDismiss={() => setShowDropDownFrequency(false)}
                value={frequency}
                setValue={setFrequency}
                list={frequencyOptions}
              />
            </View>
          )} */}
        </View>
        <View style={styleListExpenses.inputContainer}>
          <View style={styleListExpenses.inputContainer}>
            <Text variant="headlineSmall" style={styleListExpenses.inputTitle}>
              Tags
            </Text>
            {tagList && tagList.length > 0 && (
              <DropDown
                mode={'outlined'}
                placeholder="Tags"
                visible={showDropDownTags}
                showDropDown={() => setShowDropDownTags(true)}
                onDismiss={() => setShowDropDownTags(false)}
                value={currentTag}
                setValue={setCurrentTag}
                list={tagList.map(c => ({
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
            )}
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
          {currentGroup === undefined && <View
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
          </View>}
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
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <View style={styleListExpenses.categoryItem}>
                  <Checkbox
                    status={
                      selectedTags.includes(item) ? 'checked' : 'unchecked'
                    }
                    onPress={() => toggleTagSelection(item.id.toString())}
                  />
                  <Text style={styleListExpenses.categoryItemText}>
                    {item.nombre}
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
