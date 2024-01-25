import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, deleteUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/Firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [orgId, setOrgId] = useState(null);

  useEffect(() => {
    const loadAuthToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setAuthToken(token);
      }
    };

    loadAuthToken();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserDetails(user.uid);
      } else {
        setAuthToken(null);
        setUserDetails(null);
        setOrgId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      const userDocRef = doc(db, 'Users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserDetails(userData);
        setOrgId(userData.orgId);
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const token = await response.user.getIdToken();
      await AsyncStorage.setItem('authToken', token);
      setAuthToken(token);
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
