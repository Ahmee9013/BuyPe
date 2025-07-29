import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
  Dimensions,
} from "react-native";
import { db } from "../../../config/FirebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  query,
  addDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import { Ionicons, Entypo } from "@expo/vector-icons";

export default function ChatScreen() {
  const route = useRoute();
  const {
    receiverId,
    receiverName,
    adId,
    adTitle,
    senderId,
    senderName,
  } = route.params;

  const reduxUser = useSelector((state) => state.contactReducer.user);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const keyboardHeightAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const chatRoomId = [senderId, receiverId, adId].sort().join("-");

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      Animated.timing(keyboardHeightAnim, {
        toValue: e.endCoordinates.height,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
      Animated.timing(keyboardHeightAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!chatRoomId || !reduxUser?.uid) return;

    const messagesRef = collection(db, "chats", chatRoomId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatRoomId, reduxUser?.uid]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, keyboardHeight]);

  const handleSend = async () => {
    if (newMessage.trim() === "" || !reduxUser || sending) return;

    setSending(true);

    try {
      const messagesRef = collection(db, "chats", chatRoomId, "messages");

      await addDoc(messagesRef, {
        text: newMessage,
        senderId: reduxUser.uid,
        timestamp: serverTimestamp(),
        adId,
      });

      const chatRoomRef = doc(db, "chats", chatRoomId);
      const chatRoomSnap = await getDoc(chatRoomRef);

      if (!chatRoomSnap.exists()) {
        await setDoc(chatRoomRef, {
          participants: [senderId, receiverId],
          participantNames: {
            [senderId]: senderName,
            [receiverId]: receiverName,
          },
          lastMessage: newMessage,
          lastMessageTime: serverTimestamp(),
          adId,
          adTitle,
        });
      } else {
        await setDoc(
          chatRoomRef,
          {
            lastMessage: newMessage,
            lastMessageTime: serverTimestamp(),
          },
          { merge: true }
        );
      }

      setNewMessage("");
      Keyboard.dismiss();
    } catch (error) {
      console.error("Send error:", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === reduxUser?.uid;

    return (
      <View
        style={[
          styles.messageRow,
          { justifyContent: isCurrentUser ? "flex-end" : "flex-start" },
        ]}
      >
        {!isCurrentUser && (
          <Ionicons
            name="person-circle"
            size={32}
            color="#000"
            style={styles.avatarIcon}
          />
        )}

        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.outgoingBubble : styles.incomingBubble,
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timeText}>
            {item.timestamp?.toDate()?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        {isCurrentUser && (
          <Ionicons
            name="person-circle"
            size={32}
            color="#000"
            style={styles.avatarIcon}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons 
          name="person-circle" 
          size={40} 
          color="#000" 
          style={{ marginRight: 10 }} 
        />
        <View>
          <Text style={styles.headerName}>{receiverName}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
        <View style={{ marginLeft: "auto" }}>
          <Entypo name="dots-three-vertical" size={20} color="#000" />
        </View>
      </View>

      {/* Main Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.contentContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Messages List */}
        <View style={styles.messageListContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Input Container */}
        <Animated.View 
          style={[
            styles.inputContainer,
            {
              paddingBottom: keyboardHeightAnim.interpolate({
                inputRange: [0, 300],
                outputRange: [10, 20],
              }),
            }
          ]}
        >
          <View style={styles.inputRow}>
            <TouchableOpacity>
              <Ionicons name="happy-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type here"
              placeholderTextColor="#666"
              multiline
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
            <TouchableOpacity>
              <Ionicons name="mic" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSend} disabled={!newMessage.trim()}>
              <Ionicons 
                name="send" 
                size={24} 
                color={newMessage.trim() ? "#000" : "#666"} 
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFE0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingTop: 30,
    backgroundColor: "#FEE12B",
    borderBottomWidth: 1,
    borderBottomColor: "#E5C100",
  },
  contentContainer: {
    flex: 1,
  },
  messageListContainer: {
    flex: 1,
    paddingBottom: 10,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  headerStatus: {
    fontSize: 12,
    color: "#333",
  },
  messageList: {
    padding: 15,
    paddingBottom: 10,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 15,
  },
  avatarIcon: {
    marginHorizontal: 5,
  },
  messageBubble: {
    maxWidth: "70%",
    borderRadius: 16,
    padding: 12,
    paddingBottom: 8,
  },
  incomingBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  outgoingBubble: {
    backgroundColor: "#FEE12B",
    borderBottomRightRadius: 4,
  },
  messageText: {
    color: "#000",
    fontSize: 15,
  },
  timeText: {
    fontSize: 10,
    color: "#333",
    marginTop: 4,
    textAlign: "right",
  },
  inputContainer: {
    backgroundColor: "#FEE12B",
    padding: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5C100",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 10 : 5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    marginHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 5 : 0,
  },
});