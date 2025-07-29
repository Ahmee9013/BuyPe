import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export default function ProfileScreen({ navigation }) {
  const user = useSelector((state) => state.contactReducer.user);
  const fullName = user?.fullName || "USER";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.side}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.center}>
            <Text style={styles.headerTitle}>My Profile</Text>
          </View>

          {/* Right side for symmetry */}
          <View style={styles.side} />
        </View>

        {/* Profile Info */}
        <View style={styles.profileContainer}>
          <View style={styles.profileIconContainer}>
            <Ionicons name="person-circle-outline" size={100} color="gray" />
          </View>
          <Text style={styles.profileName}>{fullName}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Image
              source={require("../../../assets/images/EditProfile.png")}
              style={styles.iconImage}
            />
            <Text style={styles.optionText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <Image
              source={require("../../../assets/images/Password (2).png")}
              style={styles.iconImage}
            />
            <Text style={styles.optionText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("DeleteAccount")}
          >
            <Image
              source={require("../../../assets/images/Delete.png")}
              style={styles.iconImage}
            />
            <Text style={styles.optionText}>Delete Account</Text>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: "space-between",
    backgroundColor: "#FFD700",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  side: {
    width: 40,
    alignItems: "flex-start",
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  optionsContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  iconImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
});
