import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";
import DonutChart from "./DonutChart";
import colors from "../utils/colors";
import { LinearGradient } from "expo-linear-gradient";

var url = "http://ec2-3-133-133-148.us-east-2.compute.amazonaws.com/api";
//http://192.168.43.151:5000/api
//http://ec2-3-133-133-148.us-east-2.compute.amazonaws.com/api

function Card({ location, time, temperature, pressure, humidity, visibility }) {
  const [possibility, setPossibility] = useState("");

  const getPossibility = async () => {
    axios
      .post(url, [[temperature, pressure, humidity, visibility]])
      .then((response) => {
        //console.log("succes axios :", response.data);
        const poss = response.data;
        setPossibility(poss);
      })
      .catch((error) => {
        console.log("fail axios :", error);
      });
  };

  useEffect(() => {
    getPossibility();
  }, [location]);

  return (
    <View style={styles.card}>
      <Text style={styles.txtColor}>
        Time: <Text style={styles.txtColor}> {time}</Text>
      </Text>

      <Text style={styles.txtColor}>
        Temperature: <Text style={styles.txtColor}> {temperature}</Text>
      </Text>

      <Text style={styles.txtColor}>
        Pressure: <Text style={styles.txtColor}> {pressure}</Text>
      </Text>

      <Text style={styles.txtColor}>
        Humidity: <Text style={styles.txtColor}> {humidity}</Text>
      </Text>

      <Text style={styles.txtColor}>
        Visibility: <Text style={styles.txtColor}> {visibility}</Text>
      </Text>

      <Text style={styles.txtColor}>
        Signal failure possibility:
        <Text style={styles.txtColor}> {Math.round(possibility * 100)}</Text>
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          alignItems: "center",
          paddingTop: 40,
        }}
      >
        <DonutChart
          percentage={possibility * 100}
          color={"tomato"}
          delay={1000}
          max={100}
        />
      </View>
    </View>
  );
}

export default Card;

const styles = StyleSheet.create({
  container: {},
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
