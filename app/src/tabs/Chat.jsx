import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig";
import { useSelector } from "react-redux";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure notifications handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Set notification channel for Android
async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('messages', {
      name: 'Messages',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }
}

export default function ChatListScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.contactReducer.user);
  const [userNames, setUserNames] = useState({});
  const [expoPushToken, setExpoPushToken] = useState('');
  const [lastNotificationTime, setLastNotificationTime] = useState(new Date());

  // Setup notification channel on component mount
  useEffect(() => {
    setupNotificationChannel();
  }, []);

  // Register for push notifications
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const { chatId, receiverId, adId } = response.notification.request.content.data;
      if (chatId && receiverId) {
        navigation.navigate("Chatscreen", {
          chatId,
          receiverId,
          adId,
        });
      }
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  // Fetch chat data and handle new messages
  useEffect(() => {
    if (!currentUser?.uid) return;

    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", currentUser.uid));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedNames = { ...userNames };
      const newChats = [];
      const now = new Date();

      for (const docSnapshot of snapshot.docs) {
        const chatData = docSnapshot.data();
        const lastMessageTime = chatData.lastMessageTime?.toDate();
        
        const isNew = chatData.lastMessageSender !== currentUser.uid && 
                     !docSnapshot.metadata.hasPendingWrites &&
                     (!lastNotificationTime || lastMessageTime > lastNotificationTime);

        const chatItem = {
          id: docSnapshot.id,
          ...chatData,
          isNew,
          lastMessageTime: lastMessageTime
        };

        // Get other participant details
        const otherId = chatData.participants.find(id => id !== currentUser.uid);
        if (otherId && !fetchedNames[otherId]) {
          try {
            const userDoc = await getDoc(doc(db, "users", otherId));
            fetchedNames[otherId] = userDoc.exists() ? 
              (userDoc.data().fullName || "Unknown") : "Unknown";
          } catch (error) {
            console.error("Error fetching user:", error);
            fetchedNames[otherId] = "Unknown";
          }
        }

        newChats.push(chatItem);

        // Show notification for new messages
        if (isNew && chatData.lastMessage && chatData.lastMessageSender !== currentUser.uid) {
          const senderName = fetchedNames[chatData.lastMessageSender] || "Someone";
          await showMessageNotification(
            senderName,
            chatData.lastMessage,
            {
              chatId: docSnapshot.id,
              receiverId: otherId,
              adId: chatData.adId
            }
          );
          setLastNotificationTime(now);
        }
      }

      setUserNames(fetchedNames);
      
      // Sort chats by last message time (newest first)
      const sortedChats = newChats.sort((a, b) => {
        const timeA = a.lastMessageTime?.getTime() || 0;
        const timeB = b.lastMessageTime?.getTime() || 0;
        return timeB - timeA;
      });

      setChats(sortedChats);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching chats:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser?.uid, lastNotificationTime]);

  async function registerForPushNotificationsAsync() {
    try {
      if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return null;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'your-expo-project-id',
      })).data;

      console.log('Push token:', token);
      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  async function showMessageNotification(senderName, message, data) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `New message from ${senderName}`,
          body: message,
          data: data,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          channelId: 'messages',
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing message notification:', error);
    }
  }

  const formatTime = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const renderChatItem = ({ item }) => {
    const otherParticipantId = item.participants.find(id => id !== currentUser.uid);
    const otherParticipantName = userNames[otherParticipantId] || "Loading...";

    return (
      <TouchableOpacity
        style={[styles.chatItem, item.isNew && styles.unreadChatItem]}
        onPress={() => {
          navigation.navigate("Chatscreen", {
            chatId: item.id,
            receiverId: otherParticipantId,
            receiverName: otherParticipantName,
            adId: item.adId,
            adTitle: item.adTitle,
            adImage: item.adImage,
            senderId: currentUser.uid,
            senderName: currentUser.displayName || "User",
          });
        }}
      >
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: item.adImage || 'https://via.placeholder.com/50' }} 
            style={styles.avatar} 
          />
        </View>
        
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <View style={styles.nameContainer}>
              <Text style={styles.chatName}>{otherParticipantName}</Text>
              {item.isNew && (
                <View style={styles.newMessageContainer}>
                  <Text style={styles.newMessageText}>New Message</Text>
                </View>
              )}
            </View>
            <Text style={styles.chatTime}>{formatTime(item.lastMessageTime)}</Text>
          </View>
          
          <Text 
            style={[styles.lastMessage, item.isNew && styles.unreadMessage]}
            numberOfLines={1}
          >
            {item.lastMessage || "No messages yet"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      ) : chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No chats yet</Text>
          <Text style={styles.emptySubText}>
            Start a chat by messaging a seller about their ad
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    padding: 16,
    backgroundColor: "#FFD700",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  listContainer: {
    padding: 8,
  },
  chatItem: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unreadChatItem: {
    backgroundColor: "#fff9e6",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  newMessageContainer: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newMessageText: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
  },
  chatTime: {
    fontSize: 12,
    color: "#999",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  unreadMessage: {
    fontWeight: "600",
    color: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});