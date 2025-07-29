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

export default function TermsAndConditionsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms and Conditions</Text>
        </View>

        {/* Scrollable Terms */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Terms and Conditions</Text>
            <Text style={styles.subtitle}>Last updated: May 17, 2022</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.heading}>Interpretation and Definitions</Text>
            <Text style={styles.subHeading}>Interpretation</Text>
            <Text style={styles.text}>
              The words with capitalized initial letters have defined meanings. These definitions apply equally whether singular or plural.
            </Text>

            <Text style={styles.subHeading}>Definitions</Text>
            <Text style={styles.listItem}>• <Text style={styles.bold}>Application:</Text> BuyPe mobile app.</Text>
            <Text style={styles.listItem}>• <Text style={styles.bold}>Company:</Text> Enkibyte Technologies FZE, UAE.</Text>
            <Text style={styles.listItem}>• <Text style={styles.bold}>Service:</Text> The BuyPe mobile application.</Text>
            <Text style={styles.listItem}>• <Text style={styles.bold}>You:</Text> The user of the Service.</Text>

            <Text style={styles.heading}>Acknowledgement</Text>
            <Text style={styles.text}>
              By using the Service, You agree to these Terms and our Privacy Policy. If you are under 18, you may not use this Service.
            </Text>

            <Text style={styles.heading}>Third-party Links</Text>
            <Text style={styles.text}>
              Our Service may contain links to third-party services not owned by the Company. We are not responsible for their content or privacy practices.
            </Text>

            <Text style={styles.heading}>Termination</Text>
            <Text style={styles.text}>
              We may terminate or suspend your access without notice if you violate these Terms.
            </Text>

            <Text style={styles.heading}>Limitation of Liability</Text>
            <Text style={styles.text}>
              Our liability is limited to the amount paid by you or USD 100, whichever is less. We are not liable for indirect damages.
            </Text>

            <Text style={styles.heading}>Contact Us</Text>
            <Text style={styles.text}>
              For questions, visit our website:
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL("https://buype-app.com/terms-and-conditions-app/")}>
              <Text style={styles.link}>https://buype-app.com/terms-and-conditions-app/</Text>
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
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
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
    marginTop: 5,
  },
});
