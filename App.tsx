
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import BottomTabs
  from "./src/navigation/BottomTabs";

import {
  ThemeProvider,
} from "./src/context/ThemeContext";

import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import { useTheme } from "./src/context/ThemeContext";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function AppContent() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <BottomTabs />
    </SafeAreaView>
  );
}

export default function App() {

  useEffect(() => {
    async function requestPermissions() {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          console.log('Failed to get push token for push notification!');
          return;
        }
        
        const { setupNotificationChannel } = require('./src/services/notificationService');
        await setupNotificationChannel();
      } catch (e) {
        console.log("Push notifications not supported in Expo Go", e);
      }
    }
    requestPermissions();
  }, []);

  return (

    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>

    </GestureHandlerRootView>

  );
}