import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Linking,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((prev) => !prev);

  const openWebsite = () => {
    Linking.openURL("https://buype-app.com");
  };

  const menuItems = [
    {
      name: "Website",
      icon: require("../../../assets/images/Website.png"),
      action: openWebsite,
    },
    {
      name: "Privacy policy",
      icon: require("../../../assets/images/PrivacyPolicy.png"),
      screen: "PrivacyPolicy",
    },
    {
      name: "Terms and conditions",
      icon: require("../../../assets/images/TermsandCondition.png"),
      screen: "TermsAndConditions",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() =>
              item.action ? item.action() : navigation.navigate(item.screen)
            }
          >
            <Image source={item.icon} style={styles.iconImage} />
            <Text style={styles.menuText}>{item.name}</Text>
            <Feather name="chevron-right" size={20} color="#777" />
          </TouchableOpacity>
        ))}

        {/* Push Notifications Toggle */}
        <View style={styles.menuItem}>
          <Image source={require("../../../assets/images/notification.png")} style={styles.iconImage} />
          <Text style={styles.menuText}>Push notifications</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#FFC107" }}
            thumbColor={isEnabled ? "#FFF" : "#FFF"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFD700",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
});