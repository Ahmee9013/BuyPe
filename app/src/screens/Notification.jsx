import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../../config/FirebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

// 📦 Push notification dependencies
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// 🛠️ Notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Notification({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const user = useSelector((state) => state.contactReducer.user);

  // ✅ Register for push notifications
  useEffect(() => {
    registerForPushNotifications();

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification received:", notification);
    });

    return () => {
      notificationListener.remove();
    };
  }, []);

  const registerForPushNotifications = async () => {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permission denied', 'Failed to get push token!');
      return;
    }

    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Expo Push Token:", token);
      // 👇 Send this token to your backend if needed
    } catch (error) {
      console.log("Error getting push token:", error);
    }
  };

  // ⏳ Wait for auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  // 🔁 Fetch notifications
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "in", [user.uid, "general"]),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifs = [];

      querySnapshot.forEach((doc) => {
        const notification = { id: doc.id, ...doc.data() };
        if (notification.senderId === user.uid) return;
        notifs.push(notification);
      });

      setNotifications(notifs);
    });

    return unsubscribe;
  }, [user]);

  // 📬 Render individual notification
  const renderNotification = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.notificationImage} />
      )}
      <View style={styles.notificationTextContainer}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>
          {item.timestamp?.toDate
            ? new Date(item.timestamp.toDate()).toLocaleString()
            : ""}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // ⏳ Loading
  if (!authChecked) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  // 🔐 Not logged in
  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#FFD700" barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Notifications</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.noUserContainer}>
          <Text style={styles.noUserText}>
            Please log in to see your notifications.
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ Main screen
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFD700" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// 💅 Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD700",
    padding: 25,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  listContainer: {
    padding: 10,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  notificationMessage: {
    fontSize: 13,
    marginTop: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noUserContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noUserText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: "gray",
    fontSize: 16,
  },
});
