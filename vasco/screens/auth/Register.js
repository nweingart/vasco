import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, TextInput, Image} from 'react-native';
import { auth, db } from '../../firebase/Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import AppIcon from "../../assets/appicon.png";

const Register = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log(`logged in with email ${user.email}`);
        setDoc(doc(db, "users", user.email), {
          email: email,
        }).then(() => {
          console.log("Document successfully written!");
        });
      })
      .catch(error => alert(error.message));
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.navigate("Home");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View>
        <Image style={{ height: 100, width: 100, marginBottom: 100, marginTop: -75 }} source={AppIcon} />
      </View>
      <View style={{ zIndex: 5, marginBottom: 25, marginTop: -75 }}>
        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 24 }}>VASCO</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Company email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry={true}
        />
      </View>
      <View>
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.register}>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.bottomText}>
            Already have an account? Login here
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logoWrapper: {
    position: 'absolute',
    top: '20%',
  },
  inputContainer: {
    width: '80%'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFC300',
    marginBottom: 25
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 175,
    backgroundColor: '#FFC300',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontWeight: 600,
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
  register: {
    marginTop: 50,
  },
  bottomText: {
    fontSize: 14,
    fontWeight: 600
  }
})

export default Register
