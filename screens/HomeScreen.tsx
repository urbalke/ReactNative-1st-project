import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Switch,
} from "react-native";
import * as Font from "expo-font";

class HomeScreen extends Component {
  state = {
    humidity: "",
    temperature: "",
    power: "",
    depth: "",
    powerIsOn: false,
    setPowerIsOn: false,
    isFetching: true,
    image: 0,
    fontsLoaded: false,
    switchValue: false,
  };

  async componentDidMount() {
    this.getStatus();
    try {
      await Font.loadAsync({
        JustOne: require("../assets/fonts/JustOne.ttf"),
      }).then(this.setState({ fontsLoaded: true }));
    } catch (err) {
      console.log(err);
    }
  }

  setImage = () => {
    if (this.state.humidity >= 55 && this.state.humidity <= 100) {
      this.setState({ image: 1 });
    } else if (this.state.humidity >= 45 && this.state.humidity <= 54) {
      this.setState({ image: 2 });
    } else if (this.state.humidity < 45) {
      this.setState({ image: 3 });
    }
  };

  getStatus = () => {
    this.setState({ isFetching: true });
    this.setState({ image: 0 });
    return fetch("http://89.78.59.99//humidifier", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: "5db787bc1c97e15f3399f9e7fe5b916e",
        command: "status",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          humidity: data.humidity,
          temperature: data.temperature,
          power: data.power,
          depth: data.depth,
          isFetching: false,
        });
      })
      .then(() => {
        this.setImage();
      })
      .then(() => {
        if (this.state.power === "on") {
          this.setState({
            powerIsOn: true,
            switchValue: true,
          });
        } else {
          this.setState({
            powerIsOn: false,
            switchValue: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  toggleSwitch = (value: any) => {
    this.turnOn();
    this.setState({ switchValue: value });
  };

  turnOn = () => {
    return fetch("http://89.78.59.99//humidifier", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: "5db787bc1c97e15f3399f9e7fe5b916e",
        command: `${this.state.power === "on" ? "turnOff" : "turnOn"}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          humidity: data.humidity,
          temperature: data.temperature,
          power: data.power,
          depth: data.depth,
          isFetching: false,
        });
      })
      .then(() => {
        this.setImage();
      })
      .then(() => {
        if (this.state.power === "on") {
          this.setState({
            powerIsOn: true,
          });
        } else {
          this.setState({
            powerIsOn: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  reloadFunc = () => {
    let twoButtons = (
      <TouchableOpacity
        onPress={this.getStatus}
        style={{ width: 100, height: 100 }}
      >
        <Image
          source={require("../assets/images/refresh.png")}
          style={styles.buttonReload}
        />
      </TouchableOpacity>
    );
    return twoButtons;
  };

  render() {
    let image;
    let containerBackground = "";
    let textColor = "black";

    switch (this.state.image) {
      case 0:
        containerBackground = "rgb(190, 222, 216)";
        break;
      case 1:
        {
          containerBackground = "rgb(51, 153, 102)";
          textColor = "white";
          image = (
            <Image
              style={{ width: 250, height: 250 }}
              source={require("../assets/images/happy.gif")}
            ></Image>
          );
        }
        break;
      case 2:
        {
          containerBackground = "rgb(249, 226, 150)";
          textColor = "white";
          image = (
            <Image
              style={{ width: 250, height: 250 }}
              source={require("../assets/images/neutral.gif")}
            ></Image>
          );
        }
        break;
      case 3:
        {
          containerBackground = "rgb(255, 204, 153)";
          textColor = "black";
          image = (
            <Image
              style={{ width: 250, height: 250 }}
              source={require("../assets/images/sad.gif")}
            ></Image>
          );
        }
        break;
    }

    let textToRender = (
      <Text style={{ color: textColor, fontFamily: "JustOne", fontSize: 30 }}>
        Humidity is: {this.state.humidity} % {"\n"}
        Temperature is: {this.state.temperature} *C {"\n"}
        Water level: {this.state.depth} %
      </Text>
    );

    let powerHeader = (
      <View>
        <Text
          style={{
            color: textColor,
            fontFamily: "JustOne",
            fontSize: 35,
          }}
        >
          Power is {this.state.power}
        </Text>
        <Switch
          style={{
            left: 60,
            bottom: 34,
            transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
          }}
          trackColor={{ false: "#767577", true: "rgb(215, 245, 217)" }}
          thumbColor={this.state.powerIsOn ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={this.toggleSwitch}
          value={this.state.switchValue}
        />
      </View>
    );

    return (
      <View
        style={[styles.container, { backgroundColor: containerBackground }]}
      >
        <View
          style={{
            top: 100,
            alignContent: "center",
          }}
        >
          {this.state.isFetching ? <Text></Text> : powerHeader}
        </View>

        <View style={styles.smile}>
          {this.state.isFetching ? (
            <Image
              style={{ width: 250, height: 250 }}
              source={require("../assets/images/loading2.gif")}
            />
          ) : (
            image
          )}
        </View>
        <View style={styles.text}>
          {this.state.isFetching ? <Text></Text> : textToRender}
        </View>
        <View
          style={
            (styles.buttons,
            {
              backgroundColor: containerBackground,
              bottom: 35,
              flexDirection: "row",
            })
          }
        >
          {this.state.isFetching ? <Text></Text> : this.reloadFunc()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  smile: {
    flex: 1,
    justifyContent: "flex-end",
    top: 70,
  },
  text: {
    flex: 1,
    top: 70,
  },
  buttons: {
    backgroundColor: "blue",
  },
  buttonReloadContainer: {
    backgroundColor: "transparent",
  },
  buttonReload: {
    width: 100,
    height: 100,
    zIndex: 0,
  },
  buttonWaterDrop: {
    alignSelf: "center",
  },
  absoluteView: {
    flex: 1,
  },
});

export default HomeScreen;
