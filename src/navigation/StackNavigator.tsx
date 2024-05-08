/* import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {RegisterScreen} from '../screens/register/RegisterScreen';
import {LoginScreen} from '../screens/login/LoginScreen';
import { HomeScreen } from '../screens/home/HomeScreen';

export type RootStackParams = {
  LoadingScreen: undefined;
  AuthScreen: undefined;
  HomeScreen: undefined;
  MyRoutes: undefined;
  Profile: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();

export const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
};
 */