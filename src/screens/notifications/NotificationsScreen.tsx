import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {EditExpensesScreenNavigationProp} from '../profile/ProfileScreen';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'react-native-paper';
import { styles } from './style';

export const NotificationsScreen = () => {
  const navigation = useNavigation<EditExpensesScreenNavigationProp>();
  return (
    <View style={styles.titleContainer}>
      <Text variant="displayLarge" style={styles.title}>
        Perfil
      </Text>
      <Icon
        name={'log-out-outline'}
        size={40}
        onPress={() => navigation.navigate('LoginScreen')}
      />
    </View>
  );
};
