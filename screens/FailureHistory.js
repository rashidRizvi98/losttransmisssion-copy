import React, { useState, useEffect } from "react";
import { Text, View, FlatList, StyleSheet, Picker } from "react-native";
import { db } from "../components/Firebase/firebase";
import SafeView from "../components/SafeView";
import colors from "../utils/colors";

export default function FailureHistory() {
  const [failureHistory, setFailureHistory] = useState([]);
  const [location, setLocation] = useState([]);
  const [searchByLocation, setSearchByLocation] = useState("");

  const getFailureHistoryData = async () => {
    if (searchByLocation == "") {
      db.collection("failureHistory")
        .orderBy("Date", "desc")
        .onSnapshot(function (querySnapshot) {
          var response = [];

          querySnapshot.forEach(function (doc) {
            //  if(searchByLocation && (searchByLocation===doc.data().name))
            response.push(doc.data());
            //       console.log(doc.data());
          });
          setFailureHistory(response);
          //console.log("Current data: ", response.join(", "));
        });
    } else {
      db.collection("failureHistory")
        .orderBy("Date", "desc")
        .where("Location", "==", searchByLocation)

        .onSnapshot(function (querySnapshot) {
          var response = [];

          querySnapshot.forEach(function (doc) {
            //  if(searchByLocation && (searchByLocation===doc.data().name))
            response.push(doc.data());
            //       console.log(doc.data());
          });
          setFailureHistory(response);
          //console.log("Current data: ", response.join(", "));
        });
    }
  };

  const getLocationData = async () => {
    db.collection("signals").onSnapshot(function (querySnapshot) {
      var locationResponse = [];
      querySnapshot.forEach(function (doc) {
        locationResponse.push(doc.data().name);
        //       console.log(doc.data());
      });
      setLocation(locationResponse);
      //console.log("Current data: ", response.join(", "));
    });
  };

  useEffect(() => {
    getFailureHistoryData();
    console.log(failureHistory);
  }, [searchByLocation]);

  useEffect(() => {
    getLocationData();
    console.log(location);
  }, []);

  return (
    <SafeView style={styles.contain}>
      <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
        Select an outstation below
      </Text>

      <Picker
        mode="dropdown"
        selectedValue={searchByLocation}
        style={{ height: 50, width: 210, color: "#fff" }}
        onValueChange={(itemValue, itemIndex) => setSearchByLocation(itemValue)}
      >
        <Picker.Item label="View By Location..." value="" />
        {location &&
          location.map((loc) => {
            return <Picker.Item label={loc} value={loc} />;
          })}
      </Picker>
      <FlatList
        style={{ marginLeft: -20, marginRight: -20 }}
        keyExtractor={(item) => item.Time}
        data={failureHistory}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.txtColor}>
              Date :<Text style={styles.txtColor}>{item.Date}</Text>
            </Text>
            <Text style={styles.txtColor}>
              Out Station :<Text style={styles.txtColor}>{item.Location}</Text>
            </Text>
          </View>
        )}
      />
    </SafeView>
  );
}

const styles = StyleSheet.create({
  contain: {
    padding: 15,
    backgroundColor: "skyblue",
  },
  card: {
    padding: 5,
    alignContent: "center",

    borderRadius: 6,
    elevation: 3,
    backgroundColor: "skyblue",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
  },
  txtColor: {
    color: "white",
    fontWeight: "bold",
  },
});
