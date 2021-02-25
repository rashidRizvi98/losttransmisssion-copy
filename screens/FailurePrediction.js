import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  ScrollView,
  Picker,
  Text,
} from "react-native";
import Card from "../components/Card";
import Colors from "../utils/colors";
import { db } from "../components/Firebase/firebase";
import AppButton from "../components/AppButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import SafeView from "../components/SafeView";

export default function FailurePrediction() {
  const [report, setReport] = useState([]);
  const [signal, setSignal] = useState([]);
  const [location, setLocation] = useState("Colombo");
  const [number, setNumber] = useState();

  const getWeatherReport = async () => {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?q=${location},lk&appid=a406dfeefad605949acd872309284380&units=metric`
    );
    const data = await response.json();
    setReport(data.list);
  };

  // const getData = async () => {
  //   db.collection("signal").onSnapshot(function (querySnapshot) {
  //     var response = [];
  //     querySnapshot.forEach(function (doc) {
  //       response.push(doc.data().Name);
  //     });
  //     setSignal(response);
  //     console.log("Current data: ", response.join(", "));
  //   });
  // };

  const getData = async () => {
    const response = db.collection("signals");
    const data = await response.get();
    var signals = [];
    data.docs.forEach((item) => {
      signals.push(item.data());
    });
    setSignal(signals);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getWeatherReport();
  }, [location]);

  const renderItem = ({ item }) => (
    <Card
      location={getWeatherReport}
      time={item.dt_txt}
      temperature={item.main.temp}
      pressure={item.main.pressure}
      humidity={item.main.humidity}
      visibility={item.weather[0].description}
    />
  );

  return (
    <SafeView style={styles.contain}>
      <Picker
        mode="dropdown"
        selectedValue={location}
        style={{
          color: "#fff",
          height: 50,
          width: 200,
        }}
        onValueChange={(itemValue, itemIndex) => setLocation(itemValue)}
      >
        {signal &&
          signal.map((sig) => {
            return <Picker.Item label={sig.name} value={sig.name} />;
          })}
      </Picker>
      {/* <Text>{number}</Text> */}

      {/* <Text>{location}</Text> */}

      <FlatList
        style={{ marginLeft: -20, marginRight: -20 }}
        //        horizontal={true}
        keyExtractor={(item) => item.dt_txt}
        data={report}
        renderItem={renderItem}
      />
    </SafeView>

    // <View style={styles.container}>
    //   <ScrollView>
    //     {report.map((singleReport) => {
    //       return (
    //         <View style={{ padding: 10 }}>
    //           <Card
    //             time={singleReport.dt_txt}
    //             temperature={singleReport.main.temp}
    //             pressure={singleReport.main.pressure}
    //             humidity={singleReport.main.humidity}
    //             visibility={singleReport.weather[0].description}
    //           />
    //         </View>
    //       );
    //     })}
    //   </ScrollView>
    // </View>
  );
}

const styles = StyleSheet.create({
  contain: {
    padding: 15,
    backgroundColor: "skyblue",
  },
  pickerWrapper: {
    borderColor: "tomato",
    borderBottomColor: "tomato",
  },
});
