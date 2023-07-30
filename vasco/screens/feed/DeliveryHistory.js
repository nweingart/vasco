import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image} from 'react-native';
import { db } from "../../firebase/Firebase";
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

  const handleFilter = () => {
    navigation.navigate('Filter')
  }

  const renderDelivery = ({ item }) => (
    <View style={styles.deliveryItem}>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={{...styles.itemText, fontWeight: '600', marginBottom: 15 }}>
          {new Date(item.deliveryDate.seconds * 1000).toDateString()}
        </Text>
        <View style={{ marginLeft: 150 }}>
          {item.deliveryStatus === 'Approved' ?
            <Ionicons name="checkmark-circle-outline" size={35} color={'#40D35D'} />
            : <Ionicons name="close-circle" size={35} color={'#FF0A0A'} />
          }
        </View>
      </View>
      <Text style={styles.itemText}>{item.deliveryProject}</Text>
      <Text style={styles.itemText}>{item.deliveryVendor}</Text>
      <Text style={styles.itemText}>{item.deliveryNotes}</Text>
      <Text style={styles.itemText}>{item.deliveryStatus}</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {item.deliveryPhotos.map((photoUrl, index) => (
          <Image
            key={index}
            style={{ width: 100, height: 100, marginHorizontal: 5, borderRadius: 5}}
            source={{ uri: photoUrl }}
          />
        ))}
      </ScrollView>
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
      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={text => setSearch(text)}
          placeholder="Search"
          style={styles.input}
        />
        <View style={styles.leftIconContainer}>
          <Ionicons name="search" size={35} color={'black'} />
        </View>
        <View style={styles.rightIconContainer}>
          <TouchableOpacity onPress={handleFilter}>
            <Ionicons name="options" size={35} color={'black'} />
          </TouchableOpacity>
        </View>
      </View>

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
    backgroundColor: '#e8e7e7',
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
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 20,
    width: 350,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Helvetica Neue',
    marginVertical: 5,
  },
  dateText: {
    fontWeight: '600',
    marginVertical: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 15,
    marginTop: 10,
  },
  input: {
    height: 50,
    backgroundColor: '#d0cece',
    paddingLeft: 60, // Adjust as per the size of the icon + desired spacing
    width: 350,
    fontSize: 16,// Or any width you want
  },
  leftIconContainer: {
    position: 'absolute',
    left: 15, // Desired space from the left
  },
  rightIconContainer: {
    position: 'absolute',
    right: 15, // Desired space from the left
  },
});

export default DeliveryHistory;

