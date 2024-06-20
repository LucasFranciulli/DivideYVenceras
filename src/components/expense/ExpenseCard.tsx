import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Button, Divider, Menu, Modal, Portal, Text} from 'react-native-paper';
import {Expense} from '../../utils/Expense';
import {globalColors} from '../../themes/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import {EditExpensesScreenNavigationProp} from '../../screens/profile/ProfileScreen';
import {showToastError, showToastSuccess} from '../../utils/ToastActions';
import {payExpense} from '../../screens/profile/services/expenses';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  item: Expense;
  deleteExpense: (id: number) => Promise<void>;
  navigation: EditExpensesScreenNavigationProp;
}

export const ExpenseCard = ({item, deleteExpense, navigation}: Props) => {
  const [visible, setVisible] = useState(false);
  const [visibleModalFinished, setVisibleModalFinished] = useState(false);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const fecha = item.fecha ? formatDate(item.fecha) : '';

  const showModalFinished = () => setVisibleModalFinished(true);
  const hideModalFinished = () => setVisibleModalFinished(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleEliminate = (itemId: number) => {
    try {
      showToastSuccess('El gasto fue pagado!', '');
      deleteExpense(itemId);
    } catch (err) {
      showToastError('Error', 'Hubo un problema al completar el pago');
    }
  };

  const handlePay = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await payExpense(item.id, token);
        showToastSuccess('Gasto Pagado!', '');
      }
    } catch (err) {
      console.log(err);
      showToastError('Error', 'Hubo un problema al pagar');
    }
    hideModalFinished();
  };

  return (
    <View
      style={[
        styles.itemContainer,
        item.tipo === 'FIJO'
          ? styles.backgroundFixed
          : styles.backgroundNotFixed,
      ]}>
      <View style={styles.itemDataContainer}>
        <View style={{gap: 10, width: '80%'}}>
          <View
            style={[
              styles.itemDataRowContainer,
              {justifyContent: 'space-between'},
            ]}>
            <View>
              <Text
                variant="headlineMedium"
                style={
                  item.tipo === 'FIJO'
                    ? styles.nameTextFixed
                    : styles.nameTitleText
                }>
                {item.nombre}
              </Text>
            </View>
            <View style={{alignSelf: 'flex-end'}}>
              {item.fecha !== undefined && (
                <Text
                  variant="titleLarge"
                  style={{
                    color:
                      item.tipo === 'FIJO'
                        ? globalColors.background
                        : globalColors.grey,
                  }}>
                  {fecha}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.itemDataRowContainer}>
            <Text
              variant="titleLarge"
              style={
                item.tipo === 'FIJO' ? styles.nameTextFixed : styles.nameText
              }>
              {item.descripcion}
            </Text>
          </View>
          <View style={{flexDirection: 'row', gap: 20}}>
            {item.categoria && item.categoria.nombre !== '' && (
              <View style={[styles.itemDataRowContainer, styles.category]}>
                <Text variant="titleMedium" style={styles.nameText}>
                  {item.categoria.nombre}
                </Text>
              </View>
            )}
            {item.tags &&
              item.tags.length > 0 &&
              item.tags.map((tag, index) => (
                <View
                  key={index}
                  style={[styles.itemDataRowContainer, styles.tag]}>
                  <Text variant="titleMedium" style={styles.nameText}>
                    {tag.nombre}
                  </Text>
                </View>
              ))}
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
        style={item.tipo === 'FIJO' ? styles.buttonFixed : styles.button}
        textColor={
          item.tipo === 'FIJO' ? globalColors.dark : globalColors.background
        }
        onPress={showModalFinished}
        disabled={item.liquidacion === 'PAGADO'}>
        $ {item.monto}
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
              <Button onPress={handlePay}>
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
  tag: {
    borderRadius: 30,
    padding: 7,
    backgroundColor: globalColors.tag,
  },
  category: {
    borderRadius: 30,
    padding: 7,
    backgroundColor: globalColors.category,
  },
  backgroundFixed: {
    backgroundColor: globalColors.secondary,
    borderColor: globalColors.secondary,
  },
  button: {
    backgroundColor: globalColors.secondary,
  },
  buttonFixed: {
    backgroundColor: globalColors.background,
    borderColor: globalColors.background,
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
  backgroundNotFixed: {
    backgroundColor: globalColors.background,
  },
  itemDataRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    color: globalColors.grey,
  },
  nameTextFixed: {
    color: globalColors.background,
  },
  nameTitleText: {
    color: globalColors.dark,
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
