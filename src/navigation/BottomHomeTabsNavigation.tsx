import React, {useState} from 'react'; // Add React import here
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeBottomTabs} from '../components/BottomTabs';
import {ProfileScreen} from '../screens/profile/ProfileScreen';
import {NotificationsScreen} from '../screens/notifications/NotificationsScreen';
import {GroupsScreen} from '../screens/groups/GroupsScreen';
import { ActivityScreen } from '../screens/activity/ActivityScreen';
import { ExpensesScreen } from '../screens/expenses/ExpensesScreen';

export const BottomTabsHomeNavigator = ({navigation}) => {
  const Tab = createBottomTabNavigator();
  const [showTab, setShowTab] = useState(true);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
      tabBar={props => <HomeBottomTabs showTab={showTab} {...props} />}>
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsScreen}
      />
      <Tab.Screen
        name="Add"
        component={ExpensesScreen}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
    </Tab.Navigator>
  );
};
