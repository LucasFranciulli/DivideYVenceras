// src/components/GroupCard.tsx
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { globalColors } from '../../themes/theme';

interface GroupCardProps {
  id: number;
  name: string;
  color: string;
  seeTheGroup: (id: number) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ id, name, color, seeTheGroup }) => {
  return (
    <View style={styles.groupItem}>
      <View style={[styles.colorIndicator, { backgroundColor: color }]} />
      <Text style={styles.groupName}>{name}</Text>
      <Pressable onPress={() => seeTheGroup(id)}>
        <Icon name="ellipsis-horizontal-outline" size={25} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    marginVertical: 10,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  groupName: {
    flex: 1,
    fontSize: 16,
  },
});

export default GroupCard;
