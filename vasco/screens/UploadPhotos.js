import React, { useState, useEffect } from 'react';
import { Button, Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

const UploadPhotos = () => {
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
      <Button title="Take a picture" onPress={takePicture} />
      <Button title="Select a picture from gallery" onPress={pickImage} />
      {images.map((image, index) =>
        <Image key={index} source={{ uri: image }} style={styles.image} />
      )}
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

export default UploadPhotos
