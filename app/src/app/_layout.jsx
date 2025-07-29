import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store';

// Auth Screens
import SplashScreen from '../screens/SplashScreen';
import Login from '../auth/Login';
import SignUp from '../auth/SignUp';

// Tab Navigator
import Tabs from '../tabs/_layout';

// Profile Screens
import Profile from '../screens/profile/MyProfile';
import EditProfile from '../screens/profile/EditProfile';
import ChangePassword from '../screens/profile/ChangePassword';
import DeleteAccount from '../screens/profile/DeleteAccount';

// Other Screens
import Groups from '../screens/Groups';
import NewGroup from '../screens/NewGroup';
import MyAds from '../screens/MyAds';
import PostAd from '../screens/PostAd';
import AdDetails from '../screens/AdDetails';
import Contacts from '../screens/Contacts';
import Notification from '../screens/Notification';
import Settings from '../screens/settings/settings';
import TermsAndConditions from '../screens/settings/TermsAndCondition';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import Support from '../screens/Support';
import ViewGroupScreen from '../screens/ViewGroup';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
        null
        }
        persistor={persistor}
      >
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          {/* Auth Flow */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />

          {/* Tabs */}
          <Stack.Screen name="tabs" component={Tabs} />

          {/* Profile */}
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="DeleteAccount" component={DeleteAccount} />

          {/* Groups & Ads */}
          <Stack.Screen name="Groups" component={Groups} />
          <Stack.Screen name="NewGroup" component={NewGroup} />
          <Stack.Screen name="ViewGroup" component={ViewGroupScreen} />
          <Stack.Screen name="MyAds" component={MyAds} />
          <Stack.Screen name="PostAd" component={PostAd} />
          <Stack.Screen name="AdDetails" component={AdDetails} />

          {/* Miscellaneous */}
          <Stack.Screen name="Contacts" component={Contacts} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          <Stack.Screen name="Support" component={Support} />
          <Stack.Screen name='Chatscreen' component={ChatScreen} />
        </Stack.Navigator>
      </PersistGate>
    </Provider>
  );
}
