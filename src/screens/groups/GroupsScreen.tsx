import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, View, FlatList } from 'react-native';
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { globalColors } from '../../themes/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { Group } from '../../utils/Group';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GroupCard from '../../components/groups/GroupCard';
import { stylesListGroups } from './style';
import { useNavigation } from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';

export type GroupViewScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'GroupViewScreen'
>;

export const GroupsScreen = () => {
  const [visibleModalFinished, setVisibleModalFinished] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [group, setGroup] = useState<Group>({
    id: Date.now(),
    name: '',
    color: '',
  });
  const navigation = useNavigation<GroupViewScreenNavigationProp>();

  const showModalFinished = () => setVisibleModalFinished(true);
  const hideModalFinished = () => setVisibleModalFinished(false);

  const [visibleModalDelete, setVisibleModalDelete] = useState(false);
  const [IdDelete, setIdDelete] = useState(0);
  const showModalDelete = () => setVisibleModalDelete(true);
  const hideModalDelete = () => setVisibleModalDelete(false);

  const fetchGroups = async () => {
    try {
      const storedGroups = await AsyncStorage.getItem('groups');
      if (storedGroups) {
        setGroups(JSON.parse(storedGroups));
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const saveGroup = async () => {
    try {
      const newGroups = [...groups, group];
      await AsyncStorage.setItem('groups', JSON.stringify(newGroups));
      setGroups(newGroups);
      setGroup({ id: Date.now(), name: '', color: '' });
      hideModalFinished();
    } catch (error) {
      console.error('Error saving group:', error);
    }
  };

  const deleteGroup = async (id: number) => {
    try {
      const filteredGroups = groups.filter(g => g.id !== id);
      await AsyncStorage.setItem('groups', JSON.stringify(filteredGroups));
      setGroups(filteredGroups);
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const renderGroupItem = ({ item }: { item: Group }) => (
    <GroupCard id={item.id} name={item.name} color={item.color} seeTheGroup={(id: number) => {
      setIdDelete(id);
      navigation.navigate("GroupViewScreen");
    }} />
  );

  return (
    <View style={stylesListGroups.container}>
      <View style={stylesListGroups.titleContainer}>
        <Text variant="displayLarge" style={stylesListGroups.title}>
          Grupos
        </Text>
        <Pressable style={stylesListGroups.createGroup} onPress={showModalFinished}>
          <Text variant="titleMedium" style={stylesListGroups.titleButton}>
            Crear grupo
          </Text>
          <Icon name={'add-outline'} size={25} color={globalColors.background} />
        </Pressable>
      </View>
      <View>
        <Text variant="headlineMedium" style={stylesListGroups.title}>
          Mis Grupos
        </Text>
        {groups.length === 0 ? (
          <Text style={stylesListGroups.noDataText}>No hay información de grupos.</Text>
        ) : (
          <FlatList
            data={groups}
            renderItem={renderGroupItem}
            keyExtractor={item => item.id.toString()}
          />
        )}
      </View>
      <Portal>
        <Modal
          visible={visibleModalFinished}
          onDismiss={hideModalFinished}
          contentContainerStyle={stylesListGroups.containerStyle}>
          <View style={stylesListGroups.modalContainer}>
            <Text variant="titleLarge" style={stylesListGroups.nameTitleModal}>
              Crear Grupo
            </Text>
            <Text variant="titleMedium" style={stylesListGroups.nameBodyModal}>
              Nombre del grupo
            </Text>
            <TextInput
              placeholder="Nombre"
              value={group.name}
              onChangeText={text => setGroup({ ...group, name: text })}
              style={stylesListGroups.inputButtons}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
            <Text variant="titleMedium" style={stylesListGroups.nameBodyModal}>
              Color del grupo
            </Text>
            <View style={stylesListGroups.colors}>
              {['red', 'blue', 'purple', 'green', 'yellow'].map(color => (
                <Pressable
                  key={color}
                  onPress={() => setGroup({ ...group, color: color })}
                  style={[
                    stylesListGroups.colorCircle,
                    { backgroundColor: color },
                    group.color === color && stylesListGroups.selectedColorCircle,
                  ]}
                />
              ))}
            </View>
            <View style={stylesListGroups.buttomModalButtons}>
              <Button onPress={saveGroup}>
                <Text variant="titleMedium" style={stylesListGroups.nameTitleModal}>
                  Crear
                </Text>
              </Button>
              <Button onPress={hideModalFinished}>
                <Text variant="titleMedium" style={stylesListGroups.nameTitleModal}>
                  Cancelar
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
      <Portal>
        <Modal
          visible={visibleModalDelete}
          onDismiss={hideModalDelete}
          contentContainerStyle={stylesListGroups.containerStyle}>
          <View style={stylesListGroups.modalContainer}>
            <Text variant="titleLarge" style={stylesListGroups.nameTitleModal}>
              Salir del Grupo
            </Text>
            <Text variant="titleMedium" style={stylesListGroups.nameBodyModal}>
              ¿Desea salir del grupo?
            </Text>
            <View style={stylesListGroups.buttomModalButtons}>
              <Button
                onPress={() => {
                  deleteGroup(IdDelete);
                  hideModalDelete();
                }}>
                <Text variant="titleMedium" style={stylesListGroups.nameTitleModal}>
                  Salir
                </Text>
              </Button>
              <Button onPress={hideModalDelete}>
                <Text variant="titleMedium" style={stylesListGroups.nameTitleModal}>
                  Cancelar
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

export default GroupsScreen;
