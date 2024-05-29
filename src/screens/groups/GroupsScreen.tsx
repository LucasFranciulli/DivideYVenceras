import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, View, FlatList } from 'react-native';
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { globalColors } from '../../themes/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { Group } from '../../utils/Group';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GroupCard from '../../components/groups/GroupCard';
import { styles } from './style';

export const GroupsScreen = () => {
  const [visibleModalFinished, setVisibleModalFinished] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [group, setGroup] = useState<Group>({
    id: Date.now(),
    name: '',
    color: '',
  });

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
    <GroupCard id={item.id} name={item.name} color={item.color} onLeaveGroup={(id: number) => {
      setIdDelete(id);
      showModalDelete();
    }} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="displayLarge" style={styles.title}>
          Grupos
        </Text>
        <Pressable style={styles.createGroup} onPress={showModalFinished}>
          <Text variant="titleMedium" style={styles.titleButton}>
            Crear grupo
          </Text>
          <Icon name={'add-outline'} size={25} color={globalColors.background} />
        </Pressable>
      </View>
      <View>
        <Text variant="headlineMedium" style={styles.title}>
          Mis Grupos
        </Text>
        {groups.length === 0 ? (
          <Text style={styles.noDataText}>No hay información de grupos.</Text>
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
          contentContainerStyle={styles.containerStyle}>
          <View style={styles.modalContainer}>
            <Text variant="titleLarge" style={styles.nameTitleModal}>
              Crear Grupo
            </Text>
            <Text variant="titleMedium" style={styles.nameBodyModal}>
              Nombre del grupo
            </Text>
            <TextInput
              placeholder="Nombre"
              value={group.name}
              onChangeText={text => setGroup({ ...group, name: text })}
              style={styles.inputButtons}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
            <Text variant="titleMedium" style={styles.nameBodyModal}>
              Color del grupo
            </Text>
            <View style={styles.colors}>
              {['red', 'blue', 'purple', 'green', 'yellow'].map(color => (
                <Pressable
                  key={color}
                  onPress={() => setGroup({ ...group, color: color })}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    group.color === color && styles.selectedColorCircle,
                  ]}
                />
              ))}
            </View>
            <View style={styles.buttomModalButtons}>
              <Button onPress={saveGroup}>
                <Text variant="titleMedium" style={styles.nameTitleModal}>
                  Crear
                </Text>
              </Button>
              <Button onPress={hideModalFinished}>
                <Text variant="titleMedium" style={styles.nameTitleModal}>
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
          contentContainerStyle={styles.containerStyle}>
          <View style={styles.modalContainer}>
            <Text variant="titleLarge" style={styles.nameTitleModal}>
              Salir del Grupo
            </Text>
            <Text variant="titleMedium" style={styles.nameBodyModal}>
              ¿Desea salir del grupo?
            </Text>
            <View style={styles.buttomModalButtons}>
              <Button
                onPress={() => {
                  deleteGroup(IdDelete);
                  hideModalDelete();
                }}>
                <Text variant="titleMedium" style={styles.nameTitleModal}>
                  Salir
                </Text>
              </Button>
              <Button onPress={hideModalDelete}>
                <Text variant="titleMedium" style={styles.nameTitleModal}>
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
