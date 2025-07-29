import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/FirebaseConfig";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/action"; 


export default function MenuScreen() {
  const navigation = useNavigation();

  const openWebsite = () => {
    Linking.openURL("https://buype-app.com");
  };


const dispatch = useDispatch(); 

const handleLogout = async () => {
  try {
    await signOut(auth);            
    dispatch(logoutUser());         
    navigation.reset({             
      index: 0,
      routes: [{ name: "Login" }],
    });
  } catch (error) {
    console.error("Error signing out: ", error);
    Alert.alert("Logout Failed", "Something went wrong. Please try again.");
  }
};


  const menuItems = [
    {
      name: "My Profile",
      icon: require("../../assets/images/Profile.png"),
      screen: "Profile",
    },
    {
      name: "Groups",
      icon: require("../../assets/images/Groups.png"),
      screen: "Groups",
    },
    {
      name: "My Ads",
      icon: require("../../assets/images/Ads.png"),
      screen: "MyAds",
    },
    {
      name: "Contacts",
      icon: require("../../assets/images/Contacts.png"),
      screen: "Contacts",
    },
    {
      name: "Settings",
      icon: require("../../assets/images/Settings.png"),
      screen: "Settings",
    },
    {
      name: "Privacy Policy",
      icon: require("../../assets/images/PrivacyPolicy.png"),
      screen: "PrivacyPolicy",
    },
    {
      name: "Website",
      icon: require("../../assets/images/Website.png"),
      action: openWebsite,
    },
    {
      name: "Support",
      icon: require("../../assets/images/support3.png"),
      screen: "Support",
    },
  {
  name: "Logout",
  icon: require("../../assets/images/Logout.png"),
  action: handleLogout,
} 
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      </View>

      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() =>
              item.action ? item.action() : navigation.navigate(item.screen)
            }
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.footer}>
          <Image
            source={require("../../assets/images/buype-icon.png")}
            style={styles.logo}
          />
          <Text style={styles.versionText}>Version 3.2</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#FFD700",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  menuContainer: { marginTop: 10 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 15,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginBottom: 5,
  },
  versionText: {
    color: "#888",
    fontSize: 12,
  },
});
