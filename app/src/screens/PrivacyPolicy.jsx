import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms and conditions</Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Terms and conditions</Text>
            <Text style={styles.subtitle}>Last updated: March 24, 2025</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.text}>
              This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your 
              information when You use the Service and tells You about Your privacy rights and how the law protects You.
            </Text>

            <Text style={styles.text}>
              We use Your Personal data to provide and improve the Service. By using the Service, You agree to the 
              collection and use of information in accordance with this Privacy Policy.
            </Text>

            <Text style={styles.heading}>Interpretation and Definitions</Text>

            <Text style={styles.subHeading}>Interpretation</Text>
            <Text style={styles.text}>
              The words of which the initial letter is capitalized have meanings defined under the following conditions. 
              The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </Text>

            <Text style={styles.subHeading}>Definitions</Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>You</Text> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
            </Text>

            <Text style={styles.text}>
              <Text style={styles.bold}>Company</Text> (referred to as either “the Company”, “We”, “Us” or “Our” in this Agreement) refers to Enkibyte Technologies FZE, 73111, Sharjah Publishing City, Free Zone, Sharjah, UAE.
            </Text>

            <Text style={styles.text}>
              <Text style={styles.bold}>Application</Text> means the software program provided by the Company downloaded by You on any electronic device, named BuyPe.
            </Text>

            <Text style={styles.text}>
              <Text style={styles.bold}>Personal Data</Text> is any information that relates to an identified or identifiable individual.
            </Text>

            <Text style={styles.heading}>Collecting and Using Your Personal Data</Text>

            <Text style={styles.subHeading}>Types of Data Collected</Text>

            <Text style={styles.subHeading}>Personal Data</Text>

            <Text style={styles.text}>
              While using Our Service, We may ask You to provide Us with certain personally identifiable information, such as:
            </Text>

            <Text style={styles.listItem}>• Email address</Text>
            <Text style={styles.listItem}>• First name and last name</Text>
            <Text style={styles.listItem}>• Phone number</Text>
            <Text style={styles.listItem}>• Address, State, Province, ZIP/Postal code, City</Text>
            <Text style={styles.listItem}>• Usage Data</Text>

            <Text style={styles.heading}>Use of Your Personal Data</Text>

            <Text style={styles.text}>
              The Company may use Personal Data for the following purposes:
            </Text>

            <Text style={styles.listItem}>• To provide and maintain our Service</Text>
            <Text style={styles.listItem}>• To manage Your Account</Text>
            <Text style={styles.listItem}>• To contact You</Text>
            <Text style={styles.listItem}>• To manage Your requests</Text>

            <Text style={styles.heading}>Retention of Your Personal Data</Text>

            <Text style={styles.text}>
              The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy.
            </Text>

            <Text style={styles.heading}>Security of Your Personal Data</Text>

            <Text style={styles.text}>
              The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.
            </Text>

            <Text style={styles.heading}>Changes to this Privacy Policy</Text>

            <Text style={styles.text}>
              We may update our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
            </Text>

            <Text style={styles.heading}>Contact Us</Text>
            <Text style={styles.text}>If you have any questions about this Privacy Policy, You can contact us at:</Text>

            <Text style={styles.text}>By visiting our website:</Text>
            <TouchableOpacity onPress={() => Linking.openURL("https://www.BuyPe-app.com")}>
              <Text style={styles.link}>www.BuyPe-app.com</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    paddingVertical: 20,
    paddingHorizontal: 10,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },

  // Scroll View Content
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  // Title Section
  titleContainer: {
    backgroundColor: "#B0BEC5",
    paddingVertical: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },

  // Content Section
  content: {
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    textAlign: "justify",
  },
  listItem: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    marginLeft: 10,
  },

  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});