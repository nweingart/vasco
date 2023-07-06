import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native'

// firebase imports
import { auth } from '../firebase/Firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'

// navigation imports
import { useNavigation } from '@react-navigation/native'

const Login = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user
        console.log(`logged in with email ${user.email}`)
      })
      .catch(error => alert(error.message))
  }

  const handleRegister = () => {
    navigation.navigate("Register")
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("Home")
      }
    })
    return unsubscribe
  }, [])

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View>
        <Text style={styles.title}>VASCO.io</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry={true}
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.register}>
        <Text onPress={handleRegister}>
          New to Vasco? Create an account here
        </Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gold',
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
    color: 'black',
    marginBottom: 25
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
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
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
    fontWeight: '700',
    fontSize: 14,
  }
})

export default Login
