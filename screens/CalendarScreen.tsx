import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Draggable1 from "../components/Draggable1";
import Draggable2 from "../components/Draggable2";

export default class CalendarScreen extends Component {
  state = {
    activeDate: new Date(),
    dropZoneValues: [],
    colWidth: null,
    isColWidth: false,
    dateStates: [],
  };

  componentDidMount() {}

  componentDidUpdate() {}

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

  setDropZoneValues(item: any, x: any, y: any, row: any) {
    let newZone = {
      item,
      x,
      y,
      row,
    };
    this.setState({ dropZoneValues: [...this.state.dropZoneValues, newZone] });
    this.setColWidth();
  }

  setColWidth() {
    if (this.state.isColWidth == false) {
      let lastEntry = { item: 0, x: 0 };
      for (const entry of this.state.dropZoneValues) {
        if (entry.row === 3) {
          if (entry.item - lastEntry.item == 1) {
            let colWidth = entry.x - lastEntry.x;
            this.setState({ colWidth: colWidth, isColWidth: true });

            break;
          } else {
            lastEntry = { item: entry.item, x: entry.x };
          }
        }
      }
    }
  }

  checkBoundaries(x: any, y: any, id: any) {
    for (const zones of this.state.dropZoneValues) {
      const newBoundaries = {
        item: zones.item,
        x1: zones.x,
        x2: zones.x + this.state.colWidth,
        y1: zones.y + 70 * zones.row,
        y2: zones.y + 70 * zones.row + 70,
        row: zones.row,
      };

      if (
        id == 1 &&
        Math.abs(-200 - x) > newBoundaries.x1 &&
        Math.abs(-200 - x) < newBoundaries.x2 &&
        Math.abs(-520 - y) > newBoundaries.y1 &&
        Math.abs(-520 - y) < newBoundaries.y2
      ) {
        this._onPress(newBoundaries.item, id);
      } else if (
        id == 2 &&
        Math.abs(-300 - x) > newBoundaries.x1 &&
        Math.abs(-300 - x) < newBoundaries.x2 &&
        Math.abs(-520 - y) > newBoundaries.y1 &&
        Math.abs(-520 - y) < newBoundaries.y2
      ) {
        this._onPress(newBoundaries.item, id);
      }
    }
  }

  _onPress = (item: any, id?: number) => {
    this.setState(() => {
      if (!item.match && item != -1) {
        this.state.activeDate.setDate(item);
        if (id != undefined) {
          let year = this.state.activeDate.getFullYear();
          let month = this.state.activeDate.getMonth();

          let dayId = new Date(year, month, item);
          let itemIndex = this.state.dateStates.findIndex((obj) => {
            return obj.id === dayId.toString();
          });
          if (id == 1) {
            if (itemIndex === -1) {
              console.log("undefined");
              this.setState({
                dateStates: [
                  ...this.state.dateStates,
                  {
                    id: dayId.toString(),
                    value1: true,
                  },
                ],
              });
            } else {
              console.log("trying to update");

              let newArray = [...this.state.dateStates];
              newArray[itemIndex] = {
                ...newArray[itemIndex],
                value1: true,
              };
              this.setState({ dateStates: newArray });
            }
          } else if (id == 2) {
            console.log("ok2");

            console.log(itemIndex);
            if (itemIndex === -1) {
              console.log("undefined");
              this.setState({
                dateStates: [
                  ...this.state.dateStates,
                  {
                    id: dayId.toString(),
                    Value2: true,
                  },
                ],
              });
            } else {
              console.log("trying to update");

              let newArray = [...this.state.dateStates];
              newArray[itemIndex] = {
                ...newArray[itemIndex],
                value2: true,
              };
              this.setState({ dateStates: newArray });
            }
          }
        } else {
          console.log(this.state.dateStates);
        }
        return this.state;
      }
    });
  };

  changeMonth = (val: number) => {
    this.setState(() => {
      this.state.activeDate.setMonth(this.state.activeDate.getMonth() + val);
      return this.state;
    });
  };

  render() {
    let matrix = this.generateMatrix();
    var rows = [];
    rows = matrix.map((row: any, rowIndex: any) => {
      var rowItems = row.map((item: any, colIndex: any) => {
        let year = this.state.activeDate.getFullYear();
        let month = this.state.activeDate.getMonth();

        let dayId = new Date(year, month, item);
        let dateState = this.state.dateStates.find((obj) => {
          return obj.id === dayId.toString();
        });

        return (
          <View
            key={colIndex}
            onLayout={(e) => {
              let layout = e.nativeEvent.layout;
              rowIndex != 0 && item != -1
                ? this.setDropZoneValues(item, layout.x, layout.y, rowIndex)
                : null;
            }}
            style={{
              flex: 1,
              height: rowIndex == 0 ? 20 : 70,
              borderWidth: 1,
            }}
          >
            <Text
              key={colIndex}
              style={{
                flex: 1,

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
            {dateState == undefined ? null : dateState.value1 == true ? (
              <Text style={styles.image1}>okokok</Text>
            ) : null}
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
            <TouchableOpacity
              style={styles.calendarLeftCircle}
              onPress={() => this.changeMonth(-1)}
            >
              <View>
                <AntDesign
                  name="leftcircleo"
                  size={24}
                  color="black"
                  style={{ elevation: -1 }}
                />
              </View>
            </TouchableOpacity>

            <Text style={styles.calendarText}>
              {this.months[this.state.activeDate.getMonth()]} &nbsp;
              {this.state.activeDate.getFullYear()}
            </Text>
            <TouchableOpacity
              style={styles.calendarRightCircle}
              onPress={() => this.changeMonth(+1)}
            >
              <View>
                <AntDesign
                  name="rightcircleo"
                  size={24}
                  color="black"
                  style={{ elevation: -1 }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.calendarRows}>
            {rows}
            {/* <Animated.View
              {...this.panResponder.panHandlers}
              style={[panStyle, styles.circle]}
            /> */}

            <Draggable1 func={(x, y, id) => this.checkBoundaries(x, y, id)} />
            <Draggable2 func={(x, y, id) => this.checkBoundaries(x, y, id)} />
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
    elevation: 33,
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
    elevation: 33,
  },
  calendarRows: {
    height: 500,
  },
  circle: {
    backgroundColor: "skyblue",
    width: 25 * 2,
    height: 25 * 2,
    borderRadius: 25,
    position: "absolute",
    top: 500,
    left: 200,
  },
  circle2: {
    backgroundColor: "yellow",
    width: 25 * 2,
    height: 25 * 2,
    borderRadius: 25,
    position: "absolute",
    top: 500,
    left: 100,
  },
  circle3: {
    backgroundColor: "red",
    width: 25 * 2,
    height: 25 * 2,
    borderRadius: 25,
    position: "absolute",
    top: 500,
    left: 300,
  },
  image1: {
    backgroundColor: "red",
    flex: 1,
    position: "relative",
    alignSelf: "center",
  },
});
