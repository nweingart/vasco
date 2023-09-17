import React, { useState, useEffect } from 'react';
import { View, Alert, FlatList, Image, StyleSheet, TouchableOpacity, Text, Dimensions, BackHandler } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { uploadImageToFirebase } from "../../utils/uploadImage";
import { setDeliveryPhotos, setPhotoDownloadUrls, setDeliveryReceipts, setReceiptsDownloadUrls } from '../../redux/redux'
import Ionicons from "@expo/vector-icons/Ionicons";

const screenWidth = Dimensions.get('window').width;

const isTablet = screenWidth >= 768;

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
  }

  useEffect(() => {
    const backAction = () => {
      handleBack()
      return true
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, [photos, receipts]);

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
        updatedPhotos.splice(index - 1, 1); // subtracting 1 because of the 'add' at the start
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
          <Text style={{ ...styles.title, fontSize: isTablet ? 36 : 24  }}>Add Photo Backup</Text>
          <View style={styles.section}>
            <View style={styles.section}>
              <Text style={{ ...styles.headerText, fontSize: isTablet ? 24 : 16 }}>Add Receipts</Text>
              <FlatList
                horizontal
                data={['add', ...receipts]}
                renderItem={(props) => renderImageItem({ ...props, type: 'receipt' })}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <Text style={{ ...styles.headerText, fontSize: isTablet ? 24 : 16 }}>Add Photos of Material</Text>
            <FlatList
              horizontal
              data={['add', ...photos ]}
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
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    zIndex: 5,
    position: 'absolute',
    top: '12%',
    left: '10%'
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
});

export default PhotoBackup
