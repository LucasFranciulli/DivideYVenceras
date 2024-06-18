// GroupExpensesScreen.tsx
import React from 'react';
import { View, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { Expense } from '../../utils/Expense';
import { ExpenseCard } from '../../components/expense/ExpenseCard';
import { RootStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

interface Props {
  expenses: Expense[];
  deleteExpense: (id: number) => Promise<void>;
}

export type EditExpensesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EditExpenses'
>;

const GroupExpensesScreen = ({ expenses, deleteExpense }: Props) => {
    const navigation = useNavigation<EditExpensesScreenNavigationProp>();
    const renderItem = ({ item }: { item: Expense }) => (
        <ExpenseCard
        item={item}
        deleteExpense={deleteExpense}
        navigation={navigation}
        />
    );

    return (
        <View style={{ flex: 1 }}>
        {expenses.length === 0 ? (
            <Text>No hay gastos grupales.</Text>
        ) : (
            <FlatList
            data={expenses}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            />
        )}
        </View>
    );
};

export default GroupExpensesScreen;
