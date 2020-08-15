import React, { Component } from "react";
import { Text, View, StyleSheet, PanResponder, Animated } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

export default class CalendarScreen extends Component {
  state = {
    activeDate: new Date(),
    pan: new Animated.ValueXY({ x: 0, y: 0 }),
    views: [],
    dropZoneValues: [],
  };

  componentDidMount() {}

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    // onPanResponderGrant: () => {
    //   this.state.pan.setOffset({
    //     x: this.state.pan.x.__getValue(),
    //     y: this.state.pan.y.__getValue(),
    //   });

    //   this.state.pan.setValue({ x: 0, y: 0 });
    // },

    onPanResponderMove: Animated.event(
      [null, { dx: this.state.pan.x, dy: this.state.pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      Animated.spring(this.state.pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
      // this.state.pan.flattenOffset();
      // console.log(this.state.pan);
    },
  });

  months = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwic",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];
  weekDays = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sb", "Nd"];
  nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  generateMatrix() {
    let matrix: any = [];

    matrix[0] = this.weekDays;

    let year = this.state.activeDate.getFullYear();
    let month = this.state.activeDate.getMonth();

    let firstDay = new Date(year, month, 0).getDay();

    let maxDays = this.nDays[month];
    if (month === 1) {
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        maxDays += 1;
      }
    }

    let counter = 1;
    for (let row = 1; row < 7; row++) {
      matrix[row] = [];
      for (let col = 0; col < 7; col++) {
        matrix[row][col] = -1;
        if (row == 1 && col >= firstDay) {
          matrix[row][col] = counter++;
        } else if (row > 1 && counter <= maxDays) {
          matrix[row][col] = counter++;
        }
      }
    }
    return matrix;
  }

  _onPress = (item: any) => {
    this.setState(() => {
      if (!item.match && item != -1) {
        this.state.activeDate.setDate(item);
        console.log(this.state.dropZoneValues);
        return this.state;
      }
    });
  };

  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };

    let matrix = this.generateMatrix();
    var rows = [];
    rows = matrix.map((row: any, rowIndex: any) => {
      var rowItems = row.map((item: any, colIndex: any) => {
        return (
          <View
            key={colIndex}
            style={{
              flex: 1,
              height: rowIndex == 0 ? 20 : 55,
              borderWidth: 1,
            }}
          >
            <Text
              key={colIndex}
              style={{
                flex: 1,
                height: rowIndex == 0 ? 20 : 55,
                borderWidth: 1,
                textAlign: "center",
                // Highlight header
                backgroundColor: rowIndex == 0 ? "#ddd" : "#fff",
                // Highlight Sundays
                color: colIndex == 6 ? "#a00" : "#000",
                // Highlight current date
                fontWeight:
                  item == this.state.activeDate.getDate() ? "bold" : "normal",
              }}
              onPress={() => this._onPress(item)}
            >
              {item != -1 ? item : ""}
            </Text>
          </View>
        );
      });
      return (
        <View
          key={rowIndex}
          style={{
            flex: 1,
            flexDirection: "row",
            padding: 15,
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {rowItems}
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity style={styles.calendarLeftCircle}>
              <AntDesign name="leftcircleo" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.calendarText}>
              {this.months[this.state.activeDate.getMonth()]} &nbsp;
              {this.state.activeDate.getFullYear()}
            </Text>
            <TouchableOpacity style={styles.calendarRightCircle}>
              <AntDesign name="rightcircleo" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.calendarRows}>
            <Animated.View
              {...this.panResponder.panHandlers}
              style={[panStyle, styles.circle]}
            />
            {rows}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  calendarContainer: {
    top: 35,
    width: "100%",
  },
  calendarHeader: {
    top: 10,
    flexDirection: "row",
    height: 50,

    justifyContent: "center",
  },
  calendarLeftCircle: {
    width: 30,
    right: 20,
  },
  calendarText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    alignSelf: "baseline",
  },
  calendarRightCircle: {
    width: 30,
    left: 20,
  },
  calendarRows: {
    height: 500,
  },
  circle: {
    backgroundColor: "skyblue",
    width: 10 * 2,
    height: 10 * 2,
    borderRadius: 10,
    position: "absolute",
  },
});
