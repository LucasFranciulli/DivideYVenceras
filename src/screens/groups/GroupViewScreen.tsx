import React, {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  Modal,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import {stylesViewGroup} from './style';
import {Text, Menu, Divider} from 'react-native-paper';
import {RootStackParamList} from '../../../App';
import {RouteProp, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {User} from '../../utils/Users';

type GroupViewScreenRouteProp = RouteProp<RootStackParamList, 'GroupView'>;

export const GroupViewScreen = () => {
  const route = useRoute<GroupViewScreenRouteProp>();
  const {group, exitGroup, navigation} = route.params;
  const [visible, setVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useEffect(() => {
    // Aquí puedes cargar los usuarios del grupo
    // Simularemos algunos usuarios con datos estáticos
    const fetchUsers = () => {
      const users = [{id: 1, nombre: 'test'}];
      setUsers(users);
    };

    fetchUsers();
  }, []);

  const addUser = () => {
    if (newUserName.trim()) {
      setUsers([...users, {id: users.length + 1, nombre: newUserName}]);
      setNewUserName('');
      setModalVisible(false);
    }
  };

  const renderUserItem = ({item}: any) => (
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
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Pressable>
              <Icon
                name={'ellipsis-vertical-outline'}
                size={24}
                onPress={openMenu}
              />
            </Pressable>
          }>
          <Menu.Item
            onPress={() => {
              closeMenu();
              setModalVisible(true);
            }}
            title="Agregar"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              closeMenu();
              exitGroup(group.id);
              navigation.navigate('ListGroups');
            }}
            title="Salir del grupo"
          />
          <Divider />
        </Menu>
      </View>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item.id.toString()}
        style={stylesViewGroup.userList}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={stylesViewGroup.modalContainer}>
          <View style={stylesViewGroup.modalContent}>
            <Text style={stylesViewGroup.modalTitle}>
              ¿A quién deseas agregar?
            </Text>
            <TextInput
              style={stylesViewGroup.input}
              placeholder="Nombre del usuario"
              value={newUserName}
              onChangeText={setNewUserName}
            />
            <Button title="Agregar usuario" onPress={addUser} />
          </View>
        </View>
      </Modal>
    </View>
  );
};
