import React, { createContext, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, deleteUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/Firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveUserDetailsAndOrgIdToStorage = async (details, orgIdValue) => {
    try {
      await AsyncStorage.setItem('userDetails', JSON.stringify(details));
      await AsyncStorage.setItem('orgId', JSON.stringify(orgIdValue));
    } catch (error) {
      console.error('Failed to save userDetails or orgId to AsyncStorage:', error);
    }
  };

  useEffect(() => {
    const rehydrateAndAuthenticate = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setAuthToken(token);
          const userDetailsString = await AsyncStorage.getItem('userDetails');
          const orgIdString = await AsyncStorage.getItem('orgId');
          if (userDetailsString) setUserDetails(JSON.parse(userDetailsString));
          if (orgIdString) setOrgId(JSON.parse(orgIdString));

          // Only attempt to fetch user details if there's a current user in Firebase Auth
          const user = auth.currentUser;
          if (user) {
            fetchUserDetails(user.uid);
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error rehydrating auth state:', error);
        setIsLoading(false);
      }
    };

    rehydrateAndAuthenticate();
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      const userDocRef = doc(db, 'Users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserDetails(userData);
        setOrgId(userData.orgId);
        await saveUserDetailsAndOrgIdToStorage(userData, userData.orgId);
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const token = await response.user.getIdToken();
      await AsyncStorage.setItem('authToken', token);
      setAuthToken(token);
      // Ensure userDetails and orgId are fetched and saved within fetchUserDetails
      fetchUserDetails(response.user.uid);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.clear();
      setAuthToken(null);
      setUserDetails(null);
      setOrgId(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAccountDeletion = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
        await logout();
      }
    } catch (error) {
      console.error('Account deletion failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, userDetails, orgId, login, logout, handleAccountDeletion, isLoading }}>
      {isLoading ? <View><Text>Loading...</Text></View> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
