import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, View} from 'react-native';
import {Text} from 'react-native-paper';
import {Expense} from '../../utils/Expense';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ExpenseCard} from '../../components/expense/ExpenseCard';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../App';
import {styles} from './style';
import {showToastError, showToastSuccess} from '../../utils/ToastActions';
import PersonalExpensesScreen from './PersonalExpensesScreen';
import GroupExpensesScreen from './GroupExpensesScreen';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import * as service from './services/expenses';
import {parsePersonalResults} from '../../utils/parsePersonalExpenses';
import {parseGroupResults} from '../../utils/parseGroupExpenses';
import {globalColors} from '../../themes/theme';
import {Filters} from '../../components/filters/Filters';

export type EditExpensesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EditExpenses'
>;

export const ProfileScreen = () => {
  const [personalExpenses, setPersonalExpenses] = useState<Expense[]>([]);
  const [groupExpenses, setGroupExpenses] = useState<Expense[]>([]);
  const [personalExpensesFiltered, setPersonalExpensesFiltered] = useState<Expense[]>([]);
  const [groupExpensesFiltered, setGroupExpensesFiltered] = useState<Expense[]>([]);
  const navigation = useNavigation<EditExpensesScreenNavigationProp>();
  const [filter, setFilter] = useState('week');

  useFocusEffect(
    React.useCallback(() => {
      const fetchExpenses = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (token) {
            const response = await service.getPersonalExpenses(token);
            const personalExpensesResponse = parsePersonalResults(response);
            setPersonalExpenses(personalExpensesResponse);

            const responseGroups = await service.getGroupExpenses(token);
            const groupExpensesResponse = parseGroupResults(responseGroups);
            setGroupExpenses(groupExpensesResponse);
          }
        } catch (error) {
          console.error('Error fetching expenses:', error);
        }
      };

      fetchExpenses();
    }, []),
  );

  const handleSetFilter = (input: string) => {
    setFilter(input);
  };

  const msjError = (message: string) => {
    showToastError('Error', message);
  };

  const msjSuccess = (message: string) => {
    showToastSuccess(message, '');
  };

  const renderScene = SceneMap({
    personal: () => (
      <PersonalExpensesScreen
        expenses={personalExpensesFiltered}
        deleteExpense={deleteExpense}
      />
    ),
    group: () => (
      <GroupExpensesScreen
        expenses={groupExpensesFiltered}
        deleteExpense={deleteExpense}
      />
    ),
  });

  const deleteExpense = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const responseDeleted = await service.deleteExpense(token, id);
        if (responseDeleted) {
          const response = await service.getPersonalExpenses(token);
          const personalExpensesResponse = parsePersonalResults(response);
          setPersonalExpenses(personalExpensesResponse);

          const responseGroups = await service.getGroupExpenses(token);
          const groupExpensesResponse = parseGroupResults(responseGroups);
          setGroupExpenses(groupExpensesResponse);
        }
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'personal', title: 'Historial'},
    {key: 'group', title: 'Gastos de Grupo'},
  ]);

  useEffect(() => {
    applyFilter();
  }, [personalExpenses, groupExpenses, filter]);

  const applyFilter = () => {
    const now = new Date();
    let filteredPersonal: Expense[] = [];
    let filteredGroup: Expense[] = [];
    switch (filter) {
      case 'week':
        filteredPersonal = personalExpenses.filter(expense => {
          const expenseDate = new Date(expense.fecha);
          return now - expenseDate <= 7 * 24 * 60 * 60 * 1000;
        });
        setPersonalExpensesFiltered(filteredPersonal);
        filteredGroup = groupExpenses.filter(expense => {
          const expenseDate = new Date(expense.fecha);
          return now - expenseDate <= 7 * 24 * 60 * 60 * 1000;
        });
        setGroupExpensesFiltered(filteredGroup);
        break;
      case 'month':
        filteredPersonal = personalExpenses.filter(expense => {
          const expenseDate = new Date(expense.fecha);
          return now - expenseDate <= 30 * 24 * 60 * 60 * 1000;
        });
        setPersonalExpensesFiltered(filteredPersonal);
        filteredGroup = groupExpenses.filter(expense => {
          const expenseDate = new Date(expense.fecha);
          return now - expenseDate <= 30 * 24 * 60 * 60 * 1000;
        });
        setGroupExpensesFiltered(filteredGroup);
        break;
      case 'year':
        filteredPersonal = personalExpenses.filter(expense => {
          const expenseDate = new Date(expense.fecha);
          return now - expenseDate <= 365 * 24 * 60 * 60 * 1000;
        });
        setPersonalExpensesFiltered(filteredPersonal);
        filteredGroup = groupExpenses.filter(expense => {
          const expenseDate = new Date(expense.fecha);
          return now - expenseDate <= 365 * 24 * 60 * 60 * 1000;
        });
        setGroupExpensesFiltered(filteredGroup);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="displayLarge" style={styles.title}>
          Gastos
        </Text>
        <Filters filter={filter} handleSetFilter={handleSetFilter} />
      </View>
      <View style={{flex: 1}}>
        <TabView
          navigationState={{index, routes}}
          onIndexChange={setIndex}
          initialLayout={{width: Dimensions.get('window').width}}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{backgroundColor: 'black'}}
              style={{
                backgroundColor: globalColors.backgroundHighlited,
                marginBottom: 10,
                borderRadius: 5,
              }}
              labelStyle={{color: 'black'}}
            />
          )}
          renderScene={renderScene}
        />
      </View>
    </View>
  );
};
