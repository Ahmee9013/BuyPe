import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function GroupScreen() {
  const navigation = useNavigation();
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  const groups = useSelector((state) => state?.contactReducer?.groups || []);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderGroup = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ViewGroup", { group: item })}
    >
      <View style={styles.groupInfoWrapper}>
        <View style={styles.groupInfoRow}>
          <View style={styles.groupCircle}>
            <Text style={styles.groupCircleText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.groupName}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../assets/images/back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Groups</Text>
        <View style={styles.rightButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Image
              source={require("../../assets/images/search.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("NewGroup")}
          >
            <Image
              source={require("../../assets/images/plus1.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      )}

      {/* Group List */}
      {filteredGroups.length === 0 ? (
        <View style={styles.placeholderContainer}>
          <Image
            source={require("../../assets/images/Group1.png")}
            style={styles.placeholderImage}
          />
          <TouchableOpacity
            style={styles.createGroupButton}
            onPress={() => navigation.navigate("NewGroup")}
          >
            <Text style={styles.createGroupText}>Create New Group</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredGroups}
          keyExtractor={(item, index) => `group-${index}`}
          renderItem={renderGroup}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    width: "100%",
    height: 90,
    backgroundColor: "#FFD700",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingHorizontal: 15,
  },

  backButton: {
    padding: 5,
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    flex: 1,
  },

  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
  headerIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  searchContainer: {
    backgroundColor: "#FFF9C4",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 25,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 15,
    height: 40,
    fontSize: 16,
  },

  groupInfoWrapper: {
    paddingTop: 20,
    paddingLeft: 0,
    alignItems: "flex-start",
    width: "100%",
  },

  groupInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    padding: 15,
    paddingLeft: 20,
  },

  groupCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  groupCircleText: {
    color: "#000",
    fontSize: 22,
    fontWeight: "bold",
  },

  groupName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    flexShrink: 1,
  },

  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  createGroupButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  createGroupText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
