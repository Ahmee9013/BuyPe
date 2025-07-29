// File: AdDetails.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Modal,
  Pressable,
  UIManager,
  findNodeHandle,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { auth, db } from "../../../config/FirebaseConfig";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

export default function AdDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const ad = route.params?.ad;

  const user = useSelector((state) => state.contactReducer.user);
  const [authChecked, setAuthChecked] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [ownerName, setOwnerName] = useState("Loading...");
  const dotsButtonRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchOwnerName = async () => {
      if (!ad?.uid) return;
      try {
        const userDoc = await getDoc(doc(db, "users", ad.uid));
        if (userDoc.exists()) {
          setOwnerName(userDoc.data().fullName || "Unknown");
        } else {
          setOwnerName("Unknown");
        }
      } catch (error) {
        console.error("Error fetching owner name:", error);
        setOwnerName("Unknown");
      }
    };
    fetchOwnerName();
  }, [ad]);

  useEffect(() => {
    const checkIfFavorited = async () => {
      if (!authChecked || !user || !ad?.id) return;
      try {
        const favRef = doc(db, "favorites", user.uid, "ads", ad.id);
        const docSnap = await getDoc(favRef);
        if (docSnap.exists()) {
          setIsFavorited(true);
        }
      } catch (err) {
        console.log("Error checking favorite:", err);
      }
    };
    checkIfFavorited();
  }, [authChecked, user, ad]);

  const handleFavPress = async () => {
    if (!authChecked) return;
    if (!user) {
      alert("Please login to save favorites.");
      return;
    }

    try {
      const favRef = doc(db, "favorites", user.uid, "ads", ad.id);
      if (isFavorited) {
        await deleteDoc(favRef);
        setIsFavorited(false);
        alert("Removed from Favorites");
      } else {
        await setDoc(favRef, ad);
        setIsFavorited(true);
        alert("Added to Favorites");
      }
    } catch (error) {
      console.error("Favorite toggle error:", error);
      alert("Error while toggling favorite.");
    }
  };

  const handleDotsPress = () => {
    const handle = findNodeHandle(dotsButtonRef.current);
    if (handle) {
      UIManager.measureInWindow(handle, (x, y, w, h) => {
        setModalPosition({
          top: y + h + 5,
          left: x - width * 0.2,
        });
        setShowActionSheet(true);
      });
    }
  };

  const handleEditPress = () => {
    setShowActionSheet(false);
    navigation.navigate("PostAd", { ad });
  };

  const handleDeletePress = async () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this ad permanently?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "ads", ad.id));
            alert("Ad deleted successfully.");
            setShowActionSheet(false);
            navigation.goBack();
          } catch (error) {
            console.error("Error deleting ad:", error);
            alert("Failed to delete ad.");
          }
        },
      },
    ]);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalVisible(true);
  };

  const handleChatPress = () => {
    if (!user) {
      alert("Please login to start chatting.");
      return;
    }

    if (user.uid === ad.uid) {
      alert("You cannot chat with yourself.");
      return;
    }

    const chatRoomId = [user.uid, ad.uid, ad.id].sort().join("-");

    navigation.navigate("Chatscreen", {
      chatRoomId,
      receiverId: ad.uid,
      receiverName: ownerName,
      senderId: user.uid,
      senderName: user.displayName || "User",
      adId: ad.id,
      adTitle: ad.title,
      adImage: ad.images?.[0] || null,
    });
  };

  if (!authChecked) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!ad) {
    return (
      <View style={styles.centered}>
        <Text>No ad details available.</Text>
      </View>
    );
  }

  const renderImage = ({ item }) => (
    <TouchableOpacity onPress={() => handleImageClick(item)}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {Platform.OS === "android" && (
        <StatusBar barStyle="light-content" backgroundColor="#000" />
      )}

      <View style={styles.imageWrapper}>
        <FlatList
          data={ad.images}
          renderItem={renderImage}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.backContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require("../../assets/images/backarrow.png")}
              style={{ width: 24, height: 24, tintColor: "#fff" }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.detailsContainer}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.price}>
              {ad.priceType === "free" ? "FREE" : `Rs. ${ad.price}`}
            </Text>
            <Text style={styles.title}>{ad.title}</Text>
          </View>

          <TouchableOpacity ref={dotsButtonRef} onPress={handleDotsPress}>
            <Image
              source={require("../../assets/images/3dots.png")}
              style={styles.clickImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.ownerRow}>
          <MaterialIcons
            name="person"
            size={24}
            color="#555"
            style={styles.profileIcon}
          />
          <Text style={styles.ownerName}>{ownerName}</Text>
        </View>

        <View style={styles.divider} />

        {ad.tags && ad.tags.length > 0 && (
          <View style={styles.tagContainer}>
            {ad.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.iconRow}>
          <TouchableOpacity onPress={handleFavPress}>
            <Image
              source={
                isFavorited
                  ? require("../../assets/images/fav.png")
                  : require("../../assets/images/inactiveheart.png")
              }
              style={[styles.iconImage, styles.iconSpacing]}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleChatPress}>
            <Image
              source={require("../../assets/images/msg.png")}
              style={styles.iconImage}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={isImageModalVisible}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setIsImageModalVisible(false)}
        />
        <View style={styles.imageModal}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>

      <Modal
        transparent
        visible={showActionSheet}
        animationType="fade"
        onRequestClose={() => setShowActionSheet(false)}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setShowActionSheet(false)}
        />
        <View
          style={[
            styles.actionSheet,
            { top: modalPosition.top, left: modalPosition.left },
          ]}
        >
          <TouchableOpacity style={styles.actionButton} onPress={handleEditPress}>
            <View style={styles.buttonRow}>
              <Image
                source={require("../../assets/images/EditProfile.png")}
                style={styles.iconImage}
              />
              <Text style={{ marginLeft: 8 }}>Edit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDeletePress}>
            <View style={styles.buttonRow}>
              <Image
                source={require("../../assets/images/del.png")}
                style={styles.iconImage}
              />
              <Text style={{ marginLeft: 8 }}>Delete</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.fixedBottomBar}>
        <View style={styles.bottomLeft}>
          <Image
            source={require("../../assets/images/eye.png")}
            style={{
              width: 41,
              height: 25,
              resizeMode: "contain",
              marginRight: 5,
            }}
          />
        </View>
        <Text style={styles.expiryText}>Expires in 25 days</Text>
      </View>
    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  imageWrapper: { height: 460, width, alignSelf: "center", position: "relative" },
  image: { width, height: 460 },
  backContainer: {
    position: "absolute",
    top: Platform.OS === "android" ? (StatusBar.currentHeight || 30) + 10 : 20,
    left: 15,
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  detailsContainer: { paddingHorizontal: 20, marginTop: 10 },
  price: { fontSize: 22, fontWeight: "bold", color: "#000" },
  title: { fontSize: 18, color: "#000", marginTop: 5 },
  clickImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    tintColor: "#333",
  },
  actionSheet: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
    position: "absolute",
  },
  actionButton: { paddingVertical: 8, paddingHorizontal: 10 },
  buttonRow: { flexDirection: "row", alignItems: "center" },
  divider: { height: 1, backgroundColor: "#ccc", marginVertical: 15 },
  ownerRow: { flexDirection: "row", alignItems: "center" },
  profileIcon: { marginRight: 10 },
  ownerName: { fontSize: 16, color: "#444", fontWeight: "500" },
  tagContainer: { flexDirection: "row", flexWrap: "wrap" },
  tag: {
    backgroundColor: "#e0f0ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: { color: "#007bff", fontWeight: "bold" },
  iconRow: { flexDirection: "row", marginTop: 10, alignItems: "center" },
  iconSpacing: { marginRight: 15 },
  iconImage: { width: 24, height: 24, resizeMode: "contain" },
  fixedBottomBar: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomLeft: { flexDirection: "row", alignItems: "center" },
  expiryText: { fontSize: 14, color: "#666" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  imageModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  fullScreenImage: { width: "100%", height: "100%" },
});
