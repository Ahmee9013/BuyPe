import React, { useState, useEffect } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from "react-native";
import { CurvedBottomBarExpo } from "react-native-curved-bottom-bar";
import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";
import Ionicons from "@expo/vector-icons/Ionicons";

// Screens
import IndexScreen from "../tabs/index";
import Chat from "./Chat";
import Favorites from "./Favorites";
import Menu from "./Menu";


export default function App() {
  const navigation = useNavigation();
  


  // ✅ Remove this state-based permission check
  // const [hasPermission, setHasPermission] = useState(null);

  // ❌ Remove this effect if we're checking permission on each button press
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     setHasPermission(status === "granted");
  //   })();
  // }, []);

  // ✅ Updated openCamera to check permission every time
  const openCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      navigation.navigate("PostAd");
    } else {
      Alert.alert("Permission Required", "Camera access is needed!");
    }
  };
  
  

  // Icons with active/inactive versions
  const icons = {
    index: {
      active: require("../../assets/images/home3.png"),
      inactive: require("../../assets/images/home.png"),
    },
    Chat: {
      active: require("../../assets/images/message3.png"),
      inactive: require("../../assets/images/message.png"),
    },
    Favorites: {
      active: require("../../assets/images/heart3.png"),
      inactive: require("../../assets/images/heart.png"),
    },
    Menu: {
      active: require("../../assets/images/menu3.png"),
      inactive: require("../../assets/images/menu.png"),
    },
  };

  const _renderIcon = (routeName, selectedTab) => {
    const isSelected = routeName === selectedTab;
    const iconSource = isSelected
      ? icons[routeName].active
      : icons[routeName].inactive;

    return (
      <Image
        source={iconSource}
        style={{
          width: 25,
          height: 25,
          resizeMode: "contain",
        }}
      />
    );
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (
    <CurvedBottomBarExpo.Navigator
      type="DOWN"
      style={styles.bottomBar}
      shadowStyle={styles.shadow}
      height={70}
      circleWidth={70}
      screenOptions={{ headerShown: false }}
      bgColor="#FFD700"
      initialRouteName="index"
    
      renderCircle={() => (
        <Animated.View style={styles.btnCircleUp}>
          <TouchableOpacity style={styles.button} onPress={openCamera}>
           <Image source={require("../../assets/images/scan-helper.png") } style = {{width:31, height:31}}/>
          </TouchableOpacity>
        </Animated.View>
      )}
      tabBar={renderTabBar}
    >
      <CurvedBottomBarExpo.Screen
        name="index"
        position="LEFT"
        component={IndexScreen}
      />
      <CurvedBottomBarExpo.Screen
        name="Chat"
        position="LEFT"
        component={Chat}
      />
      <CurvedBottomBarExpo.Screen
        name="Favorites"
        position="RIGHT"
        component={Favorites}
      />
      <CurvedBottomBarExpo.Screen
        name="Menu"
        position="RIGHT"
        component={Menu}
      />
    </CurvedBottomBarExpo.Navigator>
  );
}

const styles = StyleSheet.create({
  bottomBar: {},
  shadow: {
    shadowColor: "#DDDDDD",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    bottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
  },
  tabbarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});






















