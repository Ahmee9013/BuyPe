import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../../config/FirebaseConfig";
import { useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";

export default function ProfileScreen({ navigation }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const user = useSelector(state => state.contactReducer.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchMyAds = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          setAds([]);
          return;
        }
        
        const q = query(
          collection(db, "ads"),
          where("uid", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const adsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAds(adsList);
      } catch (error) {
        console.error("Failed to fetch ads:", error);
        Alert.alert("Error", "Failed to load your ads. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (authChecked) {
      fetchMyAds();
    }
  }, [user, authChecked]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.adItem}
      onPress={() => navigation.navigate("AdDetails", { ad: item })}
    >
      {item.images?.[0] ? (
        <Image source={{ uri: item.images[0] }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text>No Image</Text>
        </View>
      )}
      {/* Title and Price removed */}
    </TouchableOpacity>
  );

  if (!authChecked) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Ads</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.noAdsContainer}>
            <Text style={styles.noAdsSubText}>
              Please login to view your ads
            </Text>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Ads</Text>
          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
        ) : ads.length > 0 ? (
          <FlatList
            data={ads}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.adsContainer}
            columnWrapperStyle={{ justifyContent: "space-between" }}
          />
        ) : (
          <View style={styles.noAdsContainer}>
            <Text style={styles.noAdsSubText}>
              You haven't posted any ads yet. Tap the + button to create one!
            </Text>
          </View>
        )}
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
  loginButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFD700",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  adsContainer: {
    padding: 10,
  },
  adItem: {
    width: "48%",
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  placeholder: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
  },
  noAdsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noAdsSubText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
  },
});
