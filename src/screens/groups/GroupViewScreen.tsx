import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, TextInput, View} from 'react-native';
import {stylesViewGroup} from './style';
import {Text, Modal, Button, Divider} from 'react-native-paper';
import {RootStackParamList} from '../../../App';
import {RouteProp, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {User} from '../../utils/User';
import {globalColors} from '../../themes/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Expense} from '../../utils/Expense';
import {ExpenseCard} from '../../components/expense/ExpenseCard';
import {showToastError, showToastSuccess} from '../../utils/ToastActions';
import {getGroupById} from './services/group';
import {GrupoByID, UsuarioByIdGroups} from '../../utils/GroupById';
import Clipboard from '@react-native-clipboard/clipboard';

type GroupViewScreenRouteProp = RouteProp<RootStackParamList, 'GroupView'>;

export const GroupViewScreen = () => {
  const route = useRoute<GroupViewScreenRouteProp>();
  const {group, exitGroup, updateGroupUsers, navigation} = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [users, setUsers] = useState<UsuarioByIdGroups[]>([]);

  const [notShowUsers, setNotShowUsers] = useState(true);
  const handlenotShowUsers = () => {
    setNotShowUsers(!notShowUsers);
  };

  const [groupExpenses, setGroupExpenses] = useState<Expense[]>([]);

  const handleGetGroupById = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const groupByIdData: GrupoByID = await getGroupById(group.id, token);
      setUsers(groupByIdData.usuarios);
    }
  };
  useEffect(() => {
    handleGetGroupById();
  }, []);

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

  const renderUserItem = ({item}: any) => (
    <View style={stylesViewGroup.userItem}>
      <Text style={stylesViewGroup.userItemBullet}>•</Text>
      <Text style={stylesViewGroup.userItemText}>
        {item.nombre} {item.apellido}
      </Text>
    </View>
  );

  const deleteExpense = async (id: number) => {
    try {
      const filteredExpenses = groupExpenses.filter(
        expense => expense.id !== id,
      );
      await AsyncStorage.setItem(
        'groupExpenses',
        JSON.stringify(filteredExpenses),
      );
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
        <Text variant="displaySmall" style={stylesViewGroup.title}>
          {group.nombre}
        </Text>
        <Icon
          name={'log-out-outline'}
          size={40}
          onPress={() => {
            exitGroup(group.id);
            navigation.navigate('BottomTabsHomeNavigator');
          }}
        />
      </View>
      <Pressable
        onPress={() => {
          Clipboard.setString(group.token);
        }}
        style={{
          backgroundColor: globalColors.backgroundHighlited,
          flexDirection: 'column',
          marginBottom: 10,
          alignItems: 'center',
          alignSelf: 'center',
          width: '95%',
          borderRadius: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text variant="titleMedium" style={stylesViewGroup.code}>
            Código de grupo:
          </Text>
          <Icon name={'copy'} size={20} color={globalColors.primary} />
        </View>
        <Text variant="titleMedium" style={stylesViewGroup.code}>
          {group.token}
        </Text>
      </Pressable>
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
    </View>
  );
};

export default GroupViewScreen;
