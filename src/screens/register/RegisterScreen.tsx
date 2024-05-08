import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

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

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputUser: {
    gap: 20,
    width: '80%',
  },
  inputButtons: {
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rememberPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lowerContainers: {
    alignSelf: 'center',
    width: '100%',
    paddingTop: 50,
  },
  button: {
    backgroundColor: '#2d643f',
    width: '60%',
    alignSelf: 'center',
  },
  title: {
    alignItems: 'flex-end',
    width: '80%',
    paddingBottom: 50,
  },
  titleText: {
    color: '#2d643f',
  },
  register: {
    textDecorationLine: 'underline',
    alignSelf: 'flex-end',
    paddingTop: 70,
  },
});
