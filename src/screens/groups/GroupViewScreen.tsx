import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { stylesViewGroup } from './style';
import { Text, Modal, Button } from 'react-native-paper';
import { RootStackParamList } from '../../../App';
import { RouteProp, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { User } from '../../utils/Users';
import { globalColors } from '../../themes/theme';

type GroupViewScreenRouteProp = RouteProp<RootStackParamList, 'GroupView'>;

export const GroupViewScreen = () => {
  const route = useRoute<GroupViewScreenRouteProp>();
  const { group, exitGroup, updateGroupUsers, navigation } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [users, setUsers] = useState<User[]>(group.usuarios);

  const [notShowUsers, setNotShowUsers] = useState(true);
  const handlenotShowUsers = () => {
    setNotShowUsers(!notShowUsers);
  };

  const addUser = async () => {
    if (newUserName.trim()) {
      const newUser = { id: users.length + 1, nombre: newUserName };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setNewUserName('');
      setModalVisible(false);

      // Update users in AsyncStorage
      await updateGroupUsers(group.id, updatedUsers);
    }
  };

  const renderUserItem = ({ item }: any) => (
    <View style={stylesViewGroup.userItem}>
      <Text style={stylesViewGroup.userItemBullet}>•</Text>
      <Text style={stylesViewGroup.userItemText}>{item.nombre}</Text>
    </View>
  );

  return (
    <View style={stylesViewGroup.container}>
      <View style={stylesViewGroup.header}>
        <Text variant="displayLarge" style={stylesViewGroup.title}>
          {group.nombre}
        </Text>
        <Pressable
          style={stylesViewGroup.addUsers}
          onPress={() => setModalVisible(true)}>
          <Text variant="titleMedium" style={stylesViewGroup.addButton}>
            Agregar
          </Text>
          <Icon
            name={'add-outline'}
            size={25}
            color={globalColors.background}
          />
        </Pressable>
        <Icon
          name={'log-out-outline'}
          size={40}
          onPress={() => {
            exitGroup(group.id);
            navigation.navigate('ListGroups');
          }}
        />
      </View>
      <View style={stylesViewGroup.usersList}>
        <View style={stylesViewGroup.userDropdown}>
          <Icon
            name={'people-circle-outline'}
            size={40}
            color={globalColors.primary}
          />
          <Text variant="titleLarge" style={{ color: globalColors.dark }}>
            Usuarios
          </Text>
          <Pressable onPress={() => handlenotShowUsers()}>
            <Icon
              name={notShowUsers ? 'chevron-down-outline' : 'chevron-up-outline'}
              size={25}
              color={globalColors.dark}
            />
          </Pressable>
        </View>
        {!notShowUsers && (
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={item => item.id.toString()}
            style={stylesViewGroup.userList}
            ItemSeparatorComponent={<View style={stylesViewGroup.separetor} />}
          />
        )}
      </View>
      <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <View style={stylesViewGroup.modalContainer}>
          <Text variant="titleLarge" style={{ color: globalColors.primary }}>
            ¿A quién deseas agregar?
          </Text>
          <TextInput
            style={stylesViewGroup.input}
            placeholder="Nombre del usuario"
            value={newUserName}
            onChangeText={setNewUserName}
          />
          <Pressable onPress={addUser} style={stylesViewGroup.addPressable}>
            <Text
              variant="titleMedium"
              style={{ color: globalColors.background }}>
              Agregar usuario
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};
