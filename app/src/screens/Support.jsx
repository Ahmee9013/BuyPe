import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function SupportScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("No Email Exists");
  const [details, setDetails] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    if (details.trim() === "") {
      setErrorMessage("Details are required");
    } else {
      setErrorMessage("");
      alert("Support request submitted! ✅");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* 🔝 Fixed Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            activeOpacity={0.7} // 🆕 Better touch feedback
          >
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Support</Text>
        </View>

        {/* ❓ Yellow Circle with Black Question Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <FontAwesome5 name="question" size={80} color="black" />
          </View>
        </View>

        {/* 📝 Support Title */}
        <Text style={styles.supportText}>Support</Text>

        {/* 📧 Email Input */}
        <TextInput style={styles.input} value={email} editable={false} />

        {/* 🖊 Details Input */}
        <TextInput
          style={[styles.detailsInput, errorMessage ? styles.errorBorder : null]}
          placeholder="Details"
          multiline
          value={details}
          onChangeText={(text) => {
            setDetails(text);
            setErrorMessage("");
          }}
        />

        {/* 🔴 Error Message */}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {/* 🚀 Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: "#fff", paddingBottom: 30 },
  
  // 🔝 Fixed Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    elevation: 4, 
  },

  
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  
  backButton: { 
    position: "absolute", 
    left: 10, 
    padding: 10,  // 🆕 Increases touch area for better usability
  },
  // ❓ Icon Styles
  iconContainer: { alignItems: "center", marginTop: 70, paddingHorizontal: 15 },
  iconCircle: {
    backgroundColor: "#FFD700", 
    width: 130,
    height: 130,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
  },

  // 📝 Support Title
  supportText: { textAlign: "center", fontSize: 18, fontWeight: "bold", color: "#000", marginTop: 10 },

  // 📧 Email Input
  input: { 
    backgroundColor: "#eee", 
    padding: 12, 
    borderRadius: 25, 
    marginTop: 20, 
    fontSize: 16, 
    color: "#555", 
    marginHorizontal: 15,
    height: 50, 
  },

  // 🖊 Details Input
  detailsInput: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    fontSize: 16,
    height: 260,
    textAlignVertical: "top",
    marginHorizontal: 15,
  },

  // 🔴 Error Styling
  errorText: { color: "red", marginTop: 5, fontSize: 14, marginLeft: 15 },
  errorBorder: { borderColor: "red", borderWidth: 1 },

  // 🚀 Submit Button
  submitButton: { 
    backgroundColor: "#FFD700", 
    paddingVertical: 10, 
    paddingHorizontal: 30, 
    borderRadius: 25, 
    alignItems: "center", 
    alignSelf: "center", 
    marginTop: 25, 
  },
  submitText: { fontSize: 16, fontWeight: "bold", color: "black" },
});