import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Checkbox, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './style';
import { showToastError, showToastSuccess } from '../../utils/ToastActions';

export const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [rememberPassword, setRememberPassword] = useState(false);

  useEffect(() => {
    const checkStoredCredentials = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedPassword = await AsyncStorage.getItem('password');
        if (storedUsername && storedPassword) {
          setUsername(storedUsername);
          setPassword(storedPassword);
          onLogin(storedUsername, storedPassword, true);
        }
      } catch (e) {
        console.error('Failed to load credentials', e);
      }
    };

    checkStoredCredentials();
  }, []);

  const handleHidePassword = () => {
    setHidePassword(!hidePassword);
  };

  const onLogin = async (inputUsername: string, inputPassword: string, skipSave = false) => {
    const usernameToCheck = inputUsername || username;
    const passwordToCheck = inputPassword || password;

    if (usernameToCheck === 'test' && passwordToCheck === '1234') {
      showToastSuccess('Se logeo con exito!', '');
      if (rememberPassword && !skipSave) {
        try {
          await AsyncStorage.setItem('username', usernameToCheck);
          await AsyncStorage.setItem('password', passwordToCheck);
        } catch (e) {
          console.error('Failed to save credentials', e);
        }
      }
      navigation.navigate('BottomTabsHomeNavigator', navigation);
    } else {
      showToastError('Error', 'Usuario o contraseña incorrectos');
    }
  };

  const handleLogin = () => {
    onLogin(username, password);
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.title}>
          <Text variant="displayLarge" style={styles.titleText}>
            Divide y
          </Text>
          <Text variant="displayLarge" style={styles.titleText}>
            Venceras
          </Text>
        </View>
        <View style={styles.inputUser}>
          <TextInput
            placeholder="Usuario"
            value={username}
            onChangeText={text => setUsername(text)}
            style={styles.inputButtons}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />
          <View>
            <TextInput
              placeholder="Contraseña"
              value={password}
              secureTextEntry={hidePassword}
              onChangeText={text => setPassword(text)}
              style={styles.inputButtons}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              right={
                <TextInput.Icon
                  icon={() => (
                    <Icon
                      name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                      size={24}
                      onPress={handleHidePassword}
                    />
                  )}
                />
              }
            />
            <View style={styles.optionsContainer}>
              <View style={styles.rememberPasswordContainer}>
                <Checkbox.Android
                  status={rememberPassword ? 'checked' : 'unchecked'}
                  onPress={() => setRememberPassword(!rememberPassword)}
                  color={'#2d643f'}
                  uncheckedColor={'grey'}
                />
                <Text variant="bodyMedium">Recordar</Text>
              </View>
              <Pressable
                onPress={() => console.log('Olvidaste tu contraseña clicked!')}>
                <Text variant="bodyMedium">¿Olvidaste tu contraseña?</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View style={styles.lowerContainers}>
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Iniciar sesión
          </Button>
        </View>
        <View>
          <Pressable onPress={() => navigation.navigate('RegisterScreen')}>
            <Text variant="labelLarge" style={styles.register}>
              Registrarse
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
