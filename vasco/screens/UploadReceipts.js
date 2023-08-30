import React, { useState, useEffect } from 'react';
import { Alert, View, StyleSheet, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation} from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { setDeliveryReceipts, setReceiptsDownloadUrls } from "../redux/redux";
import { useDispatch, useSelector } from "react-redux";
import { uploadImageToFirebase } from "../utils/uploadImage";

const UploadReceipts = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const deliveryReceipts = useSelector(state => state.deliveryReceipts);

  useEffect(() => {
    if (deliveryReceipts?.length > 0) {
      setImages(deliveryReceipts);
    }
  }, []);

  const submitReceipts = async () => {
    setUploading(true);
    const uploadPromises = images.map(uploadImageToFirebase);
    const downloadUrls = await Promise.all(uploadPromises);
    dispatch(setDeliveryReceipts(images))
    dispatch(setReceiptsDownloadUrls(downloadUrls));
  }

  const handleBack = () => {
    submitReceipts()
      .then(() => console.log('Receipts uploaded successfully'))
      .catch((error) => console.error('There was an error uploading the receipts:', error))
    navigation.goBack()
  }

  const takePicture = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

      if (cameraPermission.status !== 'granted') {
        Alert.alert('Permission required', 'Camera permissions are required to take a picture.');
        return;
      }

      if (images.length < 5) {
        let result = await ImagePicker.launchCameraAsync();

        if (!result.cancelled) {
          setImages([...images, result.uri]);
        }
      }
    } catch (error) {
      console.error("Error launching camera:", error);
    }
  };

  const pickImage = async () => {
    try {
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (mediaLibraryPermission.status !== 'granted') {
        Alert.alert('Permission required', 'Media library permissions are required to pick an image.');
        return;
      }

      if (images.length < 5) {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.cancelled) {
          setImages([...images, result.uri]);
        }
      }
    } catch (error) {
      console.error("Error accessing media library:", error);
    }
  };

  const renderImage = ({item}) => (
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={{uri: item}} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back-outline" size={35} color={'black'} />
        </TouchableOpacity>
      </View>
      <Text style={styles.imagesHeading}>Delivery Receipts</Text>
      {images.length > 0 ? (
        <FlatList
          data={images}
          renderItem={renderImage}
          keyExtractor={item => item}
          horizontal={true}
          style={styles.imageList}
        />
      ) : (
        <Text style={styles.noImagesText}>No receipts added yet</Text>
      )}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Ionicons name="camera-outline" size={35} color={'black'} />
          <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Ionicons name="image-outline" size={35} color={'black'} />
          <Text style={styles.buttonText}>Upload From Camera Roll</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '30%',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 30,
    top: 70,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 100
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 600,
  },
  imageList: {
    height: 80,
    maxHeight: 100,
    flexGrow: 0,
    marginTop: 20,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  imagesHeading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  noImagesText: {
    fontSize: 18,
    color: 'gray',
  },
  submitButton: {
    marginTop: 25,
    backgroundColor: '#FFC300',
    borderRadius: 15,
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
  }
});

export default UploadReceipts
