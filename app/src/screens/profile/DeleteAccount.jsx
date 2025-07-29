import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DeleteAccount({ navigation }) {
  const handleDelete = () => {
    // Add your delete logic here
    console.log("Account Deleted");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFD700" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Delete Account</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Image
          source={require("../../../assets/images/DeleteAccount.png")} 
          style={styles.image}
        />

     

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete My Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 60,
    backgroundColor: "#FFD700",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    elevation: 4,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 266,
    height: 340,
    resizeMode: "contain",
    marginBottom: 20,
  },
  
  deleteButton: {
    borderColor: "#FF0000",
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#fff",
  },
  deleteButtonText: {
    color: "#FF0000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
