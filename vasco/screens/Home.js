import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useNavigation } from "@react-navigation/native"
import { auth } from '../firebase/Firebase'
import AppIcon from '../assets/appicon.png'


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

  const handleNewDelivery = () => {
    navigation.navigate("NewDelivery")
  }

  const handleReceiptHistory = () => {
    navigation.navigate("DeliveryHistory")
  }

  const handleSettings = () => {
    navigation.navigate("Settings")
  }


  return (
    <View style={styles.container}>
      <View style={styles.exitButton}>
        <TouchableOpacity onPress={handleSignOut}>
          <Text>Log Out</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Image style={{ height: 100, width: 100, marginBottom: 100, marginTop: -75 }} source={AppIcon} />
      </View>
      <View style={{ zIndex: 5, marginBottom: 125, marginTop: -75  }}>
        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 24 }}>VASCO</Text>
      </View>
      <View style={styles.linkWrapper}>
        <TouchableOpacity style={styles.linkButtonWrapper} onPress={handleNewDelivery}>
          <Text style={styles.linkButtonText}>
            New Delivery
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButtonWrapper} onPress={handleReceiptHistory}>
          <Text style={styles.linkButtonText}>
            Delivery History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButtonWrapper} onPress={handleSettings}>
          <Text style={styles.linkButtonText}>
            Settings
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
    backgroundColor: 'white',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFC300',
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
    backgroundColor: '#FFC300',
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
