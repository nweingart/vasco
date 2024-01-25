// AddUserModal.js
import React, { useState } from 'react';
import { Modal, View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../../firebase/Firebase';
import { setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '../auth/AuthContext'

const AddUserModal = ({ modalVisible, setModalVisible }) => {
  const [newUserEmail, setNewUserEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { orgId } = useAuth();

  const sendResetPasswordEmail = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending reset password email:", error);
      Alert.alert("Error", "Failed to send reset password email.");
    }
  };

  const handleAddUserToOrganization = async () => {
    try {
      // Secure temporary password generation
      const temporaryPassword = Math.random().toString(36).slice(-8);

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, newUserEmail, temporaryPassword);
      const user = userCredential.user;

      // Add user to Firestore with inherited orgId and use the same UID
      await setDoc(doc(db, "Users", user.uid), {
        email: newUserEmail,
        firstName,
        lastName,
        orgId,
      });

      // Send password reset email
      await sendResetPasswordEmail(newUserEmail);

      Alert.alert("Success", "New user added to organization successfully.");
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding user to organization:", error);
      Alert.alert("Error", "An error occurred while adding user to organization.");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalView}>
        <TextInput
          placeholder="New User Email"
          autoCapitalize={'none'}
          value={newUserEmail}
          onChangeText={setNewUserEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        <Button title="Add User" onPress={handleAddUserToOrganization} />
        <Button title="Cancel" onPress={() => setModalVisible(false)} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    height: '80%',
    marginTop: '20%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
});

export default AddUserModal;
