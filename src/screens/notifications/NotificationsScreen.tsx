import React from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { EditExpensesScreenNavigationProp } from '../profile/ProfileScreen';
import { useNavigation } from '@react-navigation/native';

export const NotificationsScreen = () => {
  const navigation = useNavigation<EditExpensesScreenNavigationProp>();
  return (
    <View>
      <Text>Notifications Screen</Text>
      <Icon
          name={'log-out-outline'}
          size={40}
          onPress={() => navigation.navigate('LoginScreen')}
        />
    </View>
  );
};
