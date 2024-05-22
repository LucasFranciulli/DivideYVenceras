import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {Expense} from '../../utils/Expense';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {globalColors} from '../../themes/theme';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ExpenseCard} from '../../components/expense/ExpenseCard';
import Toast from 'react-native-toast-message';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../App';
import Icon from 'react-native-vector-icons/Ionicons';

export type EditExpensesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EditExpenses'
>;

export const ProfileScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const navigation = useNavigation<EditExpensesScreenNavigationProp>();

  useFocusEffect(
    React.useCallback(() => {
      const fetchExpenses = async () => {
        try {
          const storedExpenses = await AsyncStorage.getItem('expenses');
          if (storedExpenses) {
            setExpenses(JSON.parse(storedExpenses));
          }
        } catch (error) {
          console.error('Error fetching expenses:', error);
        }
      };

      fetchExpenses();
    }, []),
  );

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
      showToastSuccess={showToastSuccess}
      showToastError={showToastError}
      navigation={navigation}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="displayLarge" style={styles.title}>
          Lista de Gastos
        </Text>
        <Icon name={'log-out-outline'} size={40} onPress={() => navigation.navigate('LoginScreen')}/>
      </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: globalColors.primary,
  },
  itemDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 30,
    paddingBottom: 15,
  },
  title: {
    color: globalColors.primary,
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 20,
    marginBottom: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
  },
  circleFixed: {
    borderRadius: 7.5,
    width: 15,
    height: 15,
    backgroundColor: globalColors.secondary,
  },
  circleNotFixed: {
    borderRadius: 7.5,
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: globalColors.dark,
    backgroundColor: globalColors.background,
  },
  circleContainerItem: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  circleContainer: {
    flexDirection: 'row',
    gap: 30,
    alignItems: 'center',
    paddingBottom: 20,
  },
  circleText: {
    color: globalColors.primary,
  },
});
