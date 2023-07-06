import React, { useState } from 'react'
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'

const NewDelivery = () => {
  const [notes, setNotes] = useState('')

  const navigation = useNavigation()


  const handleBack = () => {
    navigation.navigate('Home')
  }

  const handleRemoveText = () => {
    setNotes('')
  }

  const navigateToReceipts = () => {
    navigation.navigate('UploadReceipts')
  }

  const navigateToPhotos = () => {
    navigation.navigate('UploadPhotos')
  }


  return (
    <View onAccessibilityEscape={Keyboard.dismiss} style={styles.container}>
      <View style={styles.backButtonWrapper}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back-outline" size='25' color={'black'} />
        </TouchableOpacity>
      </View>
      <View style={styles.imageSectionWrapper}>
        <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', marginLeft: 25 }} onPress={navigateToReceipts}>
          <Text style={{
            marginRight: 5,
            marginLeft: 5,
            marginTop: 5,
            fontSize: 14,
            fontWeight: 'bold',
            fontFamily: 'Avenir'}}>
            Add Receipts
          </Text>
          <Ionicons name="receipt-outline" size='25' color={'black'} />
        </TouchableOpacity>
      </View>
      <View style={styles.imageSectionWrapper}>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', marginLeft: 25 }} onPress={navigateToPhotos}>
            <Text style={{
              marginRight: 5,
              marginLeft: 5,
              marginTop: 5,
              fontSize: 14,
              fontWeight: 'bold',
              fontFamily: 'Avenir'}}>
              Add Photos
            </Text>
            <Ionicons name="image-outline" size='25' color={'black'} />
          </TouchableOpacity>
      </View>
      <View>

      </View>
      <ScrollView style={styles.textSectionWrapper}>
        <Text style={styles.subtitle}>Notes</Text>
        <TouchableOpacity style={styles.clearButton} onPress={() => handleRemoveText()}>
          <Text style={{ color: 'black', fontWeight: 'bold' }}>Clear</Text>
        </TouchableOpacity>
        <View style={styles.textBoxWrapper}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <TextInput
              style={styles.textBox}
              multiline={true}
              placeholder="start typing"
              value={notes}
              onChangeText={text => setNotes(text)}
              autoCapitalize="sentences"
            />
          </TouchableWithoutFeedback>
          <TouchableOpacity style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 50, width: 350, backgroundColor: 'white', borderRadius: 5, marginTop: 100}}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', fontFamily: 'Avenir'}}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gold',
    opacity: 0.9,
  },
  backButtonWrapper: {
    marginTop: 75,
    marginBottom: 25,
    marginLeft: 25,
  },
  imageSectionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 50,
  },
  textSectionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: -25,
    height: 250,
  },
  subtitle: {
    marginTop: 25,
    marginBottom: -30,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    marginLeft: 35,
  },
  textBoxWrapper: {
    marginTop: '10%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    padding: 35,
    paddingRight: 50,
    marginTop: -20,
    paddingTop: 10,
    height: 125,
    width: 350,
    borderRadius: 15,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  clearButton: {
    marginLeft: 35,
    marginTop: 130,
    marginBottom: -130,
    zIndex: 5,
  },
  buttonsWrapper: {
    flexDirection: 'row',
  },
})
export default NewDelivery
