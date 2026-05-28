import "react-native-gesture-handler";

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

function AppContent() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <BottomTabs />
    </SafeAreaView>
  );
}

export default function App() {

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