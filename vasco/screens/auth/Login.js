import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, TextInput, Image } from 'react-native'
import { useAuth } from './AuthContext'
import AppIcon from "../../assets/appicon.png"
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleCreate = () => {
    navigation.navigate('CreateOrganization');
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View>
        <Image style={styles.logo} source={AppIcon} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>VASCO</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Company email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCreate} style={styles.createLink}>
        <Text style={styles.buttonText}>New to Vasco? Create Organization</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  createLink: {
    marginTop: 20,
  }
});

export default Login
