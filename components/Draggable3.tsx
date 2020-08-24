import React, { Component } from "react";
import { Text, View, StyleSheet, PanResponder, Animated } from "react-native";

export default class Draggable3 extends Component {
  state = {
    pan: new Animated.ValueXY({ x: 0, y: 0 }),
  };

  checkBoundaries(x, y, id) {
    this.props.func(x, y, id);
  }
  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      [null, { dx: this.state.pan.x, dy: this.state.pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      this.checkBoundaries(this.state.pan.x._value, this.state.pan.y._value, 3);
      Animated.spring(this.state.pan, {
        toValue: { x: 0, y: 0 },
        speed: 1000,
        useNativeDriver: false,
      }).start();
    },
  });

  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };
    return (
      <Animated.Image
        source={require("../assets/images/fertilizer2.png")}
        {...this.panResponder.panHandlers}
        style={[panStyle, styles.circle]}
      />
    );
  }
}

const styles = StyleSheet.create({
  circle: {
    width: 50,
    height: 50,
    // borderRadius: 25,
    position: "absolute",
    top: 520,
    left: 300,
  },
});
