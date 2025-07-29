import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { db } from "../../../config/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const isFocused = useIsFocused();
  const user = useSelector((state) => state.contactReducer.user); // ✅ Redux user

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.uid) return;

      try {
        const favsRef = collection(db, "favorites", user.uid, "ads");
        const querySnapshot = await getDocs(favsRef);

        const favList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFavorites(favList);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };

    if (isFocused) {
      fetchFavorites();
    }
  }, [isFocused, user]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.adItem}
      onPress={() => navigation.navigate("AdDetails", { ad: item })}
    >
      {item.images?.[0] && (
        <Image source={{ uri: item.images[0] }} style={styles.image} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Favorites</Text>
          <View style={{ width: 24 }} />
        </View>

        {!user ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Please login to view your favorites.</Text>
          </View>
        ) : favorites.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No favorites yet.</Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            key={"2-cols"}
            numColumns={2}
            contentContainerStyle={{ padding: 10 }}
            columnWrapperStyle={{ justifyContent: "space-between" }}
          />
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
  adItem: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#aaa",
    fontSize: 16,
  },
});
