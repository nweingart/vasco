import React, { useState } from 'react'
import {View, StyleSheet, Alert, TouchableOpacity, Text} from 'react-native'
import { useAuth } from '../auth/AuthContext'
import AddUserModal from "./AddUserModal";

const Settings = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { logout, handleAccountDeletion } = useAuth()
  const signOut = async () => {
    try {
      await logout()
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Error', 'An error occurred while signing out.');
    }
  };


  const confirmDeleteAccount = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => deleteAccount() }
      ],
      { cancelable: false }
    );
  };

  const deleteAccount = async () => {
    try {
      await handleAccountDeletion();
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the account.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={signOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Add User to Organization</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{...styles.button, backgroundColor: 'red', borderWidth: 0}} onPress={confirmDeleteAccount}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
      <AddUserModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignSelf: 'flex-start',
    marginTop: 100, // Adjust this value as needed to position the header
    marginBottom: 20, // Provide some space below the header
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // This will make the button container use the available space effectively
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    borderWidth: 2,
    borderColor: '#FFC300',
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Settings;

