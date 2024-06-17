import React, {useState} from 'react';
import {FlatList, View} from 'react-native';
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

  const deleteExpense = async (id: number) => {
    try {
      const filteredExpenses = expenses.filter(expense => expense.id !== id);
      await AsyncStorage.setItem('expenses', JSON.stringify(filteredExpenses));
      setExpenses(filteredExpenses);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const renderItem = ({item}: {item: Expense}) => (
    <ExpenseCard
      item={item}
      deleteExpense={deleteExpense}
      showToastSuccess={msjSuccess}
      showToastError={msjError}
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
      {expenses.length === 0 ? (
        <Text style={styles.noDataText}>No hay gastos.</Text>
      ) : (
        <>
          <Filters filter={filter} handleSetFilter={handleSetFilter} />
          <View style={styles.circleContainer}>
            <View style={styles.circleContainerItem}>
              <View style={styles.circleFixed} />
              <Text variant="titleLarge" style={styles.circleText}>
                Gasto Fijo
              </Text>
            </View>
            <View style={styles.circleContainerItem}>
              <View style={styles.circleNotFixed} />
              <Text variant="titleLarge" style={styles.circleText}>
                Gasto Normal
              </Text>
            </View>
          </View>
          <FlatList
            data={expenses}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        </>
      )}
    </View>
  );
};
