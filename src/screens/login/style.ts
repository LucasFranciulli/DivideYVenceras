import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputUser: {
      gap: 20,
      width: '80%',
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
    optionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    rememberPasswordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    lowerContainers: {
      alignSelf: 'center',
      width: '100%',
      paddingTop: 50,
    },
    button: {
      backgroundColor: '#2d643f',
      width: '60%',
      alignSelf: 'center',
    },
    title: {
      alignItems: 'flex-end',
      width: '80%',
      paddingBottom: 50,
    },
    titleText: {
      color: '#2d643f',
    },
    register: {
      textDecorationLine: 'underline',
      alignSelf: 'flex-end',
      paddingTop: 70,
    },
});

export default styles;