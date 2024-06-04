import React from 'react';
import {SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PaperProvider} from 'react-native-paper';
/* import {StackNavigator} from './src/navigation/StackNavigator'; */
import {LoginScreen} from './src/screens/login/LoginScreen';
import {RegisterScreen} from './src/screens/register/RegisterScreen';
import {HomeScreen} from './src/screens/home/HomeScreen';
import Toast from 'react-native-toast-message';
import {BottomTabsHomeNavigator} from './src/navigation/BottomHomeTabsNavigation';
import {EditExpensesScreen} from './src/screens/expenses/EditExpensesScreen';
import {Expense} from './src/utils/Expense';
import {EditExpensesScreenNavigationProp} from './src/screens/profile/ProfileScreen';
import { GroupViewScreen } from './src/screens/groups/GroupViewScreen';

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  HomeScreen: undefined;
  EditExpenses: {item: Expense; navigation: EditExpensesScreenNavigationProp};
  BottomTabsHomeNavigator: undefined;
  GroupViewScreen: undefined;
};

function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();

  return (
    <PaperProvider>
      {/* <SafeAreaView> */}
      <NavigationContainer>
        {/* <LoginScreen /> */}
        {/* <StackNavigator /> */}
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditExpenses"
            component={EditExpensesScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="GroupViewScreen"
            component={GroupViewScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="BottomTabsHomeNavigator"
            component={BottomTabsHomeNavigator}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {/* </SafeAreaView> */}
      <Toast />
    </PaperProvider>
  );
}

export default App;
