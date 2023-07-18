import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Keyboard,
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { setEmailReceipts } from '../redux/redux'

const Settings = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const navigation = useNavigation()
  const dispatch = useDispatch()


  const handleBack = () => {
    if (isEnabled) {
      dispatch(setEmailReceipts(true))
    } else {
      dispatch(setEmailReceipts(false))
    }
    navigation.navigate('Home')
  }



  return (
    <View onAccessibilityEscape={Keyboard.dismiss} style={styles.container}>
      <View style={styles.backButtonWrapper}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back-outline" size='25' color={'black'} />
        </TouchableOpacity>
      </View>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <View style={styles.switchWrapper}>
        <Text style={styles.switchText}>Email Receipts</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    opacity: 0.9,
  },
  backButtonWrapper: {
    marginTop: 75,
    marginBottom: 25,
    marginLeft: 25,
  },
  titleWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  switchWrapper:{
    flexDirection: 'row',
    padding: 20,
    marginHorizontal: 50,
  },
  switchText: {
    fontSize: 20,
    marginHorizontal: 20,
  }
})

export default Settings
