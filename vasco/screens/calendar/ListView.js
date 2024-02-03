import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const DeliveryListView = ({ deliveries }) => {
  const navigation = useNavigation();

  // Split and sort deliveries into upcoming and past
  const upcomingDeliveries = [];
  const pastDeliveries = [];
  Object.keys(deliveries).forEach(date => {
    deliveries[date].forEach(delivery => {
      if (moment(delivery.deliveryDate).isBefore(moment(), 'day')) {
        pastDeliveries.push(delivery);
      } else {
        upcomingDeliveries.push(delivery);
      }
    });
  });

  // Sort each array accordingly
  upcomingDeliveries.sort((a, b) => moment(a.deliveryDate).diff(moment(b.deliveryDate)));
  pastDeliveries.sort((a, b) => moment(b.deliveryDate).diff(moment(a.deliveryDate)));

  // Merge arrays with headers
  const dataWithHeaders = [
    { type: 'header', title: 'Upcoming Deliveries' },
    ...upcomingDeliveries,
    { type: 'header', title: 'Past Deliveries' },
    ...pastDeliveries,
  ].filter(item => item.title !== 'Past Deliveries' || pastDeliveries.length > 0); // Only show past deliveries header if there are past deliveries

  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return <Text style={styles.header}>{item.title}</Text>;
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
          <Text style={styles.text}><Text style={styles.propertyName}>Vendor:</Text> {item.vendor}</Text>
          <Text style={styles.text}><Text style={styles.propertyName}>Material:</Text> {item.material}</Text>
          <Text style={styles.text}><Text style={styles.propertyName}>Delivery Date:</Text> {item.deliveryDate}</Text>
          <Text style={styles.text}><Text style={styles.propertyName}>Status:</Text> {item.isSubmitted ? 'Submitted' : 'Not Submitted'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={dataWithHeaders}
      keyExtractor={(item, index) => item.deliveryId || `header-${index}`}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 20,
    paddingBottom: 10,
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
    backgroundColor: '#4CAF50', // Green background for logged events
  },
  pastUnloggedEventItem: {
    backgroundColor: '#FF6347', // Red background for past unlogged events
  },
});

export default DeliveryListView;
