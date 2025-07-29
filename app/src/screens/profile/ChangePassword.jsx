import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureNewPassword, setSecureNewPassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  const handleSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("All fields are required!");
    } else if (newPassword !== confirmPassword) {
      alert("New Password and Confirm Password must match!");
    } else {
      alert("Password Changed Successfully! ✅");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
      
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Change Password</Text>
          </View>

          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Image
                source={require("../../../assets/images/Password.png")}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="New Password "
              secureTextEntry={secureNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setSecureNewPassword(!secureNewPassword)}>
              <Entypo name={secureNewPassword ? "eye" : "eye-with-line"} size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              secureTextEntry={secureConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setSecureConfirmPassword(!secureConfirmPassword)}>
              <Entypo name={secureConfirmPassword ? "eye" : "eye-with-line"} size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Change Password</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingBottom: 30,
  },

  // 🔝 Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: "100%",
    position: "relative",
  },
  backButton: {
    padding: 10,
    position: "absolute",
    left: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },

  iconContainer: {
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 15,
  },
  iconCircle: {
    backgroundColor: "#FFD700",
    width: 130,
    height: 130,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
  },

  input: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 25,
    marginTop: 40,
    fontSize: 16,
    color: "#555",
    marginHorizontal: 15,
    height: 60,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    paddingHorizontal: 15,
    borderRadius: 25,
    marginTop: 15,
    marginHorizontal: 15,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },

  submitButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 50,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});