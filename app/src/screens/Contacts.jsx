import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import * as Contacts from 'expo-contacts';

import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { setContacts } from '../redux/action';


const ContactPage = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contactReducer.contacts || []);
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [activeTab, setActiveTab] = useState('my');
  const [searchText, setSearchText] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch contacts from device on mount using expo-contacts
    const requestAndFetchContacts = async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
          });
          if (data && data.length > 0) {
            dispatch(setContacts(data));
          } else {
            Alert.alert('No contacts found on device.');
          }
        } else {
          Alert.alert('Permission Denied', 'Cannot access contacts without permission');
        }
      } catch (err) {
        console.warn(err);
        Alert.alert('Error', 'Failed to load contacts.');
      }
    };

    requestAndFetchContacts();
  }, [dispatch]);

  useEffect(() => {
    setFilteredContacts(contacts);
  }, [contacts]);

  const getInitials = (name, number) => {
    if (name) {
      const parts = name.trim().split(' ');
      return parts.map((p) => p[0].toUpperCase()).join('').slice(0, 2);
    }
    return number ? '+9' : '.';
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = contacts.filter((contact) => {
      const nameMatch = contact.name?.toLowerCase().includes(text.toLowerCase());
      const phoneMatch = contact.phoneNumbers?.[0]?.number.includes(text);
      return nameMatch || phoneMatch;
    });
    setFilteredContacts(filtered);
  };

  const handleInvite = async (phoneNumber) => {
    if (loading) return;
    setLoading(true);

    try {
      const message = `Hey, ${phoneNumber}! Come join me on BuyPe: http://onelink.to/s3mfs7`;

      const result = await Share.share({
        message: message,
        title: 'Invite to BuyPe',
      });

      if (result.action === Share.sharedAction) {
        console.log('Shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const savedContacts = filteredContacts.filter((c) => c.name);
  const unsavedContacts = filteredContacts.filter((c) => !c.name);

  const renderItem = ({ item }) => {
    const number = item.phoneNumbers?.[0]?.number || '';
    const initials = getInitials(item.name, number);

    return (
      <View style={styles.contactItem}>
        <View style={styles.profileContainer}>
          <Text style={styles.profileText}>{initials}</Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name || number}</Text>
          <Text style={styles.contactPhone}>{number}</Text>
        </View>
        <TouchableOpacity
          style={[styles.inviteButton, loading && styles.inviteButtonDisabled]}
          onPress={() => handleInvite(number)}
          disabled={loading}
        >
          <Text style={styles.inviteText}>{loading ? 'Sending...' : 'INVITE'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFD700" />

      <View style={[styles.header, searchActive && styles.headerSearchActive]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {!searchActive ? (
          <Text style={styles.headerTitle}>Contacts</Text>
        ) : (
          <TextInput
            style={styles.searchBar}
            autoFocus
            placeholder="Search Contacts"
            value={searchText}
            onChangeText={handleSearch}
          />
        )}

        <TouchableOpacity onPress={() => setSearchActive(!searchActive)}>
          <Ionicons name={searchActive ? 'close' : 'search'} size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.tab, activeTab === 'my' && styles.activeTab]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, { color: '#000' }]}>MY Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.tab, activeTab === 'blocked' && styles.activeTab]}
          onPress={() => setActiveTab('blocked')}
        >
          <Text style={[styles.tabText, { color: '#000' }]}>Blocked Contacts</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'my' ? (
        <FlatList
          data={[...savedContacts, ...unsavedContacts]}
          keyExtractor={(item, index) => item?.id || `contact-${index}`}
          renderItem={renderItem}
          contentContainerStyle={[styles.list, searchActive && { marginTop: 60 }]}
        />
      ) : (
        <View style={styles.emptyBlockedContainer}>
          <Text style={styles.emptyBlockedText}>No blocked contacts</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  headerSearchActive: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    fontSize: 16,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    borderBottomColor: '#ccc',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    backgroundColor: '#F0F0F0',
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FFD700',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  profileContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  contactPhone: {
    fontSize: 14,
    color: '#777',
  },
  inviteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  inviteButtonDisabled: {
    opacity: 0.6,
  },
  inviteText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyBlockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  emptyBlockedText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default ContactPage;
