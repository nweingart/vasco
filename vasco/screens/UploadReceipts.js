import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { useNavigation} from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { setDeliveryReceipts } from "../redux/redux";
import { useDispatch, useSelector } from "react-redux";


const UploadReceipts = () => {
  const [images, setImages] = useState([]);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const deliveryReceipts = useSelector(state => state.deliveryReceipts);

  useEffect(() => {
    if (deliveryReceipts?.length > 0) {
      setImages(deliveryReceipts);
    }
  }, []);

  const handleBack = () => {
    navigation.goBack()
  }

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestPermissionsAsync();
      setCameraPermission(cameraStatus === 'granted');

      const { status: galleryStatus }  = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus === 'granted');

      if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
        alert('Sorry, we need camera roll and camera permissions to make this work!');
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraPermission && images.length < 5) {
      let result = await ImagePicker.launchCameraAsync();

      if (!result.cancelled) {
        setImages([...images, result.uri]);
      }
    }
  };

  const pickImage = async () => {
    if (galleryPermission && images.length < 5) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.cancelled) {
        setImages([...images, result.uri]);
      }
    }
  };

  const submitReceipts = () => {
    dispatch(setDeliveryReceipts(images))
    navigation.goBack()
  }

  const renderImage = ({item}) => (
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={{uri: item}} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back-outline" size={25} color={'black'} />
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
      <View>
        <TouchableOpacity style={styles.submitButton} onPress={submitReceipts}>
          <Text style={styles.submitButtonText}>Submit</Text>
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
    top: 50,
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
    width: 60,
    height: 60,
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
