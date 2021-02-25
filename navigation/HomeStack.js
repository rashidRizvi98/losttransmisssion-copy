import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import FailurePrediction from "../screens/FailurePrediction";
import FailureHistory from "../screens/FailureHistory";

export default function HomeStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="FailurePrediction" component={FailurePrediction} />
      <Stack.Screen name="FailureHistory" component={FailureHistory} />
    </Stack.Navigator>
  );
}
