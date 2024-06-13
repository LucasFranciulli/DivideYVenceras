import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, TextInput, View} from 'react-native';
import {stylesViewGroup} from './style';
import {Text, Modal, Button, Divider} from 'react-native-paper';
import {RootStackParamList} from '../../../App';
import {RouteProp, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {User} from '../../utils/Users';
import {globalColors} from '../../themes/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Expense} from '../../utils/Expense';
import { ExpenseCard } from '../../components/expense/ExpenseCard';
import { showToastError, showToastSuccess } from '../../utils/ToastActions';

type GroupViewScreenRouteProp = RouteProp<RootStackParamList, 'GroupView'>;

export const GroupViewScreen = () => {
  const route = useRoute<GroupViewScreenRouteProp>();
  const {group, exitGroup, updateGroupUsers, navigation} = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [users, setUsers] = useState<User[]>(group.usuarios);

  const [notShowUsers, setNotShowUsers] = useState(true);
  const handlenotShowUsers = () => {
    setNotShowUsers(!notShowUsers);
  };

  const [groupExpenses, setGroupExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const loadGroupExpenses = async () => {
      try {
        const storedGroupExpenses = await AsyncStorage.getItem('groupExpenses');
        if (storedGroupExpenses) {
          const parsedExpenses = JSON.parse(storedGroupExpenses);
          if (parsedExpenses && typeof parsedExpenses === 'object') {
            const currentGroupExpenses = parsedExpenses[group.id] || [];
            setGroupExpenses(currentGroupExpenses);
          } else {
            console.error(
              'Stored expenses data is not a valid object:',
              parsedExpenses,
            );
          }
        }
      } catch (error) {
        console.error('Error loading group expenses:', error);
      }
    };

    loadGroupExpenses();
  }, [group.id]);

  const addUser = async () => {
    if (newUserName.trim()) {
      const newUser = {id: users.length + 1, nombre: newUserName};
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setNewUserName('');
      setModalVisible(false);

      // Update users in AsyncStorage
      await updateGroupUsers(group.id, updatedUsers);
    }
  };

  const renderUserItem = ({item}: any) => (
    <View style={stylesViewGroup.userItem}>
      <Text style={stylesViewGroup.userItemBullet}>•</Text>
      <Text style={stylesViewGroup.userItemText}>{item.nombre}</Text>
    </View>
  );

  const deleteExpense = async (id: number) => {
    try {
      const filteredExpenses = groupExpenses.filter(expense => expense.id !== id);
      await AsyncStorage.setItem('groupExpenses', JSON.stringify(filteredExpenses));
      setGroupExpenses(filteredExpenses);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const msjError = (message: string) => {
    showToastError('Error', message);
  };

  const msjSuccess = (message: string) => {
    showToastSuccess(message, '');
  };

  const renderExpenseItem = ({item}: {item: Expense}) => (
    <ExpenseCard
      item={item}
      deleteExpense={deleteExpense}
      showToastSuccess={msjSuccess}
      showToastError={msjError}
      navigation={navigation}
    />
  );

  return (
    <View style={stylesViewGroup.container}>
      <View style={stylesViewGroup.header}>
        <Text variant="displayMedium" style={stylesViewGroup.title}>
          {group.nombre}
        </Text>
        <Pressable
          style={stylesViewGroup.addUsers}
          onPress={() => setModalVisible(true)}>
          <Text variant="titleMedium" style={stylesViewGroup.addButton}>
            Agregar
          </Text>
          <Icon
            name={'add-outline'}
            size={25}
            color={globalColors.background}
          />
        </Pressable>
        <Icon
          name={'log-out-outline'}
          size={40}
          onPress={() => {
            exitGroup(group.id);
            navigation.navigate('BottomTabsHomeNavigator');
          }}
        />
      </View>
      <Text variant="titleLarge" style={stylesViewGroup.code}>
        Código de grupo: {group.codigo}
      </Text>
      <View style={stylesViewGroup.usersList}>
        <View style={stylesViewGroup.userDropdown}>
          <Icon
            name={'people-circle-outline'}
            size={40}
            color={globalColors.primary}
          />
          <Text variant="titleLarge" style={{color: globalColors.dark}}>
            Usuarios
          </Text>
          <Pressable onPress={() => handlenotShowUsers()}>
            <Icon
              name={
                notShowUsers ? 'chevron-down-outline' : 'chevron-up-outline'
              }
              size={25}
              color={globalColors.dark}
            />
          </Pressable>
        </View>
        {!notShowUsers && (
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={item => item.id.toString()}
            style={stylesViewGroup.userList}
            ItemSeparatorComponent={<View style={stylesViewGroup.separetor} />}
          />
        )}
      </View>
      <Divider />
        {groupExpenses.length > 0 ? (
          <FlatList
            data={groupExpenses}
            renderItem={renderExpenseItem}
            style={stylesViewGroup.groupExpensesContainer}
            keyExtractor={item => item.id.toString()}
          />
        ) : (
          <Text style={stylesViewGroup.noGroupText}>
            No hay gastos en este grupo
          </Text>
        )}
      <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <View style={stylesViewGroup.modalContainer}>
          <Text variant="titleLarge" style={{color: globalColors.primary}}>
            ¿A quién deseas agregar?
          </Text>
          <TextInput
            style={stylesViewGroup.input}
            placeholder="Nombre del usuario"
            value={newUserName}
            onChangeText={setNewUserName}
          />
          <Pressable onPress={addUser} style={stylesViewGroup.addPressable}>
            <Text
              variant="titleMedium"
              style={{color: globalColors.background}}>
              Agregar usuario
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default GroupViewScreen;
