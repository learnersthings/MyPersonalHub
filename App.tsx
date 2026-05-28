import "react-native-gesture-handler";

import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import BottomTabs
  from "./src/navigation/BottomTabs";

import {
  ThemeProvider,
} from "./src/context/ThemeContext";

export default function App() {

  return (

    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <ThemeProvider>
        <BottomTabs />
      </ThemeProvider>

    </GestureHandlerRootView>

  );
}