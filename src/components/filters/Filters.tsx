import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { globalColors } from "../../themes/theme";

interface Props {
    filter: string;
    handleSetFilter: (input: string) => void;
}

export const Filters = ({filter, handleSetFilter}: Props) => {
  return (
    <View style={styles.filterContainer}>
      <Pressable
        style={[
          styles.filterButton,
          filter === 'week' && styles.activeFilterButton,
        ]}
        onPress={() => handleSetFilter('week')}>
        <Text
          style={[
            styles.filterButtonText,
            filter === 'week' && styles.activeFilterButtonText,
          ]}>
          Última Semana
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.filterButton,
          filter === 'month' && styles.activeFilterButton,
        ]}
        onPress={() => handleSetFilter('month')}>
        <Text
          style={[
            styles.filterButtonText,
            filter === 'month' && styles.activeFilterButtonText,
          ]}>
          Último Mes
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.filterButton,
          filter === 'year' && styles.activeFilterButton,
        ]}
        onPress={() => handleSetFilter('year')}>
        <Text
          style={[
            styles.filterButtonText,
            filter === 'year' && styles.activeFilterButtonText,
          ]}>
          Último Año
        </Text>
      </Pressable>
    </View>
  );
};

export const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
      },
      filterButton: {
        marginHorizontal: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: globalColors.secondary,
      },
      activeFilterButton: {
        backgroundColor: globalColors.primary,
      },
      filterButtonText: {
        color: globalColors.grey,
      },
      activeFilterButtonText: {
        color: globalColors.background,
      },
});