import React from "react";
import { View, StyleSheet, Button, Text, Picker } from "react-native";

import useStatusBar from "../hooks/useStatusBar";
import { auth, logout } from "../components/Firebase/firebase";
import AppButton from "../components/AppButton";
import { useState } from "react";
import { useEffect } from "react";
import { db } from "../components/Firebase/firebase";
import DonutChart from "../components/DonutChart";
import moment from "moment";

import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import SafeView from "../components/SafeView";
import colors from "../utils/colors";

export default function HomeScreen({ navigation }) {
  const [signal, setSignal] = useState([]);
  const [signalReal, setSignalReal] = useState([]);
  const [signalRealVal, setSignalRealVal] = useState([]);
  const [isFailed, setSetIsFailed] = useState(true);
  const [failedLoc, setFailedLoc] = useState("");

  const [location, setLocation] = useState("Colombo");
  const [currentUser, setCurrentUser] = useState(null);

  useStatusBar("dark-content");

  async function handleSignOut() {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  }

  const getData = async () => {
    const response = db.collection("signal");
    const data = await response.get();
    var signals = [];
    data.docs.forEach((item) => {
      signals.push(item.data());
    });
    setSignal(signals);
  };

  const getRealData = async () => {
    db.collection("signal").onSnapshot(function (querySnapshot) {
      var response = [];
      querySnapshot.forEach(function (doc) {
        response.push(doc.data());
        console.log(doc.data());
        if (doc.data().Val === 0 && doc.data().Name) {
          setFailedLoc(doc.data().Name);
          sendNotificationToAllUsers(doc.data().Name);

          var date = moment()
            .utcOffset("+05:30")
            .format("YYYY-MM-DD hh:mm:ss a");

          db.collection("failureHistory").doc().set({
            Date: date,
            Location: doc.data().Name,
          });
        }
      });
      setSignalReal(response);
      //console.log("Current data: ", response.join(", "));
      console.log(failedLoc);
    });
  };

  useEffect(() => {
    getData();
    getRealData();
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     const user = await db.collection("users").doc(auth.currentUser.uid).get();

  //     setCurrentUser(user.data());
  //   })();
  // });

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  /* const sendNotification = async (token, loca) => {
    const message = {
      to: token,
      sound: "default",
      title: "Signal failure",
      body: `At  ${loca}`,
      data: { data: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  const sendNotificationToAllUsers = async (loc) => {
    const users = await db.collection("users").get();
    users.docs.map((user) => sendNotification(user.data().token, loc));
  }; */

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (token) {
      await db
        .collection("users")
        .doc(auth.currentUser.uid)
        .set({ token }, { merge: true });
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  return (
    <SafeView style={styles.container}>
      {/* <AppButton title="Sign Out" onPress={handleSignOut} color="primary" /> */}

      <AppButton
        title="View failure History"
        color="primary"
        onPress={() => navigation.navigate("FailureHistory")}
      />

      <AppButton
        title="View failure forecasts"
        color="secondary"
        onPress={() => navigation.navigate("FailurePrediction")}
      />

      {/* <AppButton
        title="Send Notification"
        color="secondary"
        onPress={sendNotificationToAllUsers}
      /> */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* <DonutChart percentage={7} color={"tomato"} delay={1000} max={10} /> */}
      </View>

      {/* <Picker
        selectedValue={location}
        style={{ height: 50, width: 100 }}
        onValueChange={(itemValue, itemIndex) => setLocation(itemValue)}
      >
        {signal &&
          signal.map((sig) => {
            return <Picker.Item label={sig.Name} value={sig.Name} />;
          })}
      </Picker> */}
      {/* {signalReal &&
        signalReal.map((sig) => {
          return <Text>{sig.Val}</Text>;
        })} */}

      {/* <Text>{location}</Text> */}

      {/* <Text>{failedLoc}xxx</Text> */}

      {/* <Picker
        selectedValue={signalRealVal}
        style={{ height: 50, width: 100 }}
        onValueChange={(itemValue, itemIndex) => setSignalRealVal(itemValue)}
      >
        {signalReal &&
          signalReal.map((sig) => {
            return (
              <Picker.Item label={sig.Name} value={sig.Value} key={sig.Val} />
            );
          })}
      </Picker> */}
    </SafeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mediumGrey,
  },
});
