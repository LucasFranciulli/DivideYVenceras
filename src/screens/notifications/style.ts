import {StyleSheet} from 'react-native';
import {globalColors} from '../../themes/theme';

export const styles = StyleSheet.create({
  title: {
    color: globalColors.primary,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
});
