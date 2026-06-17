import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeStack from "./HomeStack";
import SettingsStack from "./SettingsStack";
import RemindersStack from "./RemindersStack";
import TasksStack from "./TasksStack";
import AnalyticsScreen from "../screens/AnalyticsScreen";

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
                        } else if (route.name === "Reminders") {
                            iconName = focused ? "alarm" : "alarm-outline";
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

                    headerShown: false,
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeStack}
                />

                <Tab.Screen
                    name="Reminders"
                    component={RemindersStack}
                    options={{
                        headerShown: false,
                    }}
                />

                <Tab.Screen
                    name="Tasks"
                    component={TasksStack}
                    options={{
                        headerShown: false,
                    }}
                />

                <Tab.Screen
                    name="Analytics"
                    component={AnalyticsScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="stats-chart"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tab.Screen
                    name="Settings"
                    component={SettingsStack}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}