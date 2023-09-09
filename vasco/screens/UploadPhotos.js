import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const UploadImages = () => {
  const [photos, setPhotos] = useState([]);
  const [receipts, setReceipts] = useState([]);

  const pickImages = async (callback) => {
    const permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissions.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (!result.cancelled) {
      callback(result.uri);
    }
  };

  return (
    <View style={{ flex: 1, margin: 20 }}>
      <View style={{ marginVertical: 10 }}>
        <Text>Upload Photos</Text>
        <TouchableOpacity
          style={{ backgroundColor: 'green', padding: 10, borderRadius: 5 }}
          onPress={() => pickImages((selectedPhoto) => setPhotos(prev => [...prev, selectedPhoto]))}>
          <Text style={{ color: 'white' }}>+</Text>
        </TouchableOpacity>
        <FlatList
          horizontal
          data={photos}
          renderItem={({ item }) => <Image source={{ uri: item }} style={{ width: 100, height: 100, margin: 10 }} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      <View style={{ marginVertical: 10 }}>
        <Text>Upload Receipts</Text>
        <TouchableOpacity
          style={{ backgroundColor: 'green', padding: 10, borderRadius: 5 }}
          onPress={() => pickImages((selectedPhoto) => setReceipts(prev => [...prev, selectedPhoto]))}>
          <Text style={{ color: 'white' }}>+</Text>
        </TouchableOpacity>
        <FlatList
          horizontal
          data={receipts}
          renderItem={({ item }) => <Image source={{ uri: item }} style={{ width: 100, height: 100, margin: 10 }} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

export default UploadImages;

