import React, { useEffect, useState } from 'react';
import { Alert, View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import moment from 'moment-timezone';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/Firebase';

const EquipmentDetail = ({ route }) => {
  const [fullDeliveryData, setFullDeliveryData] = useState(null);
  const { deliveryData } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDeliveryData = async () => {
      const deliveryRef = doc(db, 'ScheduledDeliveries', deliveryData.deliveryId);
      try {
        const docSnap = await getDoc(deliveryRef);
        if (docSnap.exists()) {
          setFullDeliveryData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching delivery data:', error);
      }
    };

    fetchDeliveryData();
  }, [deliveryData.deliveryId]);

  const handleReceiveMaterials = () => {
    navigation.navigate('PhotoBackup', { deliveryData });
  };

  const handleDeleteDelivery = (deliveryId) => {
    console.log(deliveryId)
    Alert.alert("Confirm Delete", "Are you sure you want to delete this delivery?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => deleteDelivery(deliveryId) }
    ]);
  };

  const deleteDelivery = async (deliveryId) => {
    await deleteDoc(doc(db, "ScheduledDeliveries", deliveryId));
    navigation.goBack();
  };

  const handleEditMaterials = () => {
    navigation.navigate('EditDelivery', { deliveryData });
  }


  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.detailCard}>
          <View>
            <Text style={styles.detailHeader}>Delivery Detail</Text>
          </View>
          <Text style={styles.detailText}>
            <Text style={styles.detailPropertyText}>Delivery Date: </Text>
            {moment(deliveryData.deliveryDate).format('MM-DD-YYYY')}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailPropertyText}>Project: </Text>
            {deliveryData.project}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailPropertyText}>Vendor: </Text>
            {deliveryData.vendor}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailPropertyText}>Material Description: </Text>
            {deliveryData.material}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailPropertyText}>Subcontractor: </Text>
            {deliveryData.subcontractor}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailPropertyText}>User: </Text>
            {deliveryData.user}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailPropertyText}>Notes: </Text>
            {deliveryData.notes}
          </Text>
          <View style={styles.attachmentsContainer}>
            {fullDeliveryData && fullDeliveryData.photos ? <Text style={styles.attachmentsHeader}>Photos</Text> : null}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {fullDeliveryData && fullDeliveryData.photos && fullDeliveryData.photos.map((photo, index) => (
                <Image key={index} source={{ uri: photo }} style={styles.attachmentImage} />
              ))}
            </ScrollView>
            {fullDeliveryData && fullDeliveryData.photos ? <Text style={styles.attachmentsHeader}>Receipts</Text> : null}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {fullDeliveryData && fullDeliveryData.receipts && fullDeliveryData.receipts.map((receipt, index) => (
                <Image key={index} source={{ uri: receipt }} style={styles.attachmentImage} />
              ))}
              <View style={styles.buttonContainer}>
                {
                  !fullDeliveryData?.receipts ?
                    <>
                      <TouchableOpacity style={[styles.iconButtonStyle, { backgroundColor: '#FF0A0A', marginHorizontal: 7.5 }]} onPress={() => handleDeleteDelivery(deliveryData.deliveryId)}>
                        <Ionicons name="trash-outline" size={35} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.iconButtonStyle, { backgroundColor: '#FFC300', marginHorizontal: 7.5 }]} onPress={handleEditMaterials}>
                        <Ionicons name="create-outline" size={35} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.iconButtonStyle, { backgroundColor: '#4CAF50', marginHorizontal: 7.5 }]} onPress={handleReceiveMaterials}>
                        <Ionicons name="archive-outline" size={35} color="black" />
                      </TouchableOpacity>
                    </> :
                    <>
                      <TouchableOpacity style={[styles.iconButtonStyle, { backgroundColor: '#FF0A0A', marginHorizontal: 7.5 }]} onPress={() => handleDeleteDelivery(deliveryData.deliveryId)}>
                        <Ionicons name="trash-outline" size={35} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.iconButtonStyle, { backgroundColor: '#4CAF50', marginHorizontal: 7.5 }]} onPress={handleEditMaterials}>
                        <Ionicons name="create-outline" size={35} color="black" />
                      </TouchableOpacity>
                    </>
                }
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 25,
  },
  detailCard: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  iconButtonStyle: {
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60, // Adjust the size as needed
    height: 60, // Adjust the size as needed
    borderRadius: 35, // This creates a circular button
    backgroundColor: '#f9f9f9', // Optional: change the background color as needed
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  detailHeader: {
    fontSize: 24,
    color: '#333',
    marginVertical: 15,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  detailPropertyText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginTop: 20,
  },
  buttonStyle:{
    width: '70%',
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  attachmentsContainer: {
    marginTop: 20,
  },
  attachmentsHeader: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  attachmentImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    marginVertical: 5
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
});

export default EquipmentDetail
