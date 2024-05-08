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
        </Stack.Navigator>
      </NavigationContainer>
      {/* </SafeAreaView> */}
      <Toast />
    </PaperProvider>
  );
}

export default App;
