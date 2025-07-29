import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, StatusBar, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login"); 
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);
  

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFD600" barStyle="dark-content" />

      <Image
        source={require("../../assets/images/logo (3).png")} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>BuyPe</Text>
      <Text style={styles.subtitle}>A Friendly Store</Text>

      <ActivityIndicator size="large" color="#000" style={styles.loader} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>From</Text>
        <Text style={styles.footerText}>Enkibyte</Text>
        <Text style={styles.footerText}>3.x.x</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD600", 
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: -52,
    marginLeft: -40,
    marginRight: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginTop: -120,
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20, 
  },
  loader: {
    marginTop: 30,
  },
  footer: {
    position: "absolute", 
    bottom: 40,
    alignItems: "center",
  },
  footerText: {
    color: "#333",
    fontSize: 14,
  },
});