import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { ADD_GROUP, UPDATE_GROUPS } from "../redux/action";

const { width } = Dimensions.get("window");

export default function NewGroupScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const allContacts = useSelector((state) => state.contactReducer.contacts || []);
  const allGroups = useSelector((state) => state.contactReducer.groups || []);
  const editingGroup = route?.params?.group || null;

  const [groupName, setGroupName] = useState(editingGroup?.name || "");
  const [searchText, setSearchText] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);

  useEffect(() => {
    setFilteredContacts(allContacts);
  }, [allContacts]);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredContacts(allContacts);
    } else {
      const filtered = allContacts.filter((contact) => {
        const nameMatch = contact.name?.toLowerCase().includes(text.toLowerCase());
        const phoneMatch = contact.phoneNumbers?.[0]?.number.includes(text);
        return nameMatch || phoneMatch;
      });
      setFilteredContacts(filtered);
    }
  };

  const getInitials = (name, number) => {
    if (name) {
      const parts = name.trim().split(" ");
      return parts.map((p) => p[0].toUpperCase()).join("").slice(0, 2);
    }
    return number ? "+9" : ".";
  };

  const toggleSelectContact = (contact) => {
    const isSelected = selectedContacts.some(
      (c) => c.phoneNumbers?.[0]?.number === contact.phoneNumbers?.[0]?.number
    );
    if (!isSelected) {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const removeSelectedContact = (number) => {
    setSelectedContacts((prev) =>
      prev.filter((c) => c.phoneNumbers?.[0]?.number !== number)
    );
  };

  const renderSelectedContacts = () => (
    <View style={styles.selectedContactsContainer}>
      {selectedContacts.map((contact, index) => {
        const initials = getInitials(contact.name, contact.phoneNumbers?.[0]?.number);
        return (
          <View key={index} style={styles.selectedContact}>
            <View style={styles.selectedProfile}>
              <Text style={styles.profileText}>{initials}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeIcon}
              onPress={() => removeSelectedContact(contact.phoneNumbers?.[0]?.number)}
            >
              <Ionicons name="close-circle" size={16} color="black" />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );

  const renderContact = ({ item }) => {
    const number = item.phoneNumbers?.[0]?.number || "";
    const initials = getInitials(item.name, number);
    const isSelected = selectedContacts.some(
      (c) => c.phoneNumbers?.[0]?.number === number
    );

    return (
      <TouchableOpacity onPress={() => toggleSelectContact(item)} disabled={isSelected}>
        <View style={[styles.contactItem, isSelected && styles.blurredContact]}>
          <View style={styles.profileContainer}>
            <Text style={styles.profileText}>{initials}</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{item.name || number}</Text>
            <Text style={styles.contactPhone}>{number}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const createOrUpdateGroup = () => {
    if (editingGroup) {
      // Add members to existing group
      const updatedGroups = allGroups.map((g) => {
        if (g.name === editingGroup.name) {
          const newMembers = selectedContacts.filter(
            (c) =>
              !g.members.some(
                (m) =>
                  (m.phoneNumbers?.[0]?.number || m.name) ===
                  (c.phoneNumbers?.[0]?.number || c.name)
              )
          );
          return { ...g, members: [...g.members, ...newMembers] };
        }
        return g;
      });

      dispatch({ type: UPDATE_GROUPS, payload: updatedGroups });
      navigation.goBack();
    } else {
      if (!groupName.trim() || selectedContacts.length === 0) return;

      const groupExists = allGroups.some((g) => g.name === groupName.trim());
      if (groupExists) {
        alert("Group with this name already exists.");
        return;
      }

      const newGroup = {
        name: groupName.trim(),
        members: selectedContacts,
      };
      dispatch({ type: ADD_GROUP, payload: newGroup });
      navigation.navigate("Groups");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>
            {editingGroup ? "Add Members" : "New Group"}
          </Text>
          <Text style={styles.contactCount}>({allContacts.length} Contacts)</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Group Name Input (only for new group) */}
      {!editingGroup && (
        <View style={styles.roundInputWrapper}>
          <TextInput
            placeholder="Type Group Name"
            value={groupName}
            onChangeText={setGroupName}
            style={styles.input}
            maxLength={30}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
          <Text style={styles.charCount}>{groupName.length}/30</Text>
        </View>
      )}

      {selectedContacts.length > 0 && renderSelectedContacts()}

      {/* Search Input */}
      <View style={styles.roundInputWrapper}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          placeholder="Search"
          style={[styles.input, styles.searchInput]}
          value={searchText}
          onChangeText={handleSearch}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#FFD700" />
      ) : filteredContacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No contacts found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item, index) =>
            item.id || item.phoneNumbers?.[0]?.number || `contact-${index}`
          }
          renderItem={renderContact}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={createOrUpdateGroup}>
        <Ionicons name="arrow-forward" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#FFD700",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitleContainer: { flexDirection: "column", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  contactCount: { fontSize: 12, color: "#444" },
  roundInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    position: "relative",
  },
  input: { fontSize: 16, flex: 1 },
  charCount: {
    position: "absolute",
    right: 20,
    top: 12,
    fontSize: 12,
    color: "#888",
  },
  searchInput: { marginLeft: 10 },
  searchIcon: { width: 20, height: 20 },
  selectedContactsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  selectedContact: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginTop: 10,
  },
  selectedProfile: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
  },
  removeIcon: { marginLeft: -10, marginTop: -5 },
  profileText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    justifyContent: "flex-start",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  blurredContact: { opacity: 0.4 },
  profileContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: "600", color: "#000" },
  contactPhone: { fontSize: 14, color: "#777" },
  emptyContainer: { marginTop: 30, alignItems: "center" },
  emptyText: { fontSize: 16, color: "#999" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#FFD700",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
