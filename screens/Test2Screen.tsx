import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

export default class CalendarScreen extends Component {
  state = {
    activeDate: new Date(),
  };
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

  generateTable() {
    let table: any = [];
    table[0] = this.weekDays;

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
    for (let row = 1; row < 5; row++) {
      table[row] = [];
      for (let col = 0; col < 3; col++) {
        table[row][col] = -1;
        if (row == 1 && col >= firstDay) {
          table[row][col] = counter++;
        } else if (row > 1 && counter <= maxDays) {
          table[row][col] = counter++;
        }
      }
    }
    return table;
  }

  render() {
    let table = this.generateTable();
    let rows = [];

    rows = table.map((row: any, rowIndex: any) => {
      let days = row.map((days: any, colIndex: any) => {
        return (
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: "orange",
              borderWidth: 1,
            }}
            key={colIndex}
          >
            <Text>1</Text>
          </View>
        );
      });
      return (
        <View
          style={{
            width: 150,
            height: 20,
            backgroundColor: "white",
            borderWidth: 1,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
          key={rowIndex}
        >
          {days}
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <View style={styles.calendarWrap}>{rows}</View>
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
    justifyContent: "center",
  },
  calendarWrap: {
    width: "100%",
    height: 300,
    backgroundColor: "#bbd0f7",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
