import { StyleSheet } from "react-native";
import { globalColors } from "../../themes/theme";


export const styles = StyleSheet.create({
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
  });