import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './style';
import { showToastError, showToastSuccess } from '../../utils/ToastActions';
import * as service from './services/register';

export const RegisterScreen = ({navigation}: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const handleHidePassword = () => {
    setHidePassword(!hidePassword);
  };

  const checkAllVoid = () => {
    return !username || !password || !passwordRepeat || 
    !firstname || !lastname || !email;
  }

  const onRegister = async () => {
    if(checkAllVoid()) {
      showToastError("Campos incompletos", "Todos los campos son obligatorios.");
      return;
    }
    if(email.indexOf("@") === -1) {
      showToastError("Error en el campo de mail", "Debe registrar correctamente un mail para crer el usuario.");
      return;
    }
    if(password !== passwordRepeat) {
      showToastError("Error en el campo de contraseña", "Las contraseñas no coinciden");
      return;
    }

    const response = service.register({
      nombre_usuario: username,
      nombre: firstname,
      apellido: lastname,
      email: email,
      contraseña: password
    })
    response.then( res => {
      showToastSuccess("Usuario creado con Éxito", "")
      navigation.navigate('LoginScreen', navigation);
    })
            .catch(error => showToastError("Error al crear el usuario", ""));
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.inputUser}>
        <Text variant="displayLarge" style={styles.titleText}>Crear usuario</Text>
          <View>
            <TextInput
              placeholder="Nombre"
              value={firstname}
              onChangeText={text => setFirstname(text)}
              style={styles.inputButtons}
              underlineColor="transparent" 
              activeUnderlineColor="transparent"
            />
            <TextInput
              placeholder="Apellido"
              value={lastname}
              onChangeText={text => setLastname(text)}
              style={styles.inputButtons}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={text => setEmail(text)}
              style={styles.inputButtons}
              keyboardType="email-address"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
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
              value={passwordRepeat}
              secureTextEntry={hidePassword}
              onChangeText={text => setPasswordRepeat(text)}
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

