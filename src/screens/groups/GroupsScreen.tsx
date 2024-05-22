import React, {useState, useEffect} from 'react';
import {Pressable, StyleSheet, View, FlatList, Alert} from 'react-native';
import {Button, Modal, Portal, Text, TextInput} from 'react-native-paper';
import {globalColors} from '../../themes/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import {Group} from '../../utils/Group';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GroupsScreen = () => {
  const [visibleModalFinished, setVisibleModalFinished] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [group, setGroup] = useState<Group>({
    id: Date.now(),
    name: '',
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
      setGroup({id: Date.now(), name: ''});
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

  const renderGroupItem = ({item}: {item: Group}) => (
    <View style={styles.groupItem}>
      <Text>{item.name}</Text>
      <Pressable
        onPress={() => {
          setIdDelete(item.id);
          showModalDelete();
        }}>
        <Text style={styles.deleteText}>Salir</Text>
      </Pressable>
    </View>
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
          <Icon
            name={'add-outline'}
            size={25}
            color={globalColors.background}
          />
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
              onChangeText={text => setGroup({...group, name: text})}
              style={styles.inputButtons}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
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

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: globalColors.primary,
  },
  titleButton: {
    color: globalColors.background,
  },
  createGroup: {
    borderRadius: 30,
    width: 150,
    height: 50,
    backgroundColor: globalColors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  containerStyle: {
    backgroundColor: 'white',
    alignSelf: 'center',
    padding: 20,
    width: '80%',
    borderRadius: 10,
  },
  nameTitleModal: {
    color: globalColors.primary,
  },
  nameBodyModal: {
    textAlign: 'center',
  },
  modalContainer: {
    alignItems: 'center',
    gap: 10,
  },
  buttomModalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  inputButtons: {
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
  },
  noDataText: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
  groupItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteText: {
    color: 'red',
  },
});

export default GroupsScreen;
