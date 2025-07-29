import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../config/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// Redux
import { useDispatch } from "react-redux";
import { setUser } from "../redux/action";

export default function OTPScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const onSignUp = async () => {
    if (!fullName || !email || !password) {
      ToastAndroid.show("Please fill all details", ToastAndroid.BOTTOM);
      Alert.alert("Missing Info", "Please fill all fields");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        uid: user.uid,
      });

      dispatch(setUser({
        uid: user.uid,
        fullName: fullName,
        email: email,
      }));

      navigation.navigate("tabs");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        ToastAndroid.show("Email already exists", ToastAndroid.BOTTOM);
        Alert.alert("Email already exists");
      } else {
        ToastAndroid.show("Error: " + error.message, ToastAndroid.BOTTOM);
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../assets/images/logo (3).png")}
              style={styles.logo}
            />
            <Text style={styles.title}>BuyPe</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor="#999"
              secureTextEntry={true}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.arrowBtn} onPress={onSignUp}>
              <Ionicons name="arrow-forward" size={28} color="black" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD700",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 60,
    marginTop: 100,
  },
  logo: {
    width: 240,
    height: 240,
    resizeMode: "contain",
    marginBottom: -120,
    marginRight: 220,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 70,
    marginTop: -90,
  },
  inputContainer: {
    width: "85%",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
    marginTop: 5,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: "#ccc",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 140,
    marginTop: 50,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -80,
  },
  arrowBtn: {
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 30,
  },
});
