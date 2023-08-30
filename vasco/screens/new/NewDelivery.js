import React, { useState, useEffect } from 'react'

// ui imports
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
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
  setReceiptsDownloadUrls,
  setPhotoDownloadUrls,
} from '../../redux/redux'
import { useDispatch } from 'react-redux'

// firebase imports
import { db, auth } from '../../firebase/Firebase'
import { collection, addDoc } from 'firebase/firestore'

const NewDelivery = () => {
  const [notes, setNotes] = useState('')
  const [project, setProject] = useState('')
  const [vendor, setVendor] = useState('')
  const [status, setStatus] = useState('Not Approved')
  const [showInformation, setShowInformation] = useState(false)
  const [disabled, setDisabled] = useState(true)

  const email = auth.currentUser.email
  const deliveryReceipts = useSelector(state => state.deliveryReceipts)
  const deliveryPhotos = useSelector(state => state.deliveryPhotos)
  const deliveryDate = useSelector(state => state.deliveryDate)
  const deliveryProject = useSelector(state => state.deliveryProject)
  const deliveryVendor = useSelector(state => state.deliveryVendor)
  const deliveryNotes = useSelector(state => state.deliveryNotes)
  const deliveryStatus = useSelector(state => state.deliveryStatus)
  const deliveryPhotoDownloadUrls = useSelector(state => state.photoDownloadURLs)
  const deliveryReceiptDownloadUrls = useSelector(state => state.receiptDownloadURLs)

  const addDelivery = async ({
     email,
     deliveryDate,
     deliveryProject,
     deliveryVendor,
     deliveryNotes,
     deliveryStatus,
     deliveryPhotoDownloadUrls,
     deliveryReceiptDownloadUrls
  }) => {
    try {
        const docRef = await addDoc(collection(db, 'deliveries'), {
          email,
          deliveryDate,
          deliveryProject,
          deliveryVendor,
          deliveryNotes,
          deliveryStatus,
          deliveryPhotoDownloadUrls,
          deliveryReceiptDownloadUrls
        });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const navigation = useNavigation()
  const dispatch = useDispatch()

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
    console.log(date)
    dispatch(setDeliveryDate(date))
  };

  const clearImages = () => {
    dispatch(setDeliveryPhotos([]))
    dispatch(setDeliveryReceipts([]))
  }

  const handleCancel = () => {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel this delivery',
      [
        {
          text: 'No',
          onPress: () => null,
          style: 'Cancel'
        },
        {
          text: 'Yes',
          onPress: () => {
            clearImages()
            dispatch(setDeliveryReceipts([]));
            dispatch(setDeliveryPhotos([]));
            dispatch(setDeliveryDate(null));
            dispatch(setDeliveryProject(''));
            dispatch(setDeliveryVendor(''));
            dispatch(setDeliveryNotes(''));
            dispatch(setDeliveryStatus('Not Approved'));
            dispatch(setReceiptsDownloadUrls([]));
            dispatch(setPhotoDownloadUrls([]));
            setNotes('')
            setProject('')
            setVendor('')
            setStatus('Not Approved')
            navigation.navigate('Home')
          }
        }
      ],
      { cancelable: false }
    );
  }

  const handleSubmit = () => {
    if (disabled) {
      Alert.alert(
        'Cannot Submit',
        'Please fill out all required fields',
      )
    } else {
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
              addDelivery({
                email,
                deliveryDate,
                deliveryProject,
                deliveryVendor,
                deliveryNotes,
                deliveryStatus,
                deliveryPhotoDownloadUrls,
                deliveryReceiptDownloadUrls
              }).then(() => {
                console.log('Delivery Submitted')
                dispatch(setDeliveryReceipts([]));
                dispatch(setDeliveryPhotos([]));
                dispatch(setDeliveryDate(null));
                dispatch(setDeliveryProject(''));
                dispatch(setDeliveryVendor(''));
                dispatch(setDeliveryNotes(''));
                dispatch(setDeliveryStatus('Not Approved'));
                dispatch(setReceiptsDownloadUrls([]));
                dispatch(setPhotoDownloadUrls([]));
                setNotes('')
                setProject('')
                setVendor('')
                setStatus('Not Approved')
                Alert.alert('Delivery Submitted', 'Your delivery has been submitted successfully');
                navigation.navigate("DeliveryHistory");
              }).catch((error) => {
                Alert.alert('Error', error.message);
              })
            }
          }
        ],
        { cancelable: false }
      );
    }
  }

  const disableFunc = () => {
    if (
      !deliveryReceipts ||
      !deliveryPhotos ||
      !deliveryDate ||
      !deliveryProject ||
      !deliveryVendor ||
      !deliveryNotes ||
      !deliveryStatus
    ) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }

  useEffect(() => {
    disableFunc()
  }, [deliveryDate, deliveryPhotos, deliveryProject, deliveryStatus, deliveryNotes])


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

  console.log(deliveryReceipts?.length)
  console.log(deliveryPhotos?.length)
  const InformationItem = () => {
    return (
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: showInformation ? '#aeaea9' : 'white', borderRadius: 5, height: 70, width: 300, padding: 5, marginTop: 5 }}>
        <Text style={{ color: showInformation ? 'black' : 'white' }} >If all items listed on receipt are included and in good condition, please press approve. If not please press not approve.</Text>
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <ScrollView onAccessibilityEscape={Keyboard.dismiss} style={styles.container}>
          <View style={{ ...styles.backButtonWrapper, marginTop: Platform.OS === 'android' ? 50 : 75 }}>
            <TouchableOpacity style={{ zIndex: 5, marginBottom: 10 }} onPress={handleCancel}>
              <Ionicons name='arrow-back-outline' size={35} color={'black'} />
            </TouchableOpacity>
          </View>
          <View>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 15, marginTop: -30 }}>
              <Text style={{ fontWeight: '600', fontSize: 24,}}>New Delivery</Text>
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <RowItem onPress={navigateToReceipts} iconName={'receipt-outline'} text={'Add Receipts'} valueCount={deliveryReceipts?.length} />
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <RowItem invalid={deliveryPhotos?.length === 0} onPress={navigateToPhotos} path={'UploadPhotos'} iconName={'image-outline'} text={'Add Photos of Material'} valueCount={deliveryPhotos?.length} />
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <DatePicker color={'#FFC300'} onConfirm={handleDateConfirm}/>
            </View>
            <View>
              <View style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '-5%', marginTop: '5%' }}>
                <Text style={{ ...styles.textBoxText,  marginLeft: '12.5%' }}>Project</Text>
                <Ionicons name="medical" size={15} color={project === '' ? '#FF0A0A' : '#FFFFFF'} style={{ marginTop: -20, marginBottom: 10, marginLeft: '7%' }} />
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <TextInput
                  style={{ ...styles.textBox, height: 50, width: '90%' }}
                  value={project}
                  placeholder={'Provide project name for materials'}
                  onChangeText={handleProjectChange}
                  autoCapitalize="sentences"
                />
              </View>
            </View>
            <View style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '-5%', marginTop: '5%' }}>
              <Text style={{ ...styles.textBoxText,  marginLeft: '12.5%' }}>Vendor</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
              <TextInput
                style={{ ...styles.textBox, height: 50, width: '90%' }}
                value={vendor}
                placeholder={'Provide vendor name for materials'}
                onChangeText={handleVendorChange}
                autoCapitalize="sentences"
              />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center'}}>
              <View style={{ borderWidth: 2, borderColor: 'gray', height: 160, marginTop: 20, width: '90%', borderRadius: 10, padding: 2.5 }}>
                <View style={{ display: 'flex', flexDirection: 'row'}}>
                  <Ionicons onPress={handleInformation} name="information-circle-outline" size={25} color={'black'} />
                  {
                    showInformation ?
                      <InformationItem />
                      :
                      <View style={{ display: 'flex', flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
                        <Text>Approval Status</Text>
                        <View style={{ marginLeft: 5 }}>
                          <Ionicons name="medical" size={15} color="red"/>
                        </View>
                      </View>
                  }
                </View>
                <View style={styles.buttonsWrapper}>
                  <TouchableOpacity style={{...styles.button, backgroundColor: '#40D35D', opacity: setApprovedOpacity()}} onPress={handleStatus}>
                    <Text style={styles.buttonText}>Approved</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{...styles.button, backgroundColor: '#FF0A0A', opacity: setNotApprovedOpacity()}} onPress={handleStatus}>
                    <Text style={styles.buttonText}>Not Approved</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ marginBottom: '-5%', marginTop: '5%' }}>
              <Ionicons name="medical" size={15} color={status === 'Not Approved' && notes === '' ? '#FF0A0A' : '#FFFFFF'} style={{  marginLeft: '7%' }} />
              <Text style={{ ...styles.textBoxText, marginBottom: '5%', marginLeft: '12.5%', marginTop: '-5%' }}>Notes</Text>
            </View>
              {
                status === 'Not Approved' ?
                  <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: '5%' }}>
                    <TextInput
                    style={{...styles.textBox, width: '90%' }}
                    value={notes}
                    placeholder={'If not approved, please provide reason why'}
                    onChangeText={handleNotesChange}
                    autoCapitalize="sentences"
                  />
                  </View>
                  :
                  <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: '5%' }}>
                    <TextInput
                    style={{...styles.textBox, width: '90%' }}
                    value={notes}
                    placeholder={'Give brief description of delivery items'}
                    onChangeText={handleNotesChange}
                    autoCapitalize="sentences"
                  />
                </View>
              }
              <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10%'}}>
                <View style={{ display: 'flex', flexDirection: 'row'}}>
                  <TouchableOpacity style={{...styles.button, marginRight: '2%' }} onPress={handleCancel}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{...styles.button, marginLeft: '2%', }} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    width: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    padding: 15,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
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
  }
})

export default NewDelivery
