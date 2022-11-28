import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useImperativeHandle,
} from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { getBorder } from "../utils/util";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

interface BottomSheetProps {
  readonly backgroundColor: string;
}

export interface BottomSheetRefProps {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
}

const useAnimatedHeight = (ref: React.ForwardedRef<BottomSheetRefProps>) => {
  const translateY = useSharedValue(0);
  const active = useSharedValue(false);

  const scrollTo = useCallback((destination: number) => {
    "worklet";
    active.value = destination !== 0;

    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  const ctx = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      ctx.value = translateY.value;
    })
    .onUpdate((e) => {
      translateY.value = e.translationY + ctx.value;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 3) {
        scrollTo(0);
      } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
        scrollTo(MAX_TRANSLATE_Y);
      }
    });

  const rStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolate.CLAMP
    );

    return {
      borderRadius,
      transform: [{ translateY: translateY.value }],
    };
  });

  const isActive = useCallback(() => {
    return active.value;
  }, []);

  // Assign functions to ref
  useImperativeHandle(
    ref,
    () => ({
      scrollTo,
      isActive,
    }),
    [scrollTo, isActive]
  );

  return { translateY, rStyle, gesture, scrollTo, isActive };
};

export const BottomSheet = React.forwardRef<
  BottomSheetRefProps,
  PropsWithChildren<BottomSheetProps>
>(({ backgroundColor, children }, ref) => {
  const animatedHeight = useAnimatedHeight(ref);

  return (
    <GestureDetector gesture={animatedHeight.gesture}>
      <Animated.View
        style={[styles.container, { backgroundColor }, animatedHeight.rStyle]}
      >
        <View style={styles.drawer}>
          <View style={styles.handle} />
        </View>
        <View style={styles.body}>{children}</View>
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: SCREEN_HEIGHT,
    top: SCREEN_HEIGHT * 0.95,

    width: "100%",

    borderRadius: 25,

    ...getBorder(),
  },

  drawer: {
    flex: 1,
    height: "10%",
    paddingTop: 16,

    // justifyContent: "center",
    alignItems: "center",
  },

  handle: {
    height: 0,
    width: "20%",

    borderWidth: 2,
    borderColor: "#888888",
    borderRadius: 3,
  },

  body: {
    height: "90%",
  },
});
