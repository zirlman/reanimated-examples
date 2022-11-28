import React, { useCallback, useRef } from "react";
import { View, StyleSheet, Text, Dimensions, SafeAreaView } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  BottomSheet,
  BottomSheetRefProps,
} from "./src/bottomsheet/BottomSheet";

const CIRCLE_SIZE = 64;
const COLOR_1 = "#bdd9bf";
const COLOR_2 = "#2e4052";
const COLOR_3 = "#412234";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type AnimatedPosition = {
  x: SharedValue<number>;
  y: SharedValue<number>;
};
const useFollowAnimatedPosition = ({ x, y }: AnimatedPosition) => {
  const followX = useDerivedValue(() => {
    return withSpring(x.value);
  });
  const followY = useDerivedValue(() => {
    return withSpring(y.value);
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: followX.value }, { translateY: followY.value }],
    };
  });

  return { followX, followY, rStyle };
};

const useFollowAnimation = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const follow = useFollowAnimatedPosition({
    x: translateX,
    y: translateY,
  });
  const follow2 = useFollowAnimatedPosition({
    x: follow.followX,
    y: follow.followY,
  });
  const follow3 = useFollowAnimatedPosition({
    x: follow2.followX,
    y: follow2.followY,
  });

  const context = useSharedValue({ x: 0, y: 0 });
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value.x = translateX.value;
      context.value.y = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = e.translationX + context.value.x;
      translateY.value = e.translationY + context.value.y;
    })
    .onEnd(() => {
      translateX.value = translateX.value > SCREEN_WIDTH / 2 ? SCREEN_WIDTH : 0;
    });

  return { follow, follow2, follow3, gesture };
};

export default function App() {
  const { follow, follow2, follow3, gesture } = useFollowAnimation();

  const bottomSheetRef = useRef<BottomSheetRefProps>(null);

  const onCirclePress = useCallback(() => {
    const scrollTo = bottomSheetRef.current?.isActive() ? 0 : -200;

    bottomSheetRef.current?.scrollTo(scrollTo);
  }, []);

  return (
    <GestureHandlerRootView style={styles.flex1}>
      <View style={styles.container}>
        <Animated.View
          style={[styles.circle, follow2.rStyle, { backgroundColor: COLOR_2 }]}
        >
          <Text style={styles.text}>2</Text>
        </Animated.View>
        <Animated.View
          style={[styles.circle, follow3.rStyle, { backgroundColor: COLOR_3 }]}
        >
          <Text style={styles.text}>3</Text>
        </Animated.View>

        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[styles.circle, follow.rStyle, { backgroundColor: COLOR_1 }]}
          >
            <Text style={styles.text}>1</Text>
          </Animated.View>
        </GestureDetector>
        <TouchableOpacity style={styles.button} onPress={onCirclePress}>
          <Text style={styles.text}>Toggle</Text>
        </TouchableOpacity>
        <BottomSheet ref={bottomSheetRef} backgroundColor={COLOR_3} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,

    backgroundColor: "#111",

    alignItems: "center",
    justifyContent: "center",
  },

  circle: {
    position: "absolute",
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,

    borderRadius: CIRCLE_SIZE / 2,

    alignItems: "center",
    justifyContent: "center",
  },

  text: {},

  button: {
    height: 60,

    borderRadius: 30,
    aspectRatio: 1,
    backgroundColor: "white",
    opacity: 0.6,

    alignItems: "center",
    justifyContent: "center",
  },
});
