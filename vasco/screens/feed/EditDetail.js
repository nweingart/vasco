import React, { useState, useRef } from 'react';
import { Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, View, Dimensions } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';

const EditDetail = ({ route }) => {
  const { delivery } = route.params;
  const navigation = useNavigation();
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = delivery?.deliveryPhotoDownloadUrls.concat(delivery?.deliveryReceiptDownloadUrls || []);
  const horizontalScrollViewRef = useRef(null);

  const screenWidth = Dimensions.get('window').width;

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    setImageModalVisible(true);
  };

  const handleScroll = event => {
    const offset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offset / screenWidth);
    if (selectedImageIndex !== newIndex) {
      setSelectedImageIndex(newIndex);
    }
  };


  return (
    <>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={35} color={'black'} />
        </TouchableOpacity>
        <Text>{new Date(delivery?.deliveryDate?.seconds * 1000).toDateString()}</Text>
        <Text>{delivery.deliveryProject}</Text>
        <Text>{delivery.deliveryVendor}</Text>
        <Text>{delivery.deliveryNotes}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((url, index) => (
            <TouchableOpacity key={index} onPress={() => handleImagePress(index)}>
              <Image
                style={{ width: 100, height: 100, marginHorizontal: 5, borderRadius: 5 }}
                source={{ uri: url }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity>
          <Text>Edit Delivery</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView
            ref={horizontalScrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
          >
            {images.map((url, index) => (
              <Image
                key={index}
                style={{ width: screenWidth, height: '90%', resizeMode: 'contain' }}
                source={{ uri: url }}
              />
            ))}
          </ScrollView>
          <Text style={styles.imageCounterText}>
            {selectedImageIndex + 1}/{images.length}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => setImageModalVisible(false)}>
            <Ionicons name="close-circle" size={40} color={'black'} />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50
  },
  backButton: {
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20
  },
  imageCounterText: {
    position: 'absolute',
    bottom: 150,
    alignSelf: 'center',
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold'
  },
});

export default EditDetail;
