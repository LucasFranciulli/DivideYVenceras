import {StyleSheet} from 'react-native';
import {globalColors} from '../../themes/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.background,
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
    color: globalColors.primary,
  },
  noDataText: {
    textAlign: 'center',
    color: globalColors.text,
  },
  chartContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  chartTitle: {
    textAlign: 'center',
    marginBottom: 10,
    color: globalColors.primary,
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
