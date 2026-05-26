import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import NotesScreen from "../screens/NotesScreen";
import TasksScreen from "../screens/TasksScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size, focused }) => {
                        let iconName: any;

                        if (route.name === "Home") {
                            iconName = focused ? "home" : "home-outline";
                        } else if (route.name === "Notes") {
                            iconName = focused ? "document-text" : "document-text-outline";
                        } else if (route.name === "Tasks") {
                            iconName = focused ? "checkbox" : "checkbox-outline";
                        } else if (route.name === "Settings") {
                            iconName = focused ? "settings" : "settings-outline";
                        }

                        return (
                            <Ionicons
                                name={iconName}
                                size={size}
                                color={color}
                            />
                        );
                    },

                    tabBarStyle: {
                        paddingBottom: 8,
                        paddingTop: 5,
                    },

                    tabBarLabelStyle: {
                        fontSize: 12,
                    },

                    tabBarActiveTintColor: "#2196F3",
                    tabBarInactiveTintColor: "gray",

                    headerTitleAlign: "center",
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                />

                <Tab.Screen
                    name="Notes"
                    component={NotesScreen}
                />

                <Tab.Screen
                    name="Tasks"
                    component={TasksScreen}
                />

                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}