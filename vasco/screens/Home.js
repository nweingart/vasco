import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useNavigation } from "@react-navigation/native"
import { auth } from '../firebase/Firebase'


const Home = () => {
  const navigation = useNavigation()
  const submitted = false
  const user = auth.currentUser

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  if (!user) {
    handleSignOut()
  }

  const handleAddReceipt = () => {
    navigation.navigate("AddReceipt")
  }

  const handleReceiptHistory = () => {
    navigation.navigate("ReceiptHistory")
  }


  return (
    <View style={styles.container}>
      <View style={styles.exitButton}>
        <TouchableOpacity onPress={handleSignOut}>
          <Text>Log Out</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.title}>VASCO.ai</Text>
      </View>
      <View style={styles.linkWrapper}>
        <TouchableOpacity style={styles.linkButtonWrapper} onPress={handleAddReceipt}>
          <Text style={styles.linkButtonText}>
            Add New Receipt
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButtonWrapper} onPress={handleReceiptHistory}>
          <Text style={styles.linkButtonText}>
            See Receipt History
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gold',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginTop: -175
  },
  logoWrapper: {
    position: 'absolute',
    top: '20%',
  },
  exitButton: {
    marginLeft: '75%',
    position: 'absolute',
    top: '10%',
    right: '-2.5%',
  },
  linkWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -125,
  },
  linkButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    height: 50,
    width: 300,
    marginTop: 25,
  },
  linkButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  brandTextWrapper: {
    position: 'absolute',
    bottom: '20%',
  },
  brandText: {
    fontWeight: '600',
    fontSize: 20,
  },
})

export default Home
