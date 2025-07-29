// ViewGroupScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteGroupAction, updateGroupsAction } from "../redux/action";

export default function ViewGroupScreen({ route, navigation }) {
  const { group } = route.params;
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.contactReducer.groups);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(group.name);

  useEffect(() => {
    AsyncStorage.setItem("groups", JSON.stringify(groups)).catch((e) =>
      console.error("Failed to save groups", e)
    );
  }, [groups]);

  const deleteGroup = () => {
    Alert.alert("Delete Group", "Are you sure you want to delete this group permanently?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          dispatch(deleteGroupAction(group.name));
          navigation.goBack();
        },
      },
    ]);
  };

  const removeMember = (member) => {
    Alert.alert(
      "Remove Member",
      `Remove ${member.name || member.phoneNumbers?.[0]?.number || "member"} from group?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const updatedGroups = groups.map((g) => {
              if (g.name === group.name) {
                return {
                  ...g,
                  members: g.members.filter(
                    (m) =>
                      (m.phoneNumbers?.[0]?.number || m.name) !==
                      (member.phoneNumbers?.[0]?.number || member.name)
                  ),
                };
              }
              return g;
            });

            dispatch(updateGroupsAction(updatedGroups));
          },
        },
      ]
    );
  };

  const saveEditedGroupName = () => {
    if (!editedName.trim()) return;
    const updatedGroups = groups.map((g) => {
      if (g.name === group.name) {
        return {
          ...g,
          name: editedName.trim(),
        };
      }
      return g;
    });
    dispatch(updateGroupsAction(updatedGroups));
    setIsEditing(false);
  };

  const renderMember = ({ item }) => {
    const initials = item.name
      ? item.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "+";

    const phone = item.phoneNumbers?.[0]?.number || "N/A";

    return (
      <View>
        <View style={styles.memberItem}>
          <View style={styles.profileCircle}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
          <Text style={styles.memberName}>{item.name || phone}</Text>
          <TouchableOpacity onPress={() => removeMember(item)}>
            <Ionicons name="remove-circle" size={24} color="#F44336" />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
      </View>
    );
  };

  const currentGroup = groups.find((g) => g.name === group.name) || group;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFD700" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteGroup}>
          <Ionicons name="trash-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.groupInfo}>
        <View style={styles.groupAvatar}>
          <Ionicons name="people" size={60} color="#ccc" />
        </View>

        <View style={styles.nameRow}>
          {isEditing ? (
            <>
              <TextInput
                value={editedName}
                onChangeText={setEditedName}
                style={styles.editInput}
                autoFocus
                maxLength={30}
                onSubmitEditing={saveEditedGroupName}
              />
              <TouchableOpacity onPress={saveEditedGroupName} style={styles.saveButton}>
                <Ionicons name="checkmark" size={20} color="black" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.groupName}>{currentGroup.name}</Text>
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editIcon}>
                <Image
                  source={require("../../assets/images/edit.png")} 
                  style={styles.editImage}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.addMembersCard}
        onPress={() => navigation.navigate("NewGroup", { group: currentGroup })}
      >
        <View style={styles.addIconCircle}>
          <Ionicons name="person-add" size={20} color="black" />
        </View>
        <Text style={styles.addLabel}>Add Members</Text>
        <Ionicons name="chevron-forward" size={20} color="#aaa" />
      </TouchableOpacity>

      <Text style={styles.membersTitle}>Members</Text>
      <FlatList
        data={currentGroup.members}
        keyExtractor={(item, index) =>
          item.phoneNumbers?.[0]?.number || `member-${index}`
        }
        renderItem={renderMember}
        contentContainerStyle={styles.membersList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#FFD700",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  groupInfo: {
    alignItems: "center",
    paddingVertical: 20,
  },
  groupAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  groupName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  editIcon: {
    marginLeft: 10,
    padding: 5,
  },
  editImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  editInput: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: "#aaa",
    color: "#000",
    padding: 0,
    marginRight: 10,
    minWidth: 120,
  },
  saveButton: {
    padding: 5,
  },
  addMembersCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addIconCircle: {
    backgroundColor: "#FFD700",
    padding: 8,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
    color: "#000",
  },
  membersTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
    color: "#666",
  },
  membersList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  profileCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  initials: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  memberName: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginLeft: 60,
    marginVertical: 4,
  },
});
