import React, {useEffect, useState} from 'react';
import {
  View,
  Platform,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";
import { uploadImageToFirebase } from "../../utils/uploadImage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { db, functions } from '../../firebase/Firebase';
import {collection, doc, onSnapshot, query, updateDoc, where} from 'firebase/firestore';
import { httpsCallable } from "firebase/functions";
const sendEmailNotification = httpsCallable(functions, 'sendEmailNotification')
import { useAuth } from '../auth/AuthContext';
import moment from "moment/moment";


const screenWidth = Dimensions.get('window').width;
const isTablet = screenWidth >= 768;

const PhotoBackup = ({ route }) => {
  const [photos, setPhotos] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [status, setStatus] = useState('Not Approved');
  const [notes, setNotes] = useState('');
  const [emails, setEmails] = useState([]);
  const { orgId } = useAuth()

  const navigation = useNavigation();

  const { deliveryData } = route.params
  console.log(deliveryData)
  const deliveryId = deliveryData.deliveryId

  useEffect(() => {
    let unsubscribe = () => {}; // Declare unsubscribe function

    if (orgId) {
      const queryRef = query(collection(db, 'Every'), where('orgId', '==', orgId));

      // Subscribe to the query
      unsubscribe = onSnapshot(queryRef, (snapshot) => {
        const fetchedEmails = [];
        snapshot.forEach((doc) => {
          // Assuming each document has an 'email' field
          const documentData = doc.data();
          if (documentData.email) {
            fetchedEmails.push(documentData.email);
          }
        });
        setEmails(fetchedEmails); // Update component state
      }, (error) => {
        console.error("Error fetching emails:", error);
        // Handle any errors
      });
    }

    return () => unsubscribe(); // Cleanup function to unsubscribe
  }, [orgId]); // Dependency array

  const pickImages = async (source, type) => {
    const permissions = source === 'camera' ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissions.granted) {
      alert('Permission required!');
      return;
    }
    let result = source === 'camera' ? await ImagePicker.launchCameraAsync() : await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });
    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const uris = result.assets.map(asset => asset.uri);
      if (type === 'photo') {
        setPhotos(prevPhotos => [...prevPhotos, ...uris]);
      } else if (type === 'receipt') {
        setReceipts(prevReceipts => [...prevReceipts, ...uris]);
      }
    }
  }

  const updateScheduledDelivery = async (deliveryId, photoUrls, receiptUrls, status, notes) => {
    console.log(deliveryId)
    console.log(photoUrls)
    console.log(receiptUrls)
    console.log(status)
    console.log(notes)
    const deliveryRef = doc(db, 'ScheduledDeliveries', deliveryId);
    const actualReceivedDate = new Date();
    console.log('Updating delivery with ID:', deliveryId);
    console.log('Photo URLs:', photoUrls);
    console.log('Receipt URLs:', receiptUrls);
    console.log('Status:', status);
    console.log('Notes:', notes);
    try {
      await updateDoc(deliveryRef, {
        actualReceivedDate: actualReceivedDate,
        logged: true,
        status: status,
        arrivalNotes: notes,
        photos: photoUrls,
        receipts: receiptUrls,
      });
      console.log('Delivery updated successfully');
    } catch (error) {
      console.error('Error updating delivery:', error);
    }
  }

  const showImageOptions = (type) => {
    Alert.alert(
      'Choose an Option',
      'Take a photo or select from gallery?',
      [
        { text: 'Take a Photo', onPress: () => pickImages('camera', type) },
        { text: 'Select from Gallery', onPress: () => pickImages('gallery', type) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }

  const setApprovedOpacity = () => {
    return status === 'Approved' ? 1 : 0.3;
  }

  const setPendingOpacity = () => {
    return status === 'Pending' ? 1 : 0.3;
  }

  const setNotApprovedOpacity = () => {
    return status === 'Not Approved' ? 1 : 0.3;
  }

  const handleStatus = (newStatus) => {
    setStatus(newStatus);
  };


  const renderImageItem = ({ item, index, type }) => {
    if (item === 'add') {
      return (
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: '#D9D9D9', borderRadius: 5 }]}
          onPress={() => showImageOptions(type)}
        >
          <Text style={[styles.plusSign, { color: 'green' }]}>+</Text>
        </TouchableOpacity>
      );
    }
    const handleRemoveImage = () => {
      if (type === 'photo') {
        const updatedPhotos = [...photos];
        updatedPhotos.splice(index - 1, 1);
        setPhotos(updatedPhotos);
      } else if (type === 'receipt') {
        const updatedReceipts = [...receipts];
        updatedReceipts.splice(index - 1, 1);
        setReceipts(updatedReceipts);
      }
    };
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: item }} style={styles.image} />
        <TouchableOpacity style={styles.removeButton} onPress={handleRemoveImage}>
          <Ionicons name='close-circle' size={24} color={'red'} />
        </TouchableOpacity>
      </View>
    );
  };

  const submitImages = async (imageArray) => {
    const uploadPromises = imageArray.map(uploadImageToFirebase);
    try {
      const downloadUrls = await Promise.all(uploadPromises);
      console.log(downloadUrls)
      return downloadUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };

  const handleBack = () => {
    navigation.goBack();
  }

  const handleNext = async (deliveryId) => {
    Alert.alert(
      "Confirm Submission",
      "Are you sure you want to submit the updated delivery?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Submission cancelled"),
          style: "cancel"
        },
        {
          text: "Submit",
          onPress: async () => {
            try {
              const photoUrls = await submitImages(photos);
              const receiptUrls = await submitImages(receipts);
              if (emails) {
                await sendEmailNotification({ emailList: emails, timezone: "America/New_York" })
                  .then(() => console.log('Email sent successfully'))
                  .catch((error) => {
                    // Log or handle email sending error
                    console.error('Error sending email:', error);
                    Alert.alert("Error", "Failed to send email notification. Please try again.");
                    return; // Exit the function early on error
                  });
              }
              await updateScheduledDelivery(deliveryId, photoUrls, receiptUrls, status, notes);
              console.log('Scheduled Delivery updated successfully')
              navigation.navigate("Calendar");
            } catch (error) {
              console.error('There was an error:', error);
            }
          }
        }
      ]
    );
  };

  const handleNotesChange = value => {
    setNotes(value);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={{ ...styles.title, fontSize: isTablet ? 36 : 24 }}>Add Photo Backup</Text>
          <View style={styles.section}>
            <Text style={{ ...styles.headerText, fontSize: isTablet ? 24 : 16 }}>Add Receipts</Text>
            <FlatList
              horizontal
              data={['add', ...receipts]}
              renderItem={(props) => renderImageItem({ ...props, type: 'receipt' })}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View style={styles.section}>
            <Text style={{ ...styles.headerText, fontSize: isTablet ? 24 : 16 }}>Add Photos of Material</Text>
            <FlatList
              horizontal
              data={['add', ...photos]}
              renderItem={(props) => renderImageItem({ ...props, type: 'photo' })}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View style={styles.actionContainer}>
            <View style={styles.statusIconContainer}>
              <TouchableOpacity
                onPress={() => handleStatus('Approved')}
                style={{ ...styles.iconButton, opacity: setApprovedOpacity()}}
              >
                <Ionicons name="checkmark-circle" size={60} color="#40D35D" />
                <Text style={styles.statusLabel}>Approved</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statusIconContainer}>
              <TouchableOpacity
                onPress={() => handleStatus('Pending')}
                style={{...styles.iconButton, opacity: setPendingOpacity()}}
              >
                <Ionicons name="refresh-circle" size={60} color="gray" />
                <Text style={styles.statusLabel}>Pending</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statusIconContainer}>
              <TouchableOpacity
                onPress={() => handleStatus('Not Approved')}
                style={{...styles.iconButton, opacity: setNotApprovedOpacity()}}
              >
                <Ionicons name="close-circle" size={60} color="#FF0A0A" />
                <Text style={styles.statusLabel}>Not Approved</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.notesLabel}>Notes</Text>
          <TextInput
            style={styles.textBox}
            value={notes}
            placeholder={'Give brief description of delivery items'}
            onChangeText={handleNotesChange}
            autoCapitalize="sentences"
          />
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => handleNext(deliveryId)}>
          <Ionicons name="arrow-forward" size={24} color="black" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    bottom: 50,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 50,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
  section: {
    marginVertical: 15,
    width: '100%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 5,
    marginRight: 10,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  removeButton: {
    position: 'absolute',
    right: 2.5,
    top: -7.5,
    padding: 5,
  },
  uploadButton: {
    width: 120,
    height: 120,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  plusSign: {
    fontSize: 60,
    color: 'green',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  textBox: {
    width: '100%',
    height: isTablet ? 100 : 50,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  notesContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginVertical: 15,
  },
  notesLabel: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  submitButton: {
    position: 'absolute',
    right: 20,
    bottom: 50,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // This ensures even spacing and centering
    alignItems: 'center', // Vertically aligns the icons in the container
    width: '100%',
    marginVertical: 15,
  },
  statusIconContainer: {
    alignItems: 'center', // Centers the icons and text vertically in this container
  },
  iconButton: {
    // Adjust as needed, but ensure it allows for touchable space
    alignItems: 'center', // Make sure icon and text are aligned
  },

  statusLabel: {
    marginTop: 8, // Space between icon and label
    fontSize: 12, // Adjusted for better visibility
    fontWeight: '600', // Ensure this is a string 'bold' might be more compatible
    textAlign: 'center', // Ensures text is centered under the icon
  },
})

export default PhotoBackup
