import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View, Dimensions} from 'react-native';
import {Text} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Expense} from '../../utils/Expense';
import {PieChart} from 'react-native-chart-kit';
import { globalColors } from '../../themes/theme';

const screenWidth = Dimensions.get('window').width;

export const ActivityScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
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
  }, []);

  const getCategoryData = () => {
    const categoryMap: {[key: string]: number} = {};

    expenses.forEach(expense => {
      if (expense.category) {
        if (!categoryMap[expense.category]) {
          categoryMap[expense.category] = 0;
        }
        categoryMap[expense.category] += expense.amount;
      }
    });

    return Object.keys(categoryMap).map(category => ({
      name: category,
      amount: categoryMap[category],
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="displayLarge" style={styles.title}>
      Resumen de Gastos
      </Text>
      <View style={styles.chartContainer}>
        <Text variant="headlineSmall" style={styles.chartTitle}>
          Gastos por Categoría
        </Text>
        <PieChart
          data={getCategoryData()}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.background,
  },
  title: {
    paddingVertical: 30,
    alignSelf: 'center',
    color: globalColors.primary,
  },
  chartContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  chartTitle: {
    color: globalColors.secondary,
  },
});
