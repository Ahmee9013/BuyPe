// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   PermissionsAndroid,
//   Platform,
//   Alert,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Contacts from 'react-native-contacts';
// import { useDispatch } from 'react-redux';
// import { setContacts } from '../../redux/action';

// const imageData = [];

// const Home = (props) => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     requestContactPermission();
//   }, []);

//   const requestContactPermission = async () => {
//     try {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
//           {
//             title: 'Contacts Permission',
//             message: 'This app would like to view your contacts.',
//             buttonPositive: 'OK',
//           }
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           loadContacts();
//         } else {
//           Alert.alert('Permission Denied', 'Cannot access contacts without permission');
//         }
//       } else {
//         loadContacts();
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   };

//   const loadContacts = () => {
//     Contacts.getAll()
//   .then((contacts) => {
//     dispatch(setContacts(contacts));
//   })

//       .catch((e) => {
//         console.log('Error loading contacts', e);
//       });
//   };


//   return (
//     <View style={styles.container}>
//       {/* HEADER CONTAINER */}
//       <View style={styles.header}>
//         <Ionicons name='search-outline' size={21} />
//         <TouchableOpacity onPress={() => props.navigation.navigate('Notification')}>
//           <Ionicons name='notifications-outline' size={21} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.body}>
//         {/* SMALL CONTAINER */}
//         <View style={styles.smallcontainer}>
//           <Image source={require('../../assets/images/RepeatIcon.png')} style={styles.icon} />
//           <Text style={styles.Text1}>Latest Ads</Text>
//           <Text style={styles.Text2}> (8)</Text>
//           <Text style={styles.Text3}>Reset</Text>
//         </View>

//         <View>
//           <FlatList
//             numColumns={2}
//             data={imageData}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <View style={styles.imagecontainer}>
//                 <Image source={item.image} style={styles.image} />
//               </View>
//             )}
//             ListEmptyComponent={
//               <View style={{ alignItems: 'center', margin: '50%' }}>
//                 <Image source={require('../../assets/images/default.png')} />
//               </View>
//             }
//           />
//         </View>
//       </View>
//     </View>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     height: 60,
//     backgroundColor: '#FFD700',
//     elevation: 5,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 20,
//   },
//   body: {
//     flex: 1,
//     padding: 2,
//   },
//   smallcontainer: {
//     height: 30,
//     flexDirection: 'row',
//     padding: 5,
//     margin: 10,
//   },
//   icon: {
//     width: 26,
//     height: 26,
//   },
//   Text1: {
//     fontSize: 14,
//     fontWeight: '500',
//     lineHeight: 30,
//     marginLeft: 10,
//   },
//   Text2: {
//     fontSize: 12,
//     fontWeight: '400',
//     lineHeight: 30,
//     color: 'grey',
//   },
//   Text3: {
//     color: 'red',
//     lineHeight: 30,
//     marginLeft: 185,
//   },
//   imagecontainer: {
//     flex: 1,
//   },
//   image: {
//     width: 193,
//     height: 195,
//     resizeMode: 'cover',
//     marginBottom: -7,
//   },
//   contactHeader: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginLeft: 10,
//     marginBottom: 5,
//   },
//   contactCard: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderBottomWidth: 0.5,
//     borderColor: '#ccc',
//   },
//   contactName: {
//     fontWeight: 'bold',
//     color: 'black',
//   },
//   contactNumber: {
//     color: '#666',
//   },
// });