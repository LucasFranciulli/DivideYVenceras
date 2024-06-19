import {Dimensions, StyleSheet} from 'react-native';
import {globalColors} from '../../themes/theme';

var {height, width} = Dimensions.get('window');
export const stylesViewGroup = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  title: {
    color: globalColors.primary,
    alignSelf: 'flex-start',
    maxWidth: '60%',
  },
  code: {
    color: globalColors.primary,
    padding: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  userList: {
    width: '100%',
    paddingHorizontal: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  separetor: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userItemBullet: {
    fontSize: 28,
    marginRight: 12,
    color: globalColors.primary,
  },
  userItemText: {
    fontSize: 22,
  },
  modalContainer: {
    width: width * 0.9,
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 30,
    gap: 20,
    backgroundColor: globalColors.background,
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  addUsers: {
    borderRadius: 30,
    width: 120,
    height: 50,
    backgroundColor: globalColors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  addButton: {
    color: globalColors.background,
  },
  usersList: {
    alignItems: 'center',
    width: '95%',
    backgroundColor: globalColors.backgroundHighlited,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  userDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  addPressable: {
    backgroundColor: globalColors.secondary,
    padding: 10,
    borderRadius: 10,
  },
  noGroupText: {
    textAlign: 'center',
    marginTop: 20,
  },
  expenseItem: {
    padding: 10,
    backgroundColor: globalColors.backgroundHighlited,
    borderRadius: 5,
    marginBottom: 10,
  },
  expenseText: {
    marginBottom: 5,
  },
  groupExpensesContainer: {
    padding: 20,
  },
});

export const stylesListGroups = StyleSheet.create({
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
  joinGroup: {
    borderRadius: 30,
    width: 170,
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
  colors: {
    flexDirection: 'row',
    gap: 10,
  },
  colorCircle: {
    borderWidth: 1,
    borderRadius: 50,
    width: 40,
    height: 40,
  },
  selectedColorCircle: {
    borderWidth: 5,
    borderColor: 'black',
  },
  upperButtons: {
    flexDirection: 'row',
    gap: 30,
  },
});
