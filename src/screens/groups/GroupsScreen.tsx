import React, {useState, useEffect} from 'react';
import {Pressable, StyleSheet, View, FlatList} from 'react-native';
import {Button, Modal, Portal, Text, TextInput} from 'react-native-paper';
import {globalColors} from '../../themes/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import {Group} from '../../utils/Group';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GroupCard from '../../components/groups/GroupCard';
import {stylesListGroups} from './style';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../App';
import {User} from '../../utils/User';
import {getMyGroups} from '../expenses/services/getMyGroups';
import {createGroup, joinGroupByToken} from './services/group';
import {showToastError, showToastSuccess} from '../../utils/ToastActions';

export type GroupsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ListGroups'
>;

export const GroupsScreen = () => {
  const [visibleModalFinished, setVisibleModalFinished] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [group, setGroup] = useState<Group>({
    id: Date.now(),
    nombre: '',
    color: '',
    limite_gasto: 0,
    monto_gastado: 0,
    token: '',
    descripcion: '',
  });
  const navigation = useNavigation<GroupsScreenNavigationProp>();

  const showModalFinished = () => setVisibleModalFinished(true);
  const hideModalFinished = () => setVisibleModalFinished(false);

  const [visibleModalDelete, setVisibleModalDelete] = useState(false);
  const [visibleModalJoin, setVisibleModalJoin] = useState(false);
  const [joinGroupCode, setJoinGroupCode] = useState('');
  const [IdDelete, setIdDelete] = useState(0);
  const showModalDelete = () => setVisibleModalDelete(true);
  const hideModalDelete = () => setVisibleModalDelete(false);

  const showModalJoin = () => setVisibleModalJoin(true);
  const hideModalJoin = () => setVisibleModalJoin(false);

  const fetchGroups = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        const groupsFetched = await getMyGroups(token);
        setGroups(groupsFetched);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  function getRandomHexColor(): string {
    const randomColor = Math.floor(Math.random() * 16777215);
    const hexColor = randomColor.toString(16).padStart(6, '0').toUpperCase();
    return hexColor;
  }

  const saveGroup = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await createGroup(
          group.nombre,
          group.descripcion,
          group.limite_gasto,
          group.color,
          token,
        );
      }
      await fetchGroups();
      showToastSuccess('Grupo creado!', '');
      hideModalFinished();
    } catch (error) {
      console.error('Error saving group:', error);
    }
  };

  const exitGroup = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
      }
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  const joinGroup = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const result = await joinGroupByToken(joinGroupCode, token);
        hideModalJoin();
        if (result) {
          await fetchGroups();
          showToastSuccess('Se unio al grupo!', '');
        } else {
          showToastError('Error al unirse al grupo', '');
        }
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const updateGroupUsers = async (groupId: number, users: User[]) => {
    try {
      const updatedGroups = groups.map(g => {
        if (g.id === groupId) {
          return {...g, usuarios: users};
        }
        return g;
      });
      await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
      setGroups(updatedGroups);
    } catch (error) {
      console.error('Error updating group users:', error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const renderGroupItem = ({item}: {item: Group}) => (
    <GroupCard
      id={item.id}
      name={item.nombre}
      color={`#${item.color}`}
      seeTheGroup={(id: number) => {
        setIdDelete(id);
        navigation.navigate('GroupView', {
          group: item,
          exitGroup,
          updateGroupUsers,
          navigation,
        });
      }}
    />
  );

  return (
    <View style={stylesListGroups.container}>
      <View style={stylesListGroups.titleContainer}>
        <Text variant="displayLarge" style={stylesListGroups.title}>
          Grupos
        </Text>
      </View>
      <View>
        <View style={stylesListGroups.upperButtons}>
          <Pressable
            style={stylesListGroups.createGroup}
            onPress={showModalFinished}>
            <Text variant="titleMedium" style={stylesListGroups.titleButton}>
              Crear grupo
            </Text>
            <Icon
              name={'add-outline'}
              size={25}
              color={globalColors.background}
            />
          </Pressable>
          <Pressable style={stylesListGroups.joinGroup} onPress={showModalJoin}>
            <Text variant="titleMedium" style={stylesListGroups.titleButton}>
              Unirse a grupo
            </Text>
            <Icon
              name={'arrow-redo-circle-outline'}
              size={30}
              color={globalColors.background}
            />
          </Pressable>
        </View>
        {groups.length === 0 ? (
          <Text style={stylesListGroups.noDataText}>
            No hay información de grupos.
          </Text>
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
              value={group.nombre}
              onChangeText={text => setGroup({...group, nombre: text})}
              style={stylesListGroups.inputButtons}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
            <Text variant="titleMedium" style={stylesListGroups.nameBodyModal}>
              Color del grupo
            </Text>
            <View style={stylesListGroups.colors}>
              {['FF0000', '0000FF', '800080', '008000', 'FFFF00'].map(color => (
                <Pressable
                  key={color}
                  onPress={() => setGroup({...group, color: color})}
                  style={[
                    stylesListGroups.colorCircle,
                    {backgroundColor: `#${color}`},
                    group.color === color &&
                      stylesListGroups.selectedColorCircle,
                  ]}
                />
              ))}
            </View>
            <View style={stylesListGroups.buttomModalButtons}>
              <Button onPress={saveGroup}>
                <Text
                  variant="titleMedium"
                  style={stylesListGroups.nameTitleModal}>
                  Crear
                </Text>
              </Button>
              <Button onPress={hideModalFinished}>
                <Text
                  variant="titleMedium"
                  style={stylesListGroups.nameTitleModal}>
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
                  exitGroup(IdDelete);
                  hideModalDelete();
                }}>
                <Text
                  variant="titleMedium"
                  style={stylesListGroups.nameTitleModal}>
                  Salir
                </Text>
              </Button>
              <Button onPress={hideModalDelete}>
                <Text
                  variant="titleMedium"
                  style={stylesListGroups.nameTitleModal}>
                  Cancelar
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
      <Portal>
        <Modal
          visible={visibleModalJoin}
          onDismiss={hideModalJoin}
          contentContainerStyle={stylesListGroups.containerStyle}>
          <View style={stylesListGroups.modalContainer}>
            <Text variant="titleLarge" style={stylesListGroups.nameTitleModal}>
              Unirse a Grupo
            </Text>
            <Text variant="titleMedium" style={stylesListGroups.nameBodyModal}>
              Ingresa el código del grupo
            </Text>
            <TextInput
              placeholder="Código"
              value={joinGroupCode}
              onChangeText={text => setJoinGroupCode(text)}
              style={stylesListGroups.inputButtons}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
            <View style={stylesListGroups.buttomModalButtons}>
              <Button onPress={joinGroup}>
                <Text
                  variant="titleMedium"
                  style={stylesListGroups.nameTitleModal}>
                  Unirse
                </Text>
              </Button>
              <Button onPress={hideModalJoin}>
                <Text
                  variant="titleMedium"
                  style={stylesListGroups.nameTitleModal}>
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
