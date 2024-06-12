/* eslint-disable react/react-in-jsx-scope */
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  NavigationHelpers,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import {
  BottomTabDescriptorMap,
  BottomTabNavigationEventMap,
} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {globalColors} from '../themes/theme';

export interface Props {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
  showTab: boolean;
}

export const HomeBottomTabs = ({
  state,
  descriptors,
  navigation,
  showTab,
}: Props) => {
  const renderIcon = (name: string) => {
    switch (name) {
      case 'Notifications':
        return <Icon name={'notifications-outline'} size={50} />;
      case 'Add':
        return <Icon name={'add-circle-outline'} size={50} />;
      case 'Profile':
        return <Icon name={'cash-outline'} size={50} />;
      case 'Groups':
        return <Icon name={'people-outline'} size={50} />;
      case 'Activity':
        return <Icon name={'podium-outline'} size={50} />;
    }
    return null;
  };

  if (!showTab) {
    return null;
  }

  return (
    <View style={[style.container]}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={style.tab}
            key={route.key}>
            <View style={[style.circle, isFocused && style.focusedCircle]}>
              {renderIcon(route.name)}
            </View>
            <Text
              style={{
                color: globalColors.dark,
              }}>
              {options.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: globalColors.secondary,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  focusedCircle: {
    backgroundColor: globalColors.primary,
  },
});
