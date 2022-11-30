import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import Lottie from "lottie-react-native";

import React, { FC, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  LayoutChangeEvent,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { convertCompilerOptionsFromJson } from "typescript";
import { INTERVALS } from "../utils/util";

// 20 pixels is the width of the left part of the svg (the quarter circle outwards)
// 5 pixels come from the little gap between the active background and the circle of the TabBar Components
const SVG_OFFSET = 25;

const ICON_PROPS = {
  size: 16,
  color: "blue",
};

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

type Point2d = {
  x: number;
  y: number;
};

export const AnimatedTabBar: FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const [activeTab, setActiveTab] = useState(state.routes[0].name);
  const { bottom } = useSafeAreaInsets();
  const layoutRef = useRef<Record<string, Point2d>>();

  const onLayout = (name: string, event: LayoutChangeEvent) => {
    const { x, y } = event.nativeEvent.layout;

    if (!layoutRef.current) {
      layoutRef.current = {};
    }

    layoutRef.current[name] = { x, y };
  };

  const xOffset = useDerivedValue(() => {
    if (!layoutRef.current?.[activeTab]) return 0;

    return layoutRef.current[activeTab].x - SVG_OFFSET;
  }, [activeTab, layoutRef.current]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(xOffset.value, { duration: INTERVALS.ms250 }),
        },
      ],
    };
  });

  return (
    <View style={[styles.tabBar, { paddingBottom: bottom }]}>
      <AnimatedSvg
        width={110}
        height={60}
        viewBox="0 0 110 60"
        style={[styles.activeBackground, rStyle]}
      >
        <Path
          fill="#604AE6"
          d="M20 0H0c11.046 0 20 8.953 20 20v5c0 19.33 15.67 35 35 35s35-15.67 35-35v-5c0-11.045 8.954-20 20-20H20z"
        />
      </AnimatedSvg>

      <View style={styles.tabBarItem}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          return (
            <AnimatedTabBarItem
              key={route.key}
              options={options}
              {...ICON_PROPS}
              isActive={activeTab === route.name}
              onPress={() => {
                setActiveTab(route.name);
                navigation.navigate(route.name);
              }}
              onLayout={(e) => onLayout(route.name, e)}
            />
          );
        })}
      </View>
    </View>
  );
};

interface AnimatedTabBarItemProps {
  color: string;
  size: number;
  isActive: boolean;
  options: BottomTabNavigationOptions;
  onPress?: (event: GestureResponderEvent) => void;
  onLayout?: (event: any) => void;
}

type LottieProps = {
  play(startFrame?: number, endFrame?: number): void;
  reset(): void;
  pause(): void;
  resume(): void;
};

const AnimatedTabBarItem: FC<AnimatedTabBarItemProps> = ({
  color,
  size,
  options,
  isActive,
  onPress,
  onLayout,
}) => {
  const ref = useRef<LottieProps>(null);

  useEffect(() => {
    console.log("Active", isActive);

    if (isActive && ref?.current) {
      ref.current?.reset();
      ref.current?.play(0, INTERVALS.ms150);
    }
  }, [isActive, ref?.current]);

  return (
    <TouchableOpacity
      style={styles.component}
      onPress={onPress}
      onLayout={onLayout}
    >
      <View style={styles.componentCircle} />
      <View style={styles.iconContainer}>
        {/* @ts-ignore */}
        {options.tabBarIcon ? options.tabBarIcon({ ref }) : <Text>?</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
  },
  activeBackground: {
    position: "absolute",
  },
  tabBarItem: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  component: {
    height: 60,
    width: 60,
    marginTop: -5,
  },
  componentCircle: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: "white",
  },

  iconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
