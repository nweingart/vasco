import React, { useState, useEffect } from 'react';
import {Button, Image, View, StyleSheet, TouchableOpacity, TouchableHighlightComponent} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { setReceipts } from '../redux/redux';
import { useNavigation} from "@react-navigation/native";
import { useDispatch } from 'react-redux';

const UploadReceipts = () => {
  const [images, setImages] = useState([]);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);

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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={takePicture}>
        <Text>Take Picture</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImage}>
        <Text>Select from Camera Roll</Text>
      </TouchableOpacity>
      {images.map((image, index) =>
        <Image key={index} source={{ uri: image }} style={styles.image} />
      )}
      <TouchableOpacity onPress={() => navigation.navigate('')}>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },
})

export default UploadReceipts
