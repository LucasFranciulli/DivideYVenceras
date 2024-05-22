import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Button, Divider, Menu, Modal, Portal, Text} from 'react-native-paper';
import {Expense} from '../../utils/Expense';
import {globalColors} from '../../themes/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { EditExpensesScreenNavigationProp } from '../../screens/profile/ProfileScreen';

interface Props {
  item: Expense;
  deleteExpense: (id: number) => Promise<void>;
  showToastSuccess: (message: string) => void;
  showToastError: (message: string) => void;
  /* navigation: (item: Expense) => void; */
  navigation: EditExpensesScreenNavigationProp;
}

export const ExpenseCard = ({
  item,
  deleteExpense,
  showToastSuccess,
  showToastError,
  navigation,
}: Props) => {
  const [visible, setVisible] = useState(false);
  const [visibleModalFinished, setVisibleModalFinished] = useState(false);

  const showModalFinished = () => setVisibleModalFinished(true);
  const hideModalFinished = () => setVisibleModalFinished(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleEliminate = (itemId: number) => {
    //TODO: cuando se elimine correctamente poner un try y catch, en el catch poner el error toast
    try {
      showToastSuccess('El gasto fue pagado!');
      deleteExpense(itemId);
    } catch (err) {
      showToastError('Hubo un problema al completar el pago');
    }
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemDataContainer}>
        <View>
          <View style={styles.itemDataRowContainer}>
            <Text variant="titleLarge">Nombre: </Text>
            <Text variant="titleLarge" style={styles.nameText}>
              {item.name}
            </Text>
          </View>
          <View style={styles.itemDataRowContainer}>
            <Text variant="titleLarge">Descripción: </Text>
            <Text variant="titleLarge" style={styles.nameText}>
              {item.description}
            </Text>
          </View>
          <View style={styles.itemDataRowContainer}>
            <Text variant="titleLarge">Monto: </Text>
            <Text variant="titleLarge" style={styles.nameText}>
              ${item.amount}
            </Text>
          </View>
        </View>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          style={styles.menu}
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
              navigation.navigate('EditExpenses', {item, navigation});
            }}
            title="Editar"
            style={styles.menu}
          />
          <Divider />
          <Menu.Item
            onPress={() => deleteExpense(item.id)}
            title="Eliminar"
            style={styles.menu}
          />
        </Menu>
      </View>
      <Button
        style={styles.button}
        textColor={globalColors.background}
        /* onPress={() => deleteExpense(item.id)} */
        onPress={showModalFinished}>
        Completar pago
      </Button>
      <Portal>
        <Modal
          visible={visibleModalFinished}
          onDismiss={hideModalFinished}
          contentContainerStyle={styles.containerStyle}>
          <View style={styles.modalContainer}>
            <Text variant="titleLarge" style={styles.nameTitleModal}>
              WARNING
            </Text>
            <Text variant="titleMedium" style={styles.nameBodyModal}>
              ¿Desea completar el pago de este gasto?
            </Text>
            <View style={styles.buttomModalButtons}>
              <Button onPress={() => deleteExpense(item.id)}>
                <Text variant="titleMedium" style={styles.nameTitleModal}>
                  Confirmar
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
  button: {
    backgroundColor: globalColors.primary,
  },
  itemDataContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 30,
    paddingBottom: 15,
  },
  title: {
    color: globalColors.primary,
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 20,
    marginBottom: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: globalColors.background,
  },
  itemDataRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    color: globalColors.grey,
  },
  menu: {
    backgroundColor: globalColors.background,
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
});
