import { StyleSheet } from "react-native";
import { globalColors } from "../../themes/theme";

export const styles = StyleSheet.create({
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
    noDataText: {
        alignSelf: 'center',
        marginTop: 20,
        fontSize: 18,
        color: '#666',
    },
});

export const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };
  