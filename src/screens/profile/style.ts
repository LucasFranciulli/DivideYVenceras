import { StyleSheet } from "react-native";
import { globalColors } from "../../themes/theme";



export const styles = StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      backgroundColor: globalColors.primary,
    },
    itemDataContainer: {
      alignItems: 'center',
      justifyContent: 'center',
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
    },
    circleFixed: {
      borderRadius: 7.5,
      width: 15,
      height: 15,
      backgroundColor: globalColors.secondary,
    },
    circleNotFixed: {
      borderRadius: 7.5,
      width: 15,
      height: 15,
      borderWidth: 1,
      borderColor: globalColors.dark,
      backgroundColor: globalColors.background,
    },
    circleContainerItem: {
      flexDirection: 'row',
      gap: 15,
      alignItems: 'center',
    },
    circleContainer: {
      flexDirection: 'row',
      gap: 30,
      alignItems: 'center',
      paddingBottom: 20,
    },
    circleText: {
      color: globalColors.primary,
    },
    noDataText: {
      alignSelf: 'center',
      marginTop: 20,
      fontSize: 18,
      color: '#666',
    },
  });