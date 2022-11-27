import React, { FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StyleProp,
  ViewStyle,
  Pressable,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  Extrapolation,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Layout,
} from "react-native-reanimated";
import { INTERVALS } from "../utils/util";

export const CARD_WIDTH = Dimensions.get("screen").width - 2 * 32;
export const CARD_HEIGHT = 256;

const SWIPE_DELTA = 100;
const MAX_ROTATION = 15;

export interface CardProps {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly backgroundColor: string;
  readonly onGestureEnd?: (id: string) => void;
  readonly onClosePress?: () => void;

  readonly offset?: number;
}

type PanContext = {
  x: number;
  y: number;
};

export const Card: FC<CardProps> = (props) => {
  const customStyle: StyleProp<ViewStyle> = {
    backgroundColor: props.backgroundColor,
    marginTop: +`-0.8${props.offset ?? 0}` * CARD_HEIGHT,
  };

  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const translationY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onBegin((event) => {
      // topLeft  (20deg, -20deg)
      // topRight (20deg, 20deg)
      // bottomLeft (-20deg, -20deg)
      // bottomRight (-20deg, 20deg)

      rotateX.value = withTiming(
        interpolate(
          event.y,
          [0, CARD_HEIGHT],
          [MAX_ROTATION, -MAX_ROTATION],
          Extrapolate.CLAMP
        )
      );
      rotateY.value = withTiming(
        interpolate(
          event.x,
          [0, CARD_WIDTH],
          [-MAX_ROTATION, MAX_ROTATION],
          Extrapolation.CLAMP
        )
      );
    })
    .onUpdate((event) => {
      rotateX.value = interpolate(
        event.y,
        [0, CARD_HEIGHT],
        [MAX_ROTATION, -MAX_ROTATION],
        Extrapolate.CLAMP
      );
      rotateY.value = interpolate(
        event.x,
        [0, CARD_WIDTH],
        [-MAX_ROTATION, MAX_ROTATION],
        Extrapolation.CLAMP
      );

      translationY.value = event.translationY;
    })
    .onFinalize(() => {
      rotateX.value = withTiming(0);
      rotateY.value = withTiming(0);
      translationY.value = withTiming(0, { duration: INTERVALS.ms750 });

      // Set card as last (will be displayed first on screen)
      if (Math.abs(translationY.value) >= SWIPE_DELTA) {
        props.onGestureEnd && runOnJS(props.onGestureEnd)(props.id);
      }
    });

  const rCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { translateY: translationY.value },
        { rotateX: `${rotateX.value ?? 0}deg` },
        { rotateY: `${rotateY.value ?? 0}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, rCardStyle, customStyle]}>
        <View style={styles.header}>
          <Text style={styles.text}>{props.title}</Text>
          <Pressable onPress={props.onClosePress} style={styles.close}>
            <Text style={styles.closeText}>X</Text>
          </Pressable>
        </View>
        <View style={styles.body}>
          <Text style={styles.text}>{props.content}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.text}>{props.title}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "column",

    zIndex: 999,

    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    maxHeight: CARD_HEIGHT,

    borderRadius: 8,
  },

  header: {
    flex: 1,
    paddingTop: 16,
    height: CARD_HEIGHT * 0.2,
  },

  body: {
    paddingTop: 16,
    height: CARD_HEIGHT * 0.7,
  },

  footer: {
    height: CARD_HEIGHT * 0.1,
  },

  text: {
    color: "#F3F3F3",
    fontSize: 12,

    alignSelf: "center",
  },

  close: {
    position: "absolute",
    right: 16,
    top: 12,

    backgroundColor: "white",
    width: 32,

    borderRadius: 32,

    justifyContent: "center",
    alignContent: "center",
  },

  closeText: {
    fontSize: 16,
    FontWeight: "bold",
    alignSelf: "center",
  },
});
