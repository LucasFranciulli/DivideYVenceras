import {StyleSheet} from 'react-native';
import {globalColors} from '../../themes/theme';

export const styleListExpenses = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 30,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 15,
  },
  mainContainer: {
    width: '100%',
  },
  buttonContainer: {
    paddingTop: 20,
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: globalColors.secondary,
    width: '80%',
    alignSelf: 'center',
  },
  title: {
    color: globalColors.primary,
    paddingBottom: 30,
    alignSelf: 'flex-start',
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
  inputTitle: {
    color: globalColors.primary,
  },
  inputContainer: {
    gap: 10,
    width: '100%',
  },
  inputRowContainer: {
    alignItems: 'center',
    gap: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  addCategoriesButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    width: 150,
    borderRadius: 30,
    backgroundColor: globalColors.secondary,
  },
  addCategoriesButtonText: {
    color: globalColors.background,
  },
  fixedExpense: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    width: 150,
    height: 45,
    borderRadius: 30,
    backgroundColor: globalColors.secondary,
  },
  notCheckedButtom: {
    borderWidth: 1,
    color: globalColors.dark,
    backgroundColor: globalColors.background,
  },
  notCheckedText: {
    color: globalColors.dark,
  },
  dropDownStyle: {
    backgroundColor: globalColors.background,
  },
  dropDownItemSelectedStyle: {
    backgroundColor: globalColors.secondary,
  },
  dropDownItemStyle: {
    backgroundColor: globalColors.background,
  },
  dropDownItemTextStyle: {
    color: globalColors.dark,
  },
  dropdown: {
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
    gap: 20,
  },
  buttomModalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryItemText: {
    marginLeft: 10,
  },
  datePickerContainer: {
    marginBottom: 15,
    gap: 10,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: globalColors.dark,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  datePickerButtonText: {
    color: globalColors.dark,
  },
});

export const styleEditExpenses = StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 30,
    },
    mainContainer: {
      width: '100%',
    },
    buttonContainer: {
      paddingTop: 20,
      width: '50%',
    },
    button: {
      backgroundColor: globalColors.secondary,
      width: '80%',
      alignSelf: 'center',
    },
    title: {
      color: globalColors.primary,
      paddingBottom: 50,
      alignSelf: 'flex-start',
    },
    inputButtons: {
      borderColor: 'black',
      borderWidth: 1,
      backgroundColor: 'white',
      marginBottom: 10,
      borderRadius: 10,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    inputTitle: {
      color: globalColors.primary,
    },
    inputContainer: {
      gap: 10,
    },
    inputRowContainer: {
      alignItems: 'center',
      gap: 10,
      paddingBottom: 20,
      flexDirection: 'row',
    },
    dropDownStyle: {
      backgroundColor: globalColors.background,
    },
    dropDownItemSelectedStyle: {
      backgroundColor: globalColors.secondary,
    },
    dropDownItemStyle: {
      backgroundColor: globalColors.background,
    },
    dropDownItemTextStyle: {
      color: globalColors.dark,
    },
    dropdown: {
      backgroundColor: globalColors.background,
    },
    drop: {
      paddingBottom: 10,
    },
  });
  
