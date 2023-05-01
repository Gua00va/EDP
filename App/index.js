import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native";
import * as SMS from "expo-sms";
import axios from "axios";
import "react-native-url-polyfill/auto";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07121B",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderWidth: 10,
    borderColor: "#89AAFF",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonStop: {
    borderColor: "#FF851B",
  },
  buttonSOS: {
    borderColor: "#D2042D",
  },
  buttonText: {
    fontSize: 45,
    color: "#89AAFF",
  },
  buttonTextStop: {
    color: "#FF851B",
  },
  buttonTextSos: {
    color: "#D2042D",
    fontSize: 45,
  },
  timerText: {
    color: "#fff",
    fontSize: 90,
  },
  picker: {
    width: 50,
    ...Platform.select({
      android: {
        color: "#fff",
        backgroundColor: "#07121B",
        marginLeft: 10,
      },
    }),
  },
  pickerItem: {
    color: "#fff",
    fontSize: 20,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

// 3 => 03, 10 => 10
const formatNumber = (number) => `0${number}`.slice(-2);

const getRemaining = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

const createArray = (length) => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }

  return arr;
};

const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);

const encodedParams = new URLSearchParams();
encodedParams.set("username", "rahurahuj1teu2023");
encodedParams.set("password", "ess6252");
encodedParams.set("from", "SOS");
encodedParams.set("to", "+919855329220", "+918860868797");
encodedParams.set("text", "Hello World");
encodedParams.set("type", "0");

const options = {
  method: "POST",
  url: "https://easysendsms.p.rapidapi.com/bulksms",
  headers: {
    "content-type": "application/x-www-form-urlencoded",
    "X-RapidAPI-Key": "47e14575bfmsh42d77666aa596ffp188c74jsn3fad a6585ff7",
    "X-RapidAPI-Host": "easysendsms.p.rapidapi.com",
  },
  data: encodedParams,
};

export default class App extends React.Component {
  state = {
    remainingSeconds: 5,
    isRunning: false,
    selectedMinutes: "0",
    selectedSeconds: "5",
    temperature: "0",
  };

  interval = null;

  componentDidUpdate(prevProp, prevState) {
    if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
      this.sendSMS();
      this.stop();
    }
    this.getSensorData();
    console.log(this.state.temperature);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  sendSMS = async () => {
    console.log("sending");
    // try {
    //   const response = await axios.request(options);
    //   console.log(response.data);`
    // } catch (error) {
    //   console.error(error);
    // }
  };

  getSensorData = async () => {
    console.log("fetching");
    const response = await axios.get(
      "https://api.thingspeak.com/channels/2128513/feeds.json?api_key=PT4BF8G6YFN24YZI&results=1"
    );

    const data = response.data;
    console.log(data.feeds[0].field1);
    // setTemp(data.feeds[0].field1);
    this.state.temperature = data.feeds[0].field1;
    // return data.feeds[0].field1;
  };

  start = () => {
    this.setState((state) => ({
      remainingSeconds:
        parseInt(state.selectedMinutes, 10) * 60 +
        parseInt(state.selectedSeconds, 10),
      isRunning: true,
    }));

    this.interval = setInterval(() => {
      this.setState((state) => ({
        remainingSeconds: state.remainingSeconds - 1,
      }));
    }, 1000);
  };

  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({
      remainingSeconds: 5, // temporary
      isRunning: false,
    });
  };

  renderPickers = () => (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedMinutes}
        onValueChange={(itemValue) => {
          this.setState({ selectedMinutes: itemValue });
        }}
        mode="dropdown"
      >
        {AVAILABLE_MINUTES.map((value) => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>minutes</Text>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedSeconds}
        onValueChange={(itemValue) => {
          this.setState({ selectedSeconds: itemValue });
        }}
        mode="dropdown"
      >
        {AVAILABLE_SECONDS.map((value) => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>seconds</Text>
    </View>
  );

  render() {
    const { minutes, seconds } = getRemaining(this.state.remainingSeconds);

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {this.state.isRunning ? (
          <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
        ) : (
          this.renderPickers()
        )}
        {this.state.isRunning ? (
          <TouchableOpacity
            onPress={this.stop}
            style={[styles.button, styles.buttonStop]}
          >
            <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.start} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={this.getSensorData}
          style={[styles.button, styles.buttonSOS]}
        >
          <Text style={[styles.buttonTextSos]}>SOS</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
