import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/Firebase';
import { deleteUser } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [orgId, setOrgId] = useState(null);

  useEffect(() => {
    // Check for auth token in AsyncStorage when the app starts
    const loadAuthToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setAuthToken(token);
      }
    };

    loadAuthToken();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, you can get the user token here if needed
      } else {
        // User is signed out
        setAuthToken(null);
        setUserDetails(null);
        setOrgId(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      const userDocRef = doc(db, 'Users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserDetails(userData);
        setOrgId(userData.orgId); // Assuming orgId is a field in your user document
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      // Handle error
    }
  };

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const token = await response.user.getIdToken();
      await AsyncStorage.setItem('authToken', token);
      setAuthToken(token);

      await fetchUserDetails(response.user.uid); // Fetch user details using the user ID

    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error
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
        // Delete the user from Firebase Auth
        await deleteUser(user);

        // Perform logout actions
        await logout();
      }
    } catch (error) {
      console.error('Account deletion failed:', error);
      throw error; // Propagate the error to handle it in the UI component
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, userDetails, orgId, login, logout, handleAccountDeletion }}>
      {children}
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

export default AuthContext
