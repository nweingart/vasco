import React, { useState } from 'react'
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import DatePicker from '../common/DatePicker'
import { useSelector } from "react-redux";
import { setDeliveryReceipts, setDeliveryPhotos, setDeliveryDate, setDeliveryProject, setDeliveryVendor, setDeliveryNotes } from "../redux/redux";
import { db, auth } from "../firebase/Firebase";
import { collection, addDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { getFunctions, httpsCallable } from 'firebase/functions'

const NewDelivery = () => {
  const [notes, setNotes] = useState('')
  const [project, setProject] = useState('')
  const [vendor, setVendor] = useState('')

  const email = auth.currentUser.email
  const functions = getFunctions()
  const deliveryReceipts = useSelector(state => state.deliveryReceipts)
  const deliveryPhotos = useSelector(state => state.deliveryPhotos)
  const deliveryDate = useSelector(state => state.deliveryDate)
  const deliveryProject = useSelector(state => state.deliveryProject)
  const deliveryVendor = useSelector(state => state.deliveryVendor)
  const deliveryNotes = useSelector(state => state.deliveryNotes)

  const addDelivery = async ({
     deliveryReceipts,
     deliveryPhotos,
     deliveryDate,
     deliveryProject,
     deliveryVendor,
     deliveryNotes
  }) => {
    try {
      const docRef = await addDoc(collection(db, 'deliveries'), {
        deliveryReceipts,
        deliveryPhotos,
        deliveryDate,
        deliveryProject,
        deliveryVendor,
        deliveryNotes
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const navigation = useNavigation()
  const dispatch = useDispatch()

  const handleDateConfirm = date => {
    dispatch(setDeliveryDate(date))
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel",
      "Are you sure you want to cancel this delivery",
      [
        {
          text: "No",
          onPress: () => null,
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => navigation.navigate('Home')
        }
      ],
      { cancelable: false }
    );
  }

  const handleSubmit = () => {
    Alert.alert(
      "Submit",
      "Are you sure you want to submit this delivery",
      [
        {
          text: "No",
          onPress: () => null,
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            if (deliveryReceipts && deliveryPhotos && deliveryProject && deliveryVendor && deliveryNotes) {
              addDelivery({
                deliveryReceipts,
                deliveryPhotos,
                deliveryDate,
                deliveryProject,
                deliveryVendor,
                deliveryNotes
              });
              const sendEmail = httpsCallable(functions, 'sendEmail');
              sendEmail({
                email: email,
                deliveryReceipts: deliveryReceipts,
                deliveryPhotos: deliveryPhotos,
                deliveryDate: deliveryDate,
                deliveryProject: deliveryProject,
                deliveryVendor: deliveryVendor,
                deliveryNotes: deliveryNotes
              }).then(result => {
                console.log(result.data)
              })
            } else {
              Alert.alert('Missing Fields', 'Please fill out all fields');
              return;
            }
            Alert.alert('Delivery Submitted', 'Your delivery has been submitted successfully');
            navigation.navigate('Home');
            dispatch(setDeliveryReceipts([]));
            dispatch(setDeliveryPhotos([]));
            dispatch(setDeliveryDate(null));
            dispatch(setDeliveryProject(''));
            dispatch(setDeliveryVendor(''));
            dispatch(setDeliveryNotes(''));
          }
        }
      ],
      { cancelable: false }
    );
  }



  const handleBack = () => {
    navigation.navigate('Home')
  }

  const handleProjectChange = text => {
    setProject(text);
    dispatch(setDeliveryProject(text));
  };

  const handleVendorChange = text => {
    setVendor(text);
    dispatch(setDeliveryVendor(text));
  };

  const handleNotesChange = text => {
    setNotes(text);
    dispatch(setDeliveryNotes(text));
  };

  const navigateToReceipts = () => {
    navigation.navigate('UploadReceipts')
  }

  const navigateToPhotos = () => {
    navigation.navigate('UploadPhotos')
  }


  const RowItem = ({ iconName, text, onPress, valueCount }) => {
    return (
      <ScrollView style={{ borderRadius: 10, borderWidth: 2, borderColor: 'black', marginVertical: 15, marginRight: 25,  backgroundColor: '#FFC300' }}>
        <TouchableOpacity
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 25,
          }}
          onPress={onPress}>
          <View>
            <Ionicons name={iconName} size={25} color={'black'} />
          </View>
          <View>
            <Text style={{ fontWeight: 500, marginTop: 5 }}>{text}</Text>
          </View>
          <View>
            {valueCount > 0 ? <Text style={{ fontWeight: 700, color: 'green', marginTop: 5 }}>{valueCount}</Text> : <Ionicons name="caret-forward-outline" size={25} color={'black'} />}
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
  }



  return (
    <View onAccessibilityEscape={Keyboard.dismiss} style={styles.container}>
      <View style={styles.backButtonWrapper}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back-outline" size='25' color={'black'} />
        </TouchableOpacity>
        <RowItem onPress={navigateToReceipts} iconName={'receipt-outline'} text={'Add Receipts'} valueCount={deliveryReceipts?.length} />
        <RowItem onPress={navigateToPhotos} path={'UploadPhotos'} iconName={'image-outline'} text={'Add Photos'} valueCount={deliveryPhotos?.length} />
        <DatePicker onConfirm={handleDateConfirm}/>
        <View style={styles.textBoxWrapper}>
          <Text style={styles.textBoxText}>Project</Text>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <TextInput
              style={{ ...styles.textBox, height: 50 }}
              multiline={true}
              value={project}
              onChangeText={handleProjectChange}
              autoCapitalize="sentences"
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.textBoxWrapper}>
          <Text style={styles.textBoxText}>Vendor</Text>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <TextInput
              style={{ ...styles.textBox, height: 50 }}
              multiline={true}
              value={vendor}
              onChangeText={handleVendorChange}
              autoCapitalize="sentences"
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.textBoxWrapper}>
          <Text style={styles.textBoxText}>Notes</Text>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <TextInput
              style={ styles.textBox }
              multiline={true}
              value={notes}
              onChangeText={handleNotesChange}
              autoCapitalize="sentences"
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.buttonsWrapper}>
          <TouchableOpacity style={{...styles.button, marginLeft: -15}} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.button, marginLeft: 30}} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
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
  textSectionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 25,
    height: 150,
  },
  textBoxWrapper: {
    marginTop: 15,
    marginRight: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    padding: 35,
    paddingRight: 50,
    paddingTop: 10,
    height: 65,
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
    marginTop: 50,
    marginHorizontal: 20,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFC300',
    padding: 15,
    borderRadius: 10,
    width: 150,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  textBoxText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    marginRight: 250,
  }
})

export default NewDelivery
