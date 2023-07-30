import React, { useState } from 'react'

// ui imports
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native'
import RowItem from './RowItem'
import Ionicons from '@expo/vector-icons/Ionicons'
import DatePicker from '../../common/DatePicker'

// navigation imports
import { useNavigation } from '@react-navigation/native'

// redux imports
import { useSelector } from 'react-redux'
import {
  setDeliveryReceipts,
  setDeliveryPhotos,
  setDeliveryDate,
  setDeliveryProject,
  setDeliveryVendor,
  setDeliveryNotes,
  setDeliveryStatus,
} from '../../redux/redux'
import { useDispatch } from 'react-redux'

// firebase imports
import { db, auth } from '../../firebase/Firebase'
import { collection, addDoc } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'

const NewDelivery = () => {
  const [notes, setNotes] = useState('')
  const [project, setProject] = useState('')
  const [vendor, setVendor] = useState('')
  const [status, setStatus] = useState('Not Approved')
  const [showInformation, setShowInformation] = useState(false)

  const email = auth.currentUser.email
  const functions = getFunctions()
  const deliveryReceipts = useSelector(state => state.deliveryReceipts)
  const deliveryPhotos = useSelector(state => state.deliveryPhotos)
  const deliveryDate = useSelector(state => state.deliveryDate)
  const deliveryProject = useSelector(state => state.deliveryProject)
  const deliveryVendor = useSelector(state => state.deliveryVendor)
  const deliveryNotes = useSelector(state => state.deliveryNotes)
  const deliveryStatus = useSelector(state => state.deliveryStatus)

  const addDelivery = async ({
     deliveryReceipts,
     deliveryPhotos,
     deliveryDate,
     deliveryProject,
     deliveryVendor,
     deliveryNotes,
     deliveryStatus,
  }) => {
    try {
      const docRef = await addDoc(collection(db, 'deliveries'), {
        deliveryReceipts,
        deliveryPhotos,
        deliveryDate,
        deliveryProject,
        deliveryVendor,
        deliveryNotes,
        deliveryStatus
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const navigation = useNavigation()
  const dispatch = useDispatch()

  console.log(status)

  const handleStatus = () => {
    if (status === 'Not Approved') {
      setStatus('Approved')
      dispatch(setDeliveryStatus('Approved'))
    } else {
      setStatus('Not Approved')
      dispatch(setDeliveryStatus('Not Approved'))
      }
    }

  const handleDateConfirm = date => {
    dispatch(setDeliveryDate(date))
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel this delivery'
      [
        {
          text: 'No',
          onPress: () => null,
          style: 'Cancel'
        },
        {
          text: 'Yes',
          onPress: () => navigation.navigate('Home')
        }
      ],
      { cancelable: false }
    );
  }

  const handleSubmit = () => {
    Alert.alert(
      'Submit',
      "Are you sure you want to submit this delivery",
      [
        {
          text: 'No',
          onPress: () => null,
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => {
            if (deliveryReceipts && deliveryPhotos && deliveryProject && deliveryVendor && deliveryNotes && deliveryStatus) {
              addDelivery({
                deliveryReceipts,
                deliveryPhotos,
                deliveryDate,
                deliveryProject,
                deliveryVendor,
                deliveryNotes,
                deliveryStatus
              });
              const sendEmail = httpsCallable(functions, 'sendEmail');
              sendEmail({
                email: email,
                deliveryReceipts: deliveryReceipts,
                deliveryPhotos: deliveryPhotos,
                deliveryDate: deliveryDate,
                deliveryProject: deliveryProject,
                deliveryVendor: deliveryVendor,
                deliveryNotes: deliveryNotes,
                deliveryStatus: deliveryStatus
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
            dispatch(setDeliveryStatus('Not Approved'));
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

 const setApprovedOpacity = () => {
    if ( status === 'Approved'){
      return 1
    } else {
      return 0.5
    }
 }

  const setNotApprovedOpacity = () => {
    if ( status === 'Not Approved'){
      return 1
    } else {
      return 0.5
    }
  }

  const handleInformation = () => {
    if (showInformation) {
      setShowInformation(false)
    } else {
      setShowInformation(true)
    }
  }

  const InformationItem = () => {
    return (
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: showInformation ? '#aeaea9' : 'white', borderRadius: 5, height: 70, width: 300, padding: 5, marginTop: -30 }}>
        <Text style={{ color: showInformation ? 'black' : 'white' }} >If all items listed on receipt are included and in good condition, please press approve. If not please press not approve.</Text>
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View onAccessibilityEscape={Keyboard.dismiss} style={styles.container}>
        <View style={styles.backButtonWrapper}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name='arrow-back-outline' size='25' color={'black'} />
          </TouchableOpacity>
          <RowItem onPress={navigateToReceipts} iconName={'receipt-outline'} text={'Add Receipts'} valueCount={deliveryReceipts?.length} />
          <RowItem onPress={navigateToPhotos} path={'UploadPhotos'} iconName={'image-outline'} text={'Add Photos'} valueCount={deliveryPhotos?.length} />
          <DatePicker onConfirm={handleDateConfirm}/>
          <View style={styles.textBoxWrapper}>
            <Text style={styles.textBoxText}>Project</Text>
              <TextInput
                style={{ ...styles.textBox, height: 50 }}
                multiline={true}
                value={project}
                onChangeText={handleProjectChange}
                autoCapitalize="sentences"
              />
          </View>
          <View style={styles.textBoxWrapper}>
            <Text style={styles.textBoxText}>Vendor</Text>
              <TextInput
                style={{ ...styles.textBox, height: 50 }}
                multiline={true}
                value={vendor}
                onChangeText={handleVendorChange}
                autoCapitalize="sentences"
              />
          </View>
          <View style={styles.textBoxWrapper}>
            <Text style={styles.textBoxText}>Notes</Text>
              <TextInput
                style={ styles.textBox }
                multiline={true}
                value={notes}
                onChangeText={handleNotesChange}
                autoCapitalize="sentences"
              />
          </View>
          <View style={{ marginTop: 50 }}>
            <View style={{ display: 'flex', flexDirection: 'row'}}>
              <Ionicons onPress={handleInformation} name="information-circle-outline" size='25' color={'black'} style={{ marginTop: -10 }} />
              <InformationItem />
            </View>
            <View style={styles.buttonsWrapper}>
              <TouchableOpacity style={{...styles.button, marginLeft: -15, backgroundColor: '#40D35D', opacity: setApprovedOpacity()}} onPress={handleStatus}>
                <Text style={styles.buttonText}>Approved</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles.button, marginLeft: 30, backgroundColor: '#FF0A0A', opacity: setNotApprovedOpacity()}} onPress={handleStatus}>
                <Text style={styles.buttonText}>Not Approved</Text>
              </TouchableOpacity>
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
      </View>
    </TouchableWithoutFeedback>
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
    marginTop: 20,
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
