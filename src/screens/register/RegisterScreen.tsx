import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './style';

export const RegisterScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const handleHidePassword = () => {
    setHidePassword(!hidePassword);
  };

  const onRegister = () => {
    console.log('Login clicked!');
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.inputUser}>
        <Text variant="displayLarge" style={styles.titleText}>Crear usuario</Text>
          <View>
            <TextInput
              placeholder="Usuario"
              value={username}
              onChangeText={text => setUsername(text)}
              style={styles.inputButtons}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
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
            <TextInput
              placeholder="Repita su contraseña"
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
          </View>
        </View>
        <View style={styles.lowerContainers}>
          <Button mode="contained" onPress={onRegister} style={styles.button}>
            Registrarse
          </Button>
        </View>
      </View>
    </View>
  );
};

