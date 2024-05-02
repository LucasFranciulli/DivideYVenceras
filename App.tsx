import React from 'react';
import {SafeAreaView} from 'react-native';
import {LoginScreen} from './src/screens/login/LoginScreen';
import { PaperProvider } from 'react-native-paper';

function App(): React.JSX.Element {
  return (
    <PaperProvider>
      <SafeAreaView>
        <LoginScreen />
      </SafeAreaView>
    </PaperProvider>
  );
}

export default App;
