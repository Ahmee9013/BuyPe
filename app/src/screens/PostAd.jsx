import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { db, auth } from "../../../config/FirebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/action";
import * as Notifications from 'expo-notifications';

function SuccessAlert({ visible, onDismiss }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start(() => {
        setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.in(Easing.ease),
          }).start(() => {
            onDismiss();
          });
        }, 2000);
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
      <Animated.View style={[styles.alertContainer, { opacity }]}>
        <View style={styles.checkCircle}>
          <Feather name="check" size={48} color="white" />
        </View>
        <Text style={styles.alertText}>Done</Text>
      </Animated.View>
    </View>
  );
}

export default function CreateAdScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.contactReducer.user);

  const [priceType, setPriceType] = useState("price");
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [tagText, setTagText] = useState("");
  const [price, setPrice] = useState("");
  const [audience, setAudience] = useState("all");
  const [alertVisible, setAlertVisible] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);

  const isFormValid = images.length > 0 && title && (priceType === "free" || price);
  const numColumns = 3;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && !user) {
        dispatch(setUser({ uid: firebaseUser.uid, email: firebaseUser.email }));
      }
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    openCamera(); // Optional: open camera on mount
  }, []);

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onAlertDismiss = () => {
    setAlertVisible(false);
    navigation.goBack();
  };

  const postAd = async () => {
    if (!isFormValid) return;

    if (!user) {
      alert("You need to login to post ads");
      return;
    }

    setAlertVisible(true);

    try {
      const ad = {
        images,
        title,
        tags,
        priceType,
        price: priceType === "free" ? "0" : price,
        audience,
        uid: user.uid,
        createdAt: Timestamp.now(),
      };

      const adRef = await addDoc(collection(db, "ads"), ad);

      await addDoc(collection(db, "notifications"), {
        userId: "general",
        title: "New Ad Available",
        message: `Check out this new ad: "${title}"`,
        image: images[0],
        timestamp: Timestamp.now(),
        read: false,
        type: "new_ad",
        adId: adRef.id,
        senderId: user.uid,
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Ad Posted",
          body: `Your ad "${title}" has been posted successfully!`,
          data: { adId: adRef.id },
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Error posting ad:", error);
    }
  };

  const getImageGridData = () => {
    let data = ["add", ...images];
    const padding = (numColumns - (data.length % numColumns)) % numColumns;
    return [...data, ...Array(padding).fill("empty")];
  };

  if (!authChecked) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Ad</Text>
          </View>

          <View style={styles.imageList}>
            <FlatList
              data={getImageGridData()}
              numColumns={numColumns}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              renderItem={({ item, index }) => {
                if (item === "add") {
                  return (
                    <TouchableOpacity onPress={() => setImagePickerVisible(true)} style={styles.imageBox}>
                      <Feather name="plus" size={28} color="#999" />
                    </TouchableOpacity>
                  );
                } else if (item === "empty") {
                  return <View style={[styles.imageBox, { backgroundColor: "transparent" }]} />;
                } else {
                  return (
                    <View style={styles.imageWrapper}>
                      <Image source={{ uri: item }} style={styles.image} />
                      <TouchableOpacity onPress={() => removeImage(index - 1)} style={styles.removeButton}>
                        <Text style={styles.removeText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }
              }}
            />
          </View>

          <View style={styles.centerWrapper}>
            <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
            <View style={styles.priceContainer}>
              {priceType === "price" ? (
                <TextInput placeholder="Add Price" style={styles.priceInput} keyboardType="numeric" value={price} onChangeText={setPrice} />
              ) : (
                <Text style={styles.priceInput}>FREE</Text>
              )}
              <View style={styles.inlineToggleWrapper}>
                <TouchableOpacity style={[styles.toggleButton, priceType === "price" && styles.selected]} onPress={() => setPriceType("price")}>
                  <Text style={[styles.buttonText, priceType === "price" && styles.selectedText]}>PRICE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toggleButton, priceType === "free" && styles.selected]} onPress={() => setPriceType("free")}>
                  <Text style={[styles.buttonText, priceType === "free" && styles.selectedText]}>FREE</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Add Tags"
              value={tagText}
              onChangeText={setTagText}
              onSubmitEditing={() => {
                if (tagText.trim()) {
                  setTags([...tags, `#${tagText.trim().toLowerCase()}`]);
                  setTagText("");
                }
              }}
              returnKeyType="done"
            />

            <View style={styles.tagContainer}>
              {tags.map((tag, index) => (
                <TouchableOpacity key={index} style={styles.tag} onPress={() => setTags(tags.filter((_, i) => i !== index))}>
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={postAd}
            disabled={!isFormValid}
            style={[styles.postButton, { opacity: isFormValid ? 1 : 0.5 }]}
          >
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        {imagePickerVisible && (
          <View style={styles.modalOverlay}>
            <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
            <View style={styles.pickerModal}>
              <Text style={styles.pickerTitle}>Select Image</Text>
              <View style={styles.pickerOptions}>
                <TouchableOpacity style={styles.pickerButton} onPress={() => { setImagePickerVisible(false); openCamera(); }}>
                  <Feather name="camera" size={28} color="#000" />
                  <Text style={styles.pickerLabel}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.pickerButton} onPress={() => { setImagePickerVisible(false); pickImageFromGallery(); }}>
                  <Feather name="image" size={28} color="#000" />
                  <Text style={styles.pickerLabel}>Gallery</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setImagePickerVisible(false)} style={styles.cancelButton}>
                <Feather name="x-circle" size={24} color="#ff4444" />
                <Text style={{ color: "#ff4444", marginLeft: 5, fontWeight: "bold" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <SuccessAlert visible={alertVisible} onDismiss={onAlertDismiss} />
      </View>
    </KeyboardAvoidingView>
  );
}




// (Your styles object should still be defined somewhere below this block)



// ✅ Keep your existing styles as they are (not repeated here for brevity)




// --------------------- Styles --------------------- //
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#FFD700",
  },
  pickerModal: {
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 20,
  alignItems: "center",
  marginHorizontal: 40,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  elevation: 10,
},
pickerTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 15,
},
pickerOptions: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  marginBottom: 20,
},
pickerButton: {
  flex: 1,
  alignItems: "center",
  paddingVertical: 10,
},
pickerLabel: {
  marginTop: 5,
  fontSize: 14,
  color: "#333",
},
cancelButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 10,
},

  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  imageList: { paddingHorizontal: 20, marginTop: 10 },
  imageBox: {
    width: 90,
    height: 90,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 5,
  },
  plusText: { fontSize: 30, color: "#999" },
  imageWrapper: { position: "relative", margin: 5 },
  image: { width: 90, height: 90, borderRadius: 10 },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "black",
    borderRadius: 10,
    padding: 3,
  },
  removeText: { color: "white", fontSize: 12 },
  centerWrapper: { marginTop: 10, alignItems: "center" },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 15,
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "flex-start",
    width: "90%",
    marginTop: 5,
    paddingHorizontal: 5,
  },
  tag: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 20,
    paddingHorizontal: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: "#e1e1e1",
  },
  tagText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
  postButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    width: "50%",
    alignSelf: "center",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "#fff",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    marginVertical: 10,
    borderRadius: 25,
    width: "90%",
    justifyContent: "space-between",
  },
  priceInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    paddingVertical: 10,
  },
  inlineToggleWrapper: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 2,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#EDEDED",
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  selected: {
    backgroundColor: "#FFD700",
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  selectedText: {
    color: "#fff",
  },
  audienceToggleContainer: {
    flexDirection: "row",
    marginLeft: 20,
    marginTop: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    padding: 2,
    alignSelf: "flex-start",
  },
  audienceOption: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  audienceSelected: {
    backgroundColor: "#FFD700",
  },
  audienceText: {
    color: "#bbb",
    fontWeight: "bold",
  },
  audienceSelectedText: {
    color: "#fff",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    backgroundColor: "#FFD700",
    borderRadius: 25,
    width: 240,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  checkCircle: {
    backgroundColor: "#000",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  alertText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
});
