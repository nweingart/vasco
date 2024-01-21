import React, { useState } from 'react';
import {View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image} from 'react-native';
import { db, auth } from '../../firebase/Firebase';
import { collection, addDoc } from 'firebase/firestore';
import AppIcon from "../../assets/appicon.png";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from './AuthContext';
import { useNavigation} from "@react-navigation/native";

const CreateOrganization = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth()
  const navigation = useNavigation();

  const handleCreateOrganization = async () => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create organization in Firestore
      const orgDocRef = await addDoc(collection(db, "Organizations"), { name: companyName });

      // Create user in Firestore with orgId
      await addDoc(collection(db, "Users"), {
        firstName,
        lastName,
        email,
        orgId: orgDocRef.id,
      });

      // Log the user in (update AuthContext state if necessary)
      await login(email, password);

      Alert.alert("Success", "Organization and User created successfully.");
    } catch (error) {
      console.error("Error creating organization or user:", error);
      Alert.alert("Error", "An error occurred while creating organization or user.");
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.logo} source={AppIcon} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>VASCO</Text>
      </View>
      <View style={styles.inputContainer}>
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
        <TextInput
          placeholder="Company Name"
          value={companyName}
          onChangeText={setCompanyName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          autoCapitalize={'none'}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          autoCapitalize={'none'}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleCreateOrganization}>
        <Text style={styles.buttonText}>Create Organization</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogin} style={styles.loginLink}>
        <Text style={styles.buttonText}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    height: 100,
    width: 100,
    marginBottom: 100,
    marginTop: -75
  },
  titleContainer: {
    zIndex: 5,
    marginBottom: 25,
    marginTop: -75
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 24
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    color: 'black',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#FFC300',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
  }
});

export default CreateOrganization;
