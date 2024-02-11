import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { useAuth } from "../auth/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";

const DeliveryFeed = () => {
  const { orgId } = useAuth();
  const [deliveries, setDeliveries] = useState({});
  const [activeTab, setActiveTab] = useState('missed'); // Keep or set the default tab as needed
  const navigation = useNavigation();

  console.log(deliveries)

  useEffect(() => {
    let unsubscribe = () => {};

    if (orgId) {
      const queryRef = query(collection(db, 'ScheduledDeliveries'), where('orgId', '==', orgId));

      unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
        let newDeliveries = {};

        querySnapshot.forEach((doc) => {
          const data = { ...doc.data(), deliveryId: doc.id };
          const estDate = moment(data.deliveryDate).tz('America/New_York').format('YYYY-MM-DD');
          if (!newDeliveries[estDate]) {
            newDeliveries[estDate] = [];
          }
          newDeliveries[estDate].push(data);
        });

        setDeliveries(newDeliveries);
      });
    }

    return () => unsubscribe();
  }, [orgId]);

  const organizeDeliveries = () => {
    const missedDeliveries = [];
    const receivedDeliveries = [];
    const upcomingDeliveries = [];

    Object.keys(deliveries).forEach(date => {
      deliveries[date].forEach(delivery => {
        const deliveryDate = moment(delivery.deliveryDate);
        const isBeforeToday = deliveryDate.isBefore(moment(), 'day');
        const isReceived = ['Approved', 'Not Approved', 'Pending'].includes(delivery.status);

        if (isReceived) {
          receivedDeliveries.push(delivery);
        } else if (isBeforeToday) {
          missedDeliveries.push(delivery);
        } else {
          upcomingDeliveries.push(delivery);
        }
      });
    });

    // Optionally, sort each category by date
    missedDeliveries.sort((a, b) => moment(b.deliveryDate).diff(moment(a.deliveryDate)));
    receivedDeliveries.sort((a, b) => moment(b.deliveryDate).diff(moment(a.deliveryDate)));
    upcomingDeliveries.sort((a, b) => moment(b.deliveryDate).diff(moment(a.deliveryDate)));

    return { missedDeliveries, receivedDeliveries, upcomingDeliveries };
  };

  const { missed: missedDeliveries, upcoming: upcomingDeliveries, received: receivedDeliveries } = organizeDeliveries();

  const renderTabContent = () => {
    const { missedDeliveries, receivedDeliveries, upcomingDeliveries } = organizeDeliveries();

    switch (activeTab) {
      case 'missed':
        return missedDeliveries.length > 0 ? missedDeliveries : [{ type: 'message', title: 'No Missed Deliveries' }];
      case 'received':
        return receivedDeliveries.length > 0 ? receivedDeliveries : [{ type: 'message', title: 'No Received Deliveries' }];
      case 'upcoming':
        return upcomingDeliveries.length > 0 ? upcomingDeliveries : [{ type: 'message', title: 'No Upcoming Deliveries' }];
      default:
        return [{ type: 'message', title: 'Select a tab to view deliveries' }];
    }
  };


  const renderItem = ({ item }) => {
    if (item.type === 'message') {
      return <View style={styles.messageCard}><Text style={styles.messageText}>{item.title}</Text></View>;
    }

    // Default card style with dynamic left border color
    let cardStyle = {...styles.listItem, borderLeftColor: '#ddd'};
    let iconColor = 'gray'; // Default icon color
    const deliveryDate = moment(item.deliveryDate);
    const isBeforeToday = deliveryDate.isBefore(moment(), 'day');

    // Set left border and icon color based on item status
    if (['Approved', 'Not Approved', 'Pending'].includes(item.status)) {
      cardStyle = {...cardStyle, borderLeftColor: 'green'}; // Green for "Received"
      iconColor = item.status === 'Approved' ? 'green' : item.status === 'Not Approved' ? 'red' : 'gray';
    } else if (isBeforeToday) {
      cardStyle = {...cardStyle, borderLeftColor: 'red'}; // Red for "Missed"
    }

    // Determine the icon based on status
    let statusIcon;
    switch (item.status) {
      case 'Approved':
        statusIcon = "checkmark-circle";
        break;
      case 'Not Approved':
        statusIcon = "close-circle";
        break;
      case 'Pending':
        statusIcon = "refresh-circle";
        break;
    }

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DeliveryDetail', { deliveryData: item })}
        style={[styles.listItem, cardStyle]} // Apply combined styles
      >
        <View style={styles.textContainer}>
          <Text style={styles.text}><Text style={styles.propertyName}>Delivery Date:</Text> {moment(item.deliveryDate).format('YYYY-MM-DD')}</Text>
          <Text style={styles.text}><Text style={styles.propertyName}>Description:</Text> {item.material}</Text>
          <Text style={styles.text}><Text style={styles.propertyName}>Vendor:</Text> {item.vendor}</Text>
          <Text style={styles.text}><Text style={styles.propertyName}>Notes:</Text> {item.notes}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {([...(item.photos || []), ...(item.receipts || [])]).map((imageUri, index) => (
              <Image key={index} source={{ uri: imageUri }} style={styles.attachmentImage} />
            ))}
          </ScrollView>
        </View>
        {statusIcon && (
          <Ionicons name={statusIcon} size={40} color={iconColor} style={styles.statusIcon} />
        )}
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Delivery Feed</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="person-circle-outline" size={34} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('missed')}
          style={[
            styles.tabButton,
            activeTab === 'missed' ? styles.missedButton : styles.missedButtonInactive
          ]}
        >
          <Text style={styles.tabText}>Missed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('upcoming')}
          style={[
            styles.tabButton,
            activeTab === 'upcoming' ? styles.upcomingButton : styles.upcomingButtonInactive
          ]}
        >
          <Text style={styles.tabText}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('received')}
          style={[
            styles.tabButton,
            activeTab === 'received' ? styles.receivedButton : styles.receivedButtonInactive
          ]}
        >
          <Text style={styles.tabText}>Received</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={renderTabContent()}
        keyExtractor={(item, index) => item.deliveryId || `${activeTab}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    marginBottom: 50,
    paddingBottom: 120,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listItem: {
    position: 'relative', // This is crucial for absolute positioning of children
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 10,// Set a thicker left border for visibility
    // Note: The borderLeftColor will be dynamically applied based on the item status
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
  listContainer: {
    flexGrow: 1,
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
  attachmentImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    marginVertical: 5,
  },
  imageContainer: {
    marginTop: 10,
  },
  activeTab: {
    backgroundColor: '#007bff', // A distinct color for the active tab
    color: 'white', // Text color change if needed
    borderColor: '#007bff', // Border color to match the background of active tab
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1, // Keep the border definitions
    borderColor: '#ddd', // Neutral color for the border
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Define active and inactive styles for each button type
  missedButton: {
    backgroundColor: 'rgba(255, 10, 10, 1)',
  },
  missedButtonInactive: {
    backgroundColor: 'rgba(255, 10, 10, 0.5)',
  },
  receivedButton: {
    backgroundColor: 'rgba(76, 175, 80, 1)',
  },
  receivedButtonInactive: {
    backgroundColor: 'rgba(76, 175, 80, 0.5)',
  },
  upcomingButton: {
    backgroundColor: 'rgba(240, 240, 240, 1)', // Full opacity for active
  },
  upcomingButtonInactive: {
    backgroundColor: 'rgba(240, 240, 240, 0.5)', // 30% opacity for inactive
  },
  tabText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    fontWeight: 600,
  },
  receivedCard: {
    backgroundColor: 'rgba(76, 175, 80, 1)',
  },
  missedCard: {
    backgroundColor: 'rgba(255, 10, 10, 1)',
  },
  statusIcon: {
    position: 'absolute', // Position icon absolutely within the card
    top: 10, // Adjust top and right as needed to position the icon
    right: 10,
  },
});

export default DeliveryFeed;

