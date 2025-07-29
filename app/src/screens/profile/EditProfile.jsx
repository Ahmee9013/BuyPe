import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, 
  Platform, ScrollView 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather, FontAwesome } from "@expo/vector-icons";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <View style={styles.container}>
  
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

    
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.profileContainer}>
          <View style={styles.profileImageWrapper}>
            <FontAwesome name="user-circle" size={100} color="#ccc" />
            <TouchableOpacity style={styles.editIcon}>
              <Feather name="edit" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>


        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />


        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },


  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: "100%",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 50,
    position: "absolute",
    top: 0,
    zIndex: 1000,
  },
  backButton: { position: "absolute", left: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000", textAlign: "center" },


  scrollContainer: { 
    flexGrow: 1, 
    alignItems: "center", 
    paddingTop: 100, 
    paddingBottom: 50, 
    paddingHorizontal: 20
  },

  profileContainer: { alignItems: "center" },
  profileImageWrapper: { position: "relative" },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 5,
    elevation: 3,
  },

  input: {
    width: "100%",
    backgroundColor: "#F1F1F1",
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    fontSize: 16,
  },

  saveButton: {
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { fontSize: 16, fontWeight: "bold", color: "#000" },
});