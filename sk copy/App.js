import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import ProfileScreen from "./app/Screens/ProfileScreen";
import GeolocationAttendanceScreen from "./app/Screens/GeolocationAttendance";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Profile") {
              iconName = focused ? "person-circle" : "person-circle-outline";
            } else if (route.name === "GeolocationAttendance") {
              iconName = focused ? "location" : "location-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "#2ecc71",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen
          name="GeolocationAttendance"
          component={GeolocationAttendanceScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
