import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import HomeScreen from "../screens/HomeScreen";
import CalendarScreen from "../screens/CalendarScreen";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home Screen"
      tabBarOptions={{
        activeTintColor: "rgb(16, 133, 57)",
        activeBackgroundColor: "rgb(215, 245, 217)",
        inactiveBackgroundColor: "rgb(215, 245, 217)",
      }}
    >
      <BottomTab.Screen
        name="Home Screen"
        component={HomeScreenNavigator}
        options={{
          tabBarIcon: ({ color }) => <AirBarIcon name="air" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Calendar"
        component={CalendarScreenNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <CalendarBarIcon name="calendar-heart" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/

function AirBarIcon(props: { name: string; color: string }) {
  return <Entypo size={30} {...props} />;
}

function CalendarBarIcon(props: { name: string; color: string }) {
  return (
    <MaterialCommunityIcons size={30} style={{ marginBottom: 0 }} {...props} />
  );
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const HomeStack = createStackNavigator();

function HomeScreenNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen name="HomeScreenasd" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

const CalendarStack = createStackNavigator();

function CalendarScreenNavigator() {
  return (
    <CalendarStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <CalendarStack.Screen name="CalendarScreen" component={CalendarScreen} />
    </CalendarStack.Navigator>
  );
}
