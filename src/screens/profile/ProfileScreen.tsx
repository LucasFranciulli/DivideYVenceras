import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {Expense} from '../../utils/Expense';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {globalColors} from '../../themes/theme';
import {useFocusEffect} from '@react-navigation/native';

export const ProfileScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

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
    <View style={styles.itemContainer}>
      <View style={styles.itemDataContainer}>
        <Text variant="headlineSmall">{item.name}</Text>
        <Text variant="headlineSmall">{item.description}</Text>
        <Text variant="headlineSmall">${item.amount}</Text>
      </View>
      <Button
        style={styles.button}
        textColor={globalColors.background}
        onPress={() => deleteExpense(item.id)}>
        Eliminar
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text variant="displayLarge" style={styles.title}>
        Lista de Gastos
      </Text>
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
});
