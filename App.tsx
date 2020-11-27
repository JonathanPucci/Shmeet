import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View, SafeAreaView } from "react-native";
import BootSplash from "react-native-bootsplash";
import { store } from './src/redux';
import { Provider } from "react-redux"
// import AppNavigator from "./src/navigation/AppNavigator";
import AppNavigator from "./src/navigation/AppZoomNavigator";
import { ScrollView } from "react-native-gesture-handler";

let bootSplashLogo = require("./assets/bootsplash_logo.png");

let fakeApiCallWithoutBadNetwork = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let App = () => {
  let [bootSplashIsVisible, setBootSplashIsVisible] = useState(true);
  let [bootSplashLogoIsLoaded, setBootSplashLogoIsLoaded] = useState(false);
  let opacity = useRef(new Animated.Value(1));
  let translateY = useRef(new Animated.Value(0));

  let init = async () => {
    // You can uncomment this line to add a delay on app startup
    // await fakeApiCallWithoutBadNetwork(3000);

    await BootSplash.hide();

    Animated.stagger(250, [
      Animated.spring(translateY.current, {
        useNativeDriver: true,
        toValue: -50,
      }),
      Animated.spring(translateY.current, {
        useNativeDriver: true,
        toValue: Dimensions.get("window").height,
      }),
    ]).start();

    Animated.timing(opacity.current, {
      useNativeDriver: true,
      toValue: 0,
      duration: 150,
      delay: 350,
    }).start(() => {
      setBootSplashIsVisible(false);
    });
  };

  useEffect(() => {
    bootSplashLogoIsLoaded && init();
  }, [bootSplashLogoIsLoaded]);

  return (
    <Provider store={store}>
        <AppNavigator />
      {bootSplashIsVisible && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.bootsplash,
            { opacity: opacity.current },
          ]}
        >
          <Animated.Image
            source={bootSplashLogo}
            fadeDuration={0}
            onLoadEnd={() => setBootSplashLogoIsLoaded(true)}
            style={[
              styles.logo,
              { transform: [{ translateY: translateY.current }] },
            ]}
          />
        </Animated.View>
      )}
    </Provider>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  text: {
    fontSize: 24,
    fontWeight: "700",
    margin: 20,
    lineHeight: 30,
    color: "#333",
    textAlign: "center",
  },
  textBottom: {
    fontSize: 12,
    fontWeight: "700",
    margin: 20,
    lineHeight: 30,
    color: "#333",
    textAlign: "center",
    position: "absolute",
    bottom: 20
  },
  center: {
    textAlign: "center",
  },
  italic: {
    fontStyle: "italic",
    textAlign: "center",
  },
  bootsplash: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  logo: {
    height: 100,
    width: 100,
  },
});

export default App;