import React, { useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler } from 'react-native-reanimated';


import {
  Alert,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  View,
  Dimensions,
  TextInput
} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/Firebase'

const screenWidth = Dimensions.get('window').width;

const isTablet = screenWidth >= 768;

const EditDetail = ({ route }) => {
  const navigation = useNavigation();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value }
      ],
    };
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
    }
  });

  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deliveryData, setDeliveryData] = useState(route.params.delivery);

  const status = deliveryData.deliveryStatus;

  const images = deliveryData?.deliveryPhotoDownloadUrls.concat(deliveryData?.deliveryReceiptDownloadUrls || []);
  const screenWidth = Dimensions.get('window').width;

  const handleRemoveImage = (url) => {
    const isReceiptImage = deliveryData.deliveryReceiptDownloadUrls?.includes(url);
    const wouldBeLastReceipt = isReceiptImage && deliveryData.deliveryReceiptDownloadUrls.length === 1;

    if (wouldBeLastReceipt) {
      alert("There must be at least one receipt image.");
      return;
    }

    setDeliveryData(prevDelivery => {
      const updatedPhotoUrls = prevDelivery.deliveryPhotoDownloadUrls.filter(photoUrl => photoUrl !== url);
      const updatedReceiptUrls = prevDelivery.deliveryReceiptDownloadUrls ? prevDelivery.deliveryReceiptDownloadUrls.filter(receiptUrl => receiptUrl !== url) : [];
      return {
        ...prevDelivery,
        deliveryPhotoDownloadUrls: updatedPhotoUrls,
        deliveryReceiptDownloadUrls: updatedReceiptUrls
      };
    });
  };

  const handleEditPress = async () => {
    if (isEditMode) {
      const updatedDelivery = {
        ...deliveryData,
        deliveryProject: deliveryData.deliveryProject,
        deliveryVendor: deliveryData.deliveryVendor,
        deliveryNotes: deliveryData.deliveryNotes,
      };

      const deliveryRef = doc(db, 'deliveries', deliveryData.id);
      await updateDoc(deliveryRef, updatedDelivery);
      setDeliveryData(updatedDelivery); // Update local state to reflect the changes
    }
    setIsEditMode(!isEditMode);
  };

  const deleteDelivery = async (deliveryId) => {
    try {
      // Get a reference to the delivery
      const deliveryRef = doc(db, "deliveries", deliveryId);

      // Delete the delivery
      await deleteDoc(deliveryRef);

      // Navigate back to Delivery History
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting delivery:", error);
    }
  };


  const handleDeletePress = (deliveryId) => {
    Alert.alert(
      "Delete Delivery",
      "Are you sure you want to delete this delivery?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Yes", onPress: () => deleteDelivery(deliveryId) }
      ],
      { cancelable: false }
    );
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  // New function to handle the scroll event of the ScrollView
  const handleScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / screenWidth);
    setCurrentIndex(index);
  };

  const dateObject = new Date(deliveryData?.deliveryDate?.seconds * 1000);
  const formattedDate = dateObject.toDateString();
  const formattedTime = dateObject.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={35} color={'black'} />
        </TouchableOpacity>
        <View style={{ marginLeft: '85%', marginBottom: -45 }}>
          {status === 'Approved' ?
            <Ionicons name="checkmark-circle-outline" size={35} color={'#40D35D'} />
            : <Ionicons name="close-circle" size={35} color={'#FF0A0A'} />
          }
        </View>
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{ fontWeight: '600', fontSize: isTablet ? 36 : 24  }}>Delivery Detail</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.dateText}>
            {formattedDate}
          </Text>
          <Text style={styles.timeText}> {formattedTime}</Text>
        </View>
        {isEditMode ? (
          <TextInput
            placeholder={'Project'}
            style={styles.editableText}
            value={deliveryData.deliveryProject}
            onChangeText={(text) => setDeliveryData(prev => ({ ...prev, deliveryProject: text }))}
          />
        ) : (
          <Text style={styles.projectText}>Project: {deliveryData.deliveryProject}</Text>
        )}

        {isEditMode ? (
          <TextInput
            placeholder={'Vendor'}
            style={styles.editableText}
            value={deliveryData.deliveryVendor}
            onChangeText={(text) => setDeliveryData(prev => ({ ...prev, deliveryVendor: text }))}
          />
        ) : (
          <Text style={styles.vendorText}>Vendor: {deliveryData.deliveryVendor}</Text>
        )}
        {isEditMode ? (
          <TextInput
            placeholder={'Notes'}
            style={styles.editableText}
            value={deliveryData.deliveryNotes}
            onChangeText={(text) => setDeliveryData(prev => ({ ...prev, deliveryNotes: text }))}
          />
        ) : (
          <Text style={styles.notesText}>Notes: {deliveryData.deliveryNotes}</Text>
        )}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((url, index) => (
            <View key={index} style={{ position: 'relative', marginHorizontal: 5 }}>
              <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                <Image
                  style={{ width: isTablet ? 250 : 100, height: isTablet ? 250: 100, borderRadius: 5, marginTop: 25 }}
                  source={{ uri: url }}
                />
              </TouchableOpacity>
              {isEditMode && (
                <TouchableOpacity
                  style={{ position: 'absolute', top: 22.5, right: -2, padding: 0 }}
                  onPress={() => handleRemoveImage(url)}
                >
                  <Ionicons name="close-circle" size={20} color={'#FF0A0A'} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <Text style={styles.editButtonText}>{isEditMode ? 'Save' : 'Edit Delivery'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePress(deliveryData.id)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        visible={isImageModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setImageModalVisible(false)}
      >
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((url, index) => (
          <Image
            key={index}
            style={{ width: screenWidth, height: 600, marginTop: '5%', resizeMode: 'contain' }}
            source={{ uri: url }}
          />
        ))}
      </ScrollView>
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ justifyContent: 'center', alignItems: 'center', fontSize: 24, fontWeight: '600', color: 'black' }}>
          {currentIndex + 1}/{images.length}
        </Text>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={() => setImageModalVisible(false)}>
        <Ionicons name="close-circle" size={40} color={'black'} />
      </TouchableOpacity>
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
  editableText: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    marginBottom: 15,
    marginTop: 25,
  },
  editButton: {
    marginTop: 25,
    padding: 10,
    backgroundColor: '#FFC300',
    borderRadius: 5,
    alignItems: 'center',
    width: isTablet ? '60%' : '90%',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: isTablet ? '60%' : '90%',
  },
  deleteButtonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  editButtonText: {
    color: 'black',
    fontWeight: 'bold',
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
  dateText:{
    fontSize: isTablet ? 24 : 18,
    fontWeight: '700',
    marginTop: 15,
    color: '#333',
  },
  projectText: {
    fontSize: isTablet ? 24 : 16,
    fontWeight: '500',
    marginTop: 15,
    color: '#333',
  },
  vendorText: {
    fontSize: isTablet ? 24 : 16,
    fontWeight: '500',
    marginTop: 15,
    color: '#333',
  },
  notesText: {
    fontSize: isTablet ? 24 : 16,
    fontWeight: '400',
    marginTop: 15,
    color: '#666',
  },
  timeText: {
    fontSize: isTablet ? 24 : 18,
    marginLeft: 5,
    marginTop: 15,
  }
});

export default EditDetail
