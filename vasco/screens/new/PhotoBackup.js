import React, { useState } from 'react';
import { View, Alert, FlatList, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { uploadImageToFirebase } from "../../utils/uploadImage";
import { setDeliveryPhotos, setPhotoDownloadUrls, setDeliveryReceipts, setReceiptsDownloadUrls } from '../../redux/redux'
import Ionicons from "@expo/vector-icons/Ionicons";

const PhotoBackup = () => {
  const [photos, setPhotos] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [uploading, setUploading] = useState(false);


  const dispatch = useDispatch();
  const navigation = useNavigation();

  const pickImages = async (source, type) => {
    const permissions =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissions.granted) {
      alert('Permission required!');
      return;
    }

    let result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync()
        : await ImagePicker.launchImageLibraryAsync({
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
  };

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

  const renderImageItem = ({ item, type }) => {
    if (item === 'add') {
      return (
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: '#D9D9D9' }]}
          onPress={() => showImageOptions(type)}
        >
          <Text style={[styles.plusSign, { color: 'green' }]}>+</Text>
        </TouchableOpacity>
      );
    }

    return <Image source={{ uri: item }} style={styles.image} />;
  };

  const submitImages = async (imageArray, setFunction) => {
    setUploading(true);

    const uploadPromises = imageArray.map(uploadImageToFirebase);
    const downloadUrls = await Promise.all(uploadPromises);


    if(setFunction === setPhotos) {
      dispatch(setDeliveryPhotos(imageArray));
      dispatch(setPhotoDownloadUrls(downloadUrls));
    } else {
      dispatch(setDeliveryReceipts(imageArray));
      dispatch(setReceiptsDownloadUrls(downloadUrls));
    }
  }

  const handleBack = () => {
    navigation.navigate("NewDelivery")
    submitImages(photos, setPhotos)
      .then(() => {
        return submitImages(receipts, setReceipts);
      })
      .then(() => {
        console.log('Photos and Receipts uploaded successfully');
      })
      .catch(error => {
        console.error('There was an error uploading the images:', error);
      });
  };

  return (
        <View style={styles.container}>
          <View style={styles.backButton}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name='arrow-back-outline' size={45} color={'black'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Add Photo Backup</Text>
          <View style={styles.section}>
            <View style={styles.section}>
              <Text style={styles.headerText}>Add Receipts</Text>
              <FlatList
                horizontal
                data={[...receipts, 'add']}
                renderItem={(props) => renderImageItem({ ...props, type: 'receipt' })}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <Text style={styles.headerText}>Add Photos of Material</Text>
            <FlatList
              horizontal
              data={[...photos, 'add']}
              renderItem={(props) => renderImageItem({ ...props, type: 'photo' })}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Light gray background
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)', // This makes it slightly transparent
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    zIndex: 5,
    position: 'absolute',
    top: '10%', // Adjust this value to move it up or down
    left: '10%' // Adjust this value to move it left or right
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 20,
    alignSelf: 'center',  // Center the title
  },
  section: {
    marginVertical: 15,
    width: '100%',
  },
  headerText: {
    fontSize: 24,   // Increase font size for headers
    fontWeight: 'bold',
    marginBottom: 20, // Space between the header and images
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 120,   // Increase width of the image
    height: 120,  // Increase height of the image
    marginLeft: 10,
  },
  uploadButton: {
    width: 120,   // Same size as the image
    height: 120,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  plusSign: {
    fontSize: 60,   // Slightly increased font size for the plus sign
    color: 'green',
  }
});

export default PhotoBackup
