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
import { getPersonalExpenses } from './services/personalExpenses';
import { getgrupalExpenses } from './services/grupalExpenses';
import { deleteExpenseBD } from './services/deleteExpenses';

export type EditExpensesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EditExpenses'
>;

export const ProfileScreen = () => {
  const [personalExpenses, setPersonalExpenses] = useState<Expense[]>([]);
  const [grupalExpenses, setGrupalExpenses] = useState<Expense[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const navigation = useNavigation<EditExpensesScreenNavigationProp>();
  const [filter, setFilter] = useState('week');

  useFocusEffect(
    React.useCallback(() => {
      const fetchExpenses = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (token) {
            const resPersonalExpenses = await getPersonalExpenses(token);
            const resGrupalExpenses = await getgrupalExpenses(token);

            setPersonalExpenses(resPersonalExpenses);
            setGrupalExpenses(resGrupalExpenses);
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

  const renderScene = SceneMap({
    personal: () => (
      <PersonalExpensesScreen
        expenses={personalExpenses}
        deleteExpense={deleteExpense}
      />
    ),
    group: () => (
      <GroupExpensesScreen
        expenses={grupalExpenses}
        deleteExpense={deleteExpense}
      />
    ),
  });

  const deleteExpense = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const deleteEx = await deleteExpenseBD(token, id);
        if (deleteEx) {
          showToastSuccess('Gasto borrado con exito', '');
        }
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };
  
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'personal', title: 'Historial' },
    { key: 'group', title: 'Gastos de Grupo' },
  ]);

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
