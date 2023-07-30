import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import { db } from "../firebase/Firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation} from "@react-navigation/native";


const DeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDeliveries = async () => {
      const deliveriesCollection = collection(db, 'deliveries');
      const deliveryQuery = query(deliveriesCollection, orderBy('deliveryDate', 'desc')); // This line was added.
      const deliveryDocs = await getDocs(deliveryQuery); // This line was changed.
      const deliveryData = deliveryDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDeliveries(deliveryData);
      setFilteredDeliveries(deliveryData);
    };

    fetchDeliveries();
  }, []);

  useEffect(() => {
    setFilteredDeliveries(
      deliveries.filter(item =>
        item.deliveryProject.toLowerCase().includes(search.toLowerCase()) ||
        item.deliveryVendor.toLowerCase().includes(search.toLowerCase()) ||
        item.deliveryNotes.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);


  const handleBack = () => {
    navigation.goBack()
  }

  const renderDelivery = ({ item }) => (
    <View style={styles.deliveryItem}>
      <Text style={{...styles.itemText, fontWeight: 700, fontSize: 18, color: '#FFC300' }}>{new Date(item.deliveryDate.seconds * 1000).toDateString()}</Text>
      <Text style={styles.itemText}>{item.deliveryProject}</Text>
      <Text style={styles.itemText}>{item.deliveryVendor}</Text>
      <Text style={styles.itemText}>{item.deliveryNotes}</Text>
      <Text style={styles.itemText}>{item.deliveryStatus}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back-outline" size={25} color={'black'} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Delivery History</Text>
      <TextInput
        value={search}
        onChangeText={text => setSearch(text)}
        placeholder="Search by project"
        style={styles.input}
      />
      <FlatList
        data={filteredDeliveries}
        renderItem={renderDelivery}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 30,
    top: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 5,
    fontWeight: '600',
  },
  deliveryItem: {
    backgroundColor: '#ddd',
    marginBottom: 10,
    padding: 20,
    width: 275,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Helvetica Neue',
    marginVertical: 5,
  },
  input: {
    height: 40,
    width: 275,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  }
});

export default DeliveryHistory;

