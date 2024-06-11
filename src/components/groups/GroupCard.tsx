import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

interface GroupCardProps {
  id: number;
  name: string;
  color: string;
  seeTheGroup: (id: number) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  id,
  name,
  color,
  seeTheGroup,
}) => {
  return (
    <View style={styles.groupItem}>
      <View style={[styles.colorIndicator, {backgroundColor: color}]} />
      <Pressable style={styles.button} onPress={() => seeTheGroup(id)}>
        <View style={styles.groupContent}>
          <Text variant="titleLarge">{name}</Text>
          <Icon name="chevron-forward-outline" size={25} />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginVertical: 10,
    height: 100,
  },
  colorIndicator: {
    width: 10,
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  groupContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
  },
});

export default GroupCard;
