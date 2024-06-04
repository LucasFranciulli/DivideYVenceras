import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {Text} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Expense} from '../../utils/Expense';
import {PieChart, LineChart, BarChart} from 'react-native-chart-kit';
import {globalColors} from '../../themes/theme';
import { chartConfig, styles } from './style';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const screenWidth = Dimensions.get('window').width;

export const ActivityScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchExpenses = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('expenses');
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      } else {
        setExpenses([]); // Si no hay gastos, establece un array vacío
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const generateRandomColor = () => {
    let color = '#';
    while (color.length < 7) {
      color += Math.floor(Math.random() * 16).toString(16);
    }
    return color;
  };

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
      name: `$  ${category}`,
      amount: categoryMap[category],
      color: generateRandomColor(),
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));
  };

  const getTagsData = () => {
    const TagMap: {[key: string]: number} = {};

    expenses.forEach(expense => {
      if (expense.tag) {
        if (!TagMap[expense.tag]) {
          TagMap[expense.tag] = 0;
        }
        TagMap[expense.tag] += expense.amount;
      }
    });

    return Object.keys(TagMap).map(category => ({
      name: `$  ${category}`,
      amount: TagMap[category],
      color: generateRandomColor(),
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));
  };

  const getTotalAmountData = () => {
    let totalAmount = 0;
    const data = expenses.map(expense => {
      totalAmount += expense.amount;
      return totalAmount;
    });
    return data;
  };

  const getFixedVsNonFixedData = () => {
    const fixedTotal = expenses
      .filter(expense => expense.isFixed)
      .reduce((total, expense) => total + expense.amount, 0);
    const nonFixedTotal = expenses
      .filter(expense => !expense.isFixed)
      .reduce((total, expense) => total + expense.amount, 0);
    return {
      labels: ['Gastos Fijos', 'Gastos No Fijos'],
      datasets: [
        {
          data: [fixedTotal, nonFixedTotal],
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        },
      ],
    };
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text variant="displayLarge" style={styles.title}>
        Resumen de Gastos
      </Text>
      {expenses.length === 0 ? (
        <Text style={styles.noDataText}>No hay información de gastos.</Text>
      ) : (
        <>
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
          <View style={styles.chartContainer}>
            <Text variant="headlineSmall" style={styles.chartTitle}>
              Gastos por Tags
            </Text>
            <PieChart
              data={getTagsData()}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
          <View style={styles.chartContainer}>
            <Text variant="headlineSmall" style={styles.chartTitle}>
              Suma Total de Gastos
            </Text>
            <LineChart
              data={{
                labels: expenses.map(expense =>
                  new Date(expense.date).toLocaleDateString(),
                ),
                datasets: [
                  {
                    data: getTotalAmountData(),
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    strokeWidth: 2,
                  },
                ],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              fromZero
              xLabelsOffset={2}
            />
          </View>
          <View style={styles.chartContainer}>
            <Text variant="headlineSmall" style={styles.chartTitle}>
              Gastos Fijos vs Gastos No Fijos
            </Text>
            <BarChart
              data={getFixedVsNonFixedData()}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                ...chartConfig,
              }}
              fromZero
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default ActivityScreen;
