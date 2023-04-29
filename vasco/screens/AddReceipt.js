import React, { useState } from 'react'
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Alert
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import {db, storage, auth} from '../firebase/Firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { addDoc, collection } from 'firebase/firestore'

const AddReceipt = () => {
  const [notes, setNotes] = useState('')
  const [cameraPermission, setCameraPermission] = useState(null);
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');

  const navigation = useNavigation()
  const email = auth.currentUser.email

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
    Alert.alert('Image added', 'Your image has been added to the receipt')
  };

  const uploadImage = async () => {
    if (!image) return;

    const response = await fetch(image);
    const blob = await response.blob();

    const storageRef = ref(storage, `images/${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);


    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.log(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File available at:', downloadURL);
        const date = new Date().toDateString();
        // Reset the image
        setImage('');
        addDoc(collection(db, "receipts"), {
          email: email,
          downloadURL: downloadURL,
          notes: notes,
          timestamp: date
        }).then(() => {
            console.log("Document successfully written!")
            Alert.alert('Receipt added successfully!', 'Your receipt has been added to your history.')
            setNotes('')
          },
        );
      })
  }


  const handleBack = () => {
    navigation.navigate('Home')
  }

  const handleRemoveText = () => {
    setNotes('')
  }


  return (
    <View onAccessibilityEscape={Keyboard.dismiss} style={styles.container}>
      <View style={styles.backButtonWrapper}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back-outline" size='25' color={'black'} />
        </TouchableOpacity>
      </View>
      <View style={styles.imageSectionWrapper}>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', marginLeft: 25 }} onPress={pickImage}>
            <Text style={{
              marginRight: 5,
              marginLeft: 5,
              marginTop: 5,
              fontSize: 14,
              fontWeight: 'bold',
              fontFamily: 'Avenir'}}>
              Add Receipt Photo
            </Text>
            <Ionicons name="image-outline" size='25' color={'black'} />
            <View style={{ marginLeft: 150 }}>
              {image && <Ionicons name="checkmark-circle-outline" size='25' color={'green'} />}
            </View>
          </TouchableOpacity>
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
          <TouchableOpacity onPress={uploadImage} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 50, width: 350, backgroundColor: 'white', borderRadius: 5, marginTop: 100}}>
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
export default AddReceipt
