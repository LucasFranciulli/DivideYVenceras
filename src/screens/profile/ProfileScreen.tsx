import React, {useState} from 'react';
import {Dimensions, FlatList, View} from 'react-native';
import {Text} from 'react-native-paper';
import {Expense} from '../../utils/Expense';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ExpenseCard} from '../../components/expense/ExpenseCard';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../App';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from './style';
import {showToastError, showToastSuccess} from '../../utils/ToastActions';
import {Filters} from '../../components/filters/Filters';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PersonalExpensesScreen from './PersonalExpensesScreen';
import GroupExpensesScreen from './GroupExpensesScreen';
import { SceneMap, SceneRendererProps, TabBar, TabView } from 'react-native-tab-view';

export type EditExpensesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EditExpenses'
>;

export const ProfileScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const navigation = useNavigation<EditExpensesScreenNavigationProp>();
  const [filter, setFilter] = useState('week');

  useFocusEffect(
    React.useCallback(() => {
      const fetchExpenses = async () => {
        try {
          const storedExpenses = await AsyncStorage.getItem('expenses');
          const token = await AsyncStorage.getItem('token');
          if (storedExpenses) {
            setExpenses(JSON.parse(storedExpenses));
          }
          if (token) {
            const t = JSON.parse(token)
            console.log(t);
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
        expenses={expenses}
        deleteExpense={deleteExpense}
      />
    ),
    group: () => (
      <GroupExpensesScreen
        expenses={expenses}
        deleteExpense={deleteExpense}
      />
    ),
  });

  const deleteExpense = async (id: number) => {
    try {
      const filteredExpenses = expenses.filter(expense => expense.id !== id);
      await AsyncStorage.setItem('expenses', JSON.stringify(filteredExpenses));
      setExpenses(filteredExpenses);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };
  
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'personal', title: 'Historial' },
    { key: 'group', title: 'Gastos de Grupo' },
  ]);
  const renderItem = ({item}: {item: Expense}) => (
    <ExpenseCard
      item={item}
      deleteExpense={deleteExpense}
      navigation={navigation}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="displayLarge" style={styles.title}>
          Gastos
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <TabView
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: 'black' }}
              style={{ backgroundColor: 'white' }}
              labelStyle={{ color: 'black' }} />
          )} 
          renderScene={renderScene}        
          />
      </View>
    </View>
  );
};
