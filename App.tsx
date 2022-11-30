import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import {
  BottomTabBarProps,
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { FC } from "react";
import { AnimatedTabBar } from "./src/navigation/AnimatedTabBar";
import Lottie from "lottie-react-native";

const ICON_SIZE = 32;

export interface MyScreenProps {
  text: string;
}

enum RouteNames {
  Home = "Home",
  Alerts = "Alerts",
  Settings = "Settings",
}

type RoutePropsParamList = {
  [RouteNames.Home]: MyScreenProps;
  [RouteNames.Alerts]: MyScreenProps;
  [RouteNames.Settings]: MyScreenProps;
};

const HomeScreen: FC<
  BottomTabScreenProps<RoutePropsParamList, RouteNames.Home>
> = ({ route }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#67C6E6",
      }}
    >
      <Text>{route.params.text}</Text>
    </View>
  );
};

const AlertsScreen: FC<
  BottomTabScreenProps<RoutePropsParamList, RouteNames.Alerts>
> = ({ route }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#BE4710",
      }}
    >
      <Text>{route.params.text}</Text>
    </View>
  );
};

const SettingsScreen: FC<
  BottomTabScreenProps<RoutePropsParamList, RouteNames.Settings>
> = ({ route }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#CCAAF3",
      }}
    >
      <Text>{route.params.text}</Text>
    </View>
  );
};

const Tab = createBottomTabNavigator<RoutePropsParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={(props) => <AnimatedTabBar {...props} />}>
        <Tab.Screen
          name={RouteNames.Home}
          component={HomeScreen}
          options={{
            // @ts-ignore
            tabBarIcon: ({ ref }) => (
              <Lottie
                ref={ref}
                loop={false}
                autoPlay={false}
                source={require("./src/assets/lottie/home.json")}
                style={styles.icon}
              />
            ),
          }}
          initialParams={{ text: "Home" }}
        />
        <Tab.Screen
          name={RouteNames.Alerts}
          component={AlertsScreen}
          options={{
            // @ts-ignore
            tabBarIcon: ({ ref }) => (
              <Lottie
                ref={ref}
                loop={false}
                autoPlay={false}
                source={require("./src/assets/lottie/alerts.json")}
                style={styles.icon}
              />
            ),
          }}
          initialParams={{ text: "Alerts" }}
        />
        <Tab.Screen
          name={RouteNames.Settings}
          component={SettingsScreen}
          options={{
            // @ts-ignore
            tabBarIcon: ({ ref }) => (
              <Lottie
                ref={ref}
                loop={false}
                autoPlay={false}
                source={require("./src/assets/lottie/settings.json")}
                style={styles.icon}
              />
            ),
          }}
          initialParams={{ text: "Settings" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

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
  icon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
  },
});
