import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../../../config/FirebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/action";
import { doc, getDoc } from "firebase/firestore";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.contactReducer.user);

  useEffect(() => {
    if (user && user.email) {
      console.log("Already logged in:", user.email);
      navigation.replace("tabs");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(setUser({ email: firebaseUser.email }));
        navigation.replace("tabs");
      }
    });

    return unsubscribe;
  }, []);

  const onLogin = async () => {
    if (!email || !password) {
      ToastAndroid.show("Please fill all details", ToastAndroid.BOTTOM);
      Alert.alert("Please fill all details");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;

      const userDocRef = doc(db, "users", loggedInUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        dispatch(setUser({
          uid: loggedInUser.uid,
          email: loggedInUser.email,
          fullName: userData.fullName,
        }));

        navigation.replace("tabs");
      } else {
        Alert.alert("User data not found in Firestore.");
      }

    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Login failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFD700" barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
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

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              placeholder="Enter email"
              placeholderTextColor="#999"
              onChangeText={(value) => setEmail(value)}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder="Enter password"
              placeholderTextColor="#999"
              onChangeText={(value) => setPassword(value)}
            />
          </View>

          <TouchableOpacity
            style={styles.createAccountBtn}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.createAccountBtnText}>Create an account</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.termsText}>
              By signing up, you agree to{" "}
              <Text style={styles.link}>EULA</Text>,{" "}
              <Text style={styles.link}>Terms of Service</Text> and{" "}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>

            <TouchableOpacity style={styles.arrowBtn} onPress={onLogin}>
              <Ionicons name="arrow-forward" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFD700",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 60,
    marginTop: 80,
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
  inputWrapper: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingHorizontal: 15,
    alignItems: "center",
    width: "100%",
    height: 55,
    marginBottom: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 10,
    color: "#000",
  },
  createAccountBtn: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignSelf: "center",
    marginTop: 10,
  },
  createAccountBtnText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: "#333",
    paddingHorizontal: 10,
    marginTop: 60,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
  arrowBtn: {
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
});
