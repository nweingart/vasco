import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { useAuth } from "../auth/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";

const ListView = () => {
  const { orgId } = useAuth();
  const [deliveries, setDeliveries] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    let unsubscribe = () => {};

    if (orgId) {
      const queryRef = query(collection(db, 'ScheduledDeliveries'), where('orgId', '==', orgId));

      unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
        let newDeliveries = {};

        querySnapshot.forEach((doc) => {
          const data = { ...doc.data(), deliveryId: doc.id, status: doc.data().status, isSubmitted: false };
          const estDate = moment(data.deliveryDate).tz('America/New_York').format('YYYY-MM-DD');
          if (!newDeliveries[estDate]) {
            newDeliveries[estDate] = [];
          }
          newDeliveries[estDate].push(data);
        });

        setDeliveries(newDeliveries);
      }, (error) => {
        console.error('Error fetching deliveries:', error);
      });
    }

    return () => unsubscribe();
  }, [orgId]);

  const organizeDeliveries = () => {
    const pendingDeliveries = [];
    const upcomingDeliveries = [];
    const pastDeliveries = [];

    Object.keys(deliveries).forEach(date => {
      deliveries[date].forEach(delivery => {
        // Mark as pending only if status is explicitly 'pending'
        if (delivery.status === 'pending') {
          pendingDeliveries.push(delivery);
        } else {
          // Categorize as past or upcoming based on delivery date
          const deliveryDate = moment(delivery.deliveryDate);
          if (deliveryDate.isBefore(moment(), 'day')) {
            // Delivery date is in the past
            pastDeliveries.push(delivery);
          } else {
            // Delivery date is today or in the future
            upcomingDeliveries.push(delivery);
          }
        }
      });
    });

    // Sort upcoming and past deliveries by date
    upcomingDeliveries.sort((a, b) => moment(a.deliveryDate).diff(moment(b.deliveryDate)));
    pastDeliveries.sort((a, b) => moment(a.deliveryDate).diff(moment(b.deliveryDate)));

    return { pendingDeliveries, upcomingDeliveries, pastDeliveries };
  };



  const { pendingDeliveries, upcomingDeliveries, pastDeliveries } = organizeDeliveries();

  const dataWithHeaders = [
    { type: 'header', title: 'Upcoming Deliveries' },
    ...upcomingDeliveries.length > 0 ? upcomingDeliveries : [{ type: 'message', title: 'No Upcoming Deliveries' }],
    { type: 'header', title: 'Pending Deliveries' },
    ...pendingDeliveries.length > 0 ? pendingDeliveries : [{ type: 'message', title: 'No Pending Deliveries' }],
    { type: 'header', title: 'Past Deliveries' },
    ...pastDeliveries.length > 0 ? pastDeliveries : [{ type: 'message', title: 'No Past Deliveries' }],
  ];

  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return <Text style={styles.header}>{item.title}</Text>;
    } else if (item.type === 'message') {
      return <View style={styles.messageCard}><Text style={styles.messageText}>{item.title}</Text></View>;
    }

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('EquipmentDetail', { deliveryData: item })}
        style={[
          styles.listItem,
          item.logged ? styles.loggedEventItem : null,
          moment(item.deliveryDate).isBefore(moment(), 'day') && (!item.logged || item.logged === false) ? styles.pastUnloggedEventItem : null,
        ]}
      >
        <View style={styles.textContainer}>
          <Text style={styles.text}><Text style={styles.propertyName}>Delivery Date:</Text> {moment(item.deliveryDate).format('YYYY-MM-DD')}</Text>
          <Text style={styles.text}><Text style={styles.propertyName}>Description:</Text> {item.material}</Text>
          <Text style={styles.text}><Text style={styles.propertyName}>Vendor:</Text> {item.vendor}</Text>
          <Text style={styles.text}><Text style={styles.propertyName}>Notes:</Text> {item.notes}</Text>
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {([...(item.photos || []), ...(item.receipts || [])]).map((imageUri, index) => (
                <Image key={index} source={{ uri: imageUri }} style={styles.attachmentImage} />
              ))}
            </ScrollView>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Delivery List</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons style={styles.profileIcon} name="person-circle-outline" size={34} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={dataWithHeaders}
        keyExtractor={(item, index) => item.deliveryId || `header-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  profileIcon: {
    // No explicit background color, using default icon color and size
    color: 'black', // Example white color for the icon, // Matching background color to toggle for consistency
    borderRadius: 15,
    paddingHorizontal: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  messageCard: {
    backgroundColor: '#ececec',
    borderRadius: 5,
    padding: 20,
    marginVertical: 8,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#606060',
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginVertical: 2.5,
  },
  propertyName: {
    fontWeight: 'bold',
  },
  loggedEventItem: {
    backgroundColor: '#4CAF50',
  },
  pastUnloggedEventItem: {
    backgroundColor: '#FF6347',
  },
  attachmentImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    marginVertical: 5
  },
});

export default ListView;
