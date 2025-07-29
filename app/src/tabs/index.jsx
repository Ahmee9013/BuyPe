import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../../config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useSelector } from "react-redux";

const HomePage = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useSelector((state) => state.contactReducer.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      if (!user || !user.uid) {
        setAds([]);
        return;
      }

      const q = query(
        collection(db, "ads"),
        where("audience", "==", "all"),
        where("uid", "!=", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const adsData = [];
      querySnapshot.forEach((doc) => {
        adsData.push({ id: doc.id, ...doc.data() });
      });
      setAds(adsData);
    } catch (error) {
      console.error("Error fetching ads:", error);
      Alert.alert("Error", "Failed to load ads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authChecked && user?.uid) {
      fetchAds();
    }
  }, [user, authChecked]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", auth.currentUser.uid),
      where("read", "==", false)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setUnreadCount(querySnapshot.size);
    });

    return unsubscribe;
  }, []);

  const handleSearchPress = () => {
    setIsSearching(!isSearching);
    if (isSearching) setSearchQuery("");
  };

  const renderAdItem = ({ item }) => (
    <TouchableOpacity
      style={styles.adItem}
      onPress={() => navigation.navigate("AdDetails", { ad: item })}
    >
      <Image source={{ uri: item.images[0] }} style={styles.adImage} />
    </TouchableOpacity>
  );

  if (!authChecked) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFD700" barStyle="dark-content" translucent={false} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          {isSearching ? (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search ads..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              <TouchableOpacity onPress={handleSearchPress}>
                <Feather name="x" size={22} color="black" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.topBar}>
              <TouchableOpacity onPress={handleSearchPress}>
                <Feather name="search" size={22} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
                <View>
                  <Image
                    source={require("../../assets/images/notification.png")}
                    style={styles.userIcon}
                  />
                  {unreadCount > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>

      <View style={styles.filterBar}>
        <FontAwesome name="sliders" size={20} color="black" />
        <Text style={styles.subHeader}>Latest Ads ({ads.length})</Text>
        <TouchableOpacity
          onPress={() => {
            setSearchQuery("");
            fetchAds(); // 🔁 Refresh ads like app restart
          }}
        >
          <Text style={styles.reset}>Reset</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
      ) : ads.length > 0 ? (
        <FlatList
          data={ads}
          renderItem={renderAdItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.adsContainer}
        />
      ) : (
        <View style={styles.noAdsContainer}>
          <Image
            source={require("../../assets/images/home (2).png")}
            style={styles.noAdsImage}
          />
          <Text style={styles.noAdsSubText}>
            {searchQuery
              ? `No results for "${searchQuery}"`
              : user
              ? "It looks a little empty here. Check back later for new ads!"
              : "Please login to view ads"}
          </Text>
          {!user && (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    backgroundColor: "#FFD700",
  },
  header: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    marginRight: 10,
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  reset: {
    color: "red",
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  adsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  adItem: {
    width: "48%",
    aspectRatio: 1,
    margin: "1%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  adImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  noAdsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noAdsImage: {
    width: 270,
    height: 270,
    resizeMode: "contain",
    marginBottom: 10,
  },
  noAdsSubText: {
    textAlign: "center",
    color: "gray",
    fontSize: 14,
    marginTop: 5,
  },
  userIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
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
  notificationBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default HomePage;
