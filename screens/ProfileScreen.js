import React from "react";
import { View, StyleSheet, Button } from "react-native";
import AppButton from "../components/AppButton";
import { logout } from "../components/Firebase/firebase";

export default function ProfileScreen() {
  async function handleSignOut() {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <AppButton title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
