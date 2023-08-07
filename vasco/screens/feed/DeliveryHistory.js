import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { db, auth } from "../../firebase/Firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation} from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setStatusFilter, setStartDateFilter, setEndDateFilter } from "../../redux/redux";

const DeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userEmail = auth.currentUser.email;
  const startDate = useSelector(state => state.startDateFilter);
  const endDate = useSelector(state => state.endDateFilter);
  const status = useSelector(state => state.statusFilter);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const deliveriesCollection = collection(db, 'deliveries');
      const deliveryQuery = query(deliveriesCollection, where('email', '==', userEmail), orderBy('deliveryDate', 'desc'));
      const deliveryDocs = await getDocs(deliveryQuery);
      const deliveryData = deliveryDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDeliveries(deliveryData);
      setFilteredDeliveries(deliveryData);
    };

    fetchDeliveries();
  }, []);

  useEffect(() => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const deliveryStatus = status;

    let filtered = deliveries;

    if (start && end) {
      filtered = deliveries.filter(item => {
        const deliveryDate = new Date(item.deliveryDate?.seconds * 1000);
        return deliveryDate >= start && deliveryDate <= end;
      });
    }

    if (deliveryStatus) {
      filtered = filtered.filter(item => item.deliveryStatus === deliveryStatus);
    }

    setFilteredDeliveries(filtered);
  }, [startDate, endDate, status, deliveries]);

  useEffect(() => {
    const filtered = filteredDeliveries.filter(item =>
      item.deliveryProject?.toLowerCase().includes(search.toLowerCase()) ||
      item.deliveryVendor?.toLowerCase().includes(search.toLowerCase()) ||
      item.deliveryNotes?.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredDeliveries(filtered);
  }, [search]);

  const handleClearSearch = () => {
    setSearch('');
    setFilteredDeliveries(deliveries);
  };


  const handleBack = () => {
    navigation.goBack()
  }

  const handleFilter = () => {
    navigation.navigate('Filter')
  }

  const handleClearStartDate = () => {
    dispatch(setStartDateFilter(null));
  };

  const handleClearEndDate = () => {
    dispatch(setEndDateFilter(null));
  };

  const handleClearStatus = () => {
    dispatch(setStatusFilter(''));
  };

  const renderDelivery = ({ item }) => (
    <View style={styles.deliveryItem}>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={{...styles.itemText, fontWeight: '600', marginBottom: 15 }}>
          {new Date(item?.deliveryDate?.seconds * 1000).toDateString()}
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
      <ScrollView style={{ marginTop: 15}} horizontal={true} showsHorizontalScrollIndicator={false}>
        {item?.deliveryPhotoDownloadUrls.concat(item?.deliveryReceiptDownloadUrls || []).map((url, index) => (
          <Image
            key={index}
            style={{ width: 100, height: 100, marginHorizontal: 5, borderRadius: 5}}
            source={{ uri: url }}
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
        <View style={styles.clearSearchContainer}>
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons name="close-circle" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.leftIconContainer}>
          <Ionicons name="search" size={35} color={'black'} />
        </View>
        <View style={styles.rightIconContainer}>
          <TouchableOpacity onPress={handleFilter}>
            <Ionicons name="options" size={35} color={endDate || startDate || status ? '#FFC300' : 'black'} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.filterContainer}>
        <ScrollView horizontal contentContainerStyle={styles.filterBadgeContainer}>
          <Text style={styles.filterLabel}>Filters: </Text>
          {startDate && endDate && (
            <TouchableOpacity style={styles.badge} onPress={() => {dispatch(setStartDateFilter(null)); dispatch(setEndDateFilter(null))}}>
              <Text style={styles.badgeText}>🗓 {startDate.toDateString()} - {endDate.toDateString()}</Text>
              <View style={{ marginLeft: 10, marginTop: 5 }}>
                <Ionicons name={'close-circle'} size={15} color={'black'} />
              </View>
            </TouchableOpacity>
          )}
          {status && (
            <TouchableOpacity style={styles.badge} onPress={() => dispatch(setStatusFilter(null))}>
              <Text style={styles.badgeText}>📝 {status}</Text>
              <View style={{ marginLeft: 10, marginTop: 5 }}>
                <Ionicons name={'close-circle'} size={15} color={'black'} />
              </View>
            </TouchableOpacity>
          )}
        </ScrollView>
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
  filterContainer: {
    height: 90,// Sets the maximum height that the ScrollView can take
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e8e7e7',
  },
  filterLabel: {
    fontWeight: 'bold',
    marginLeft: 25,
  },
  filterBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  badge: {
    marginVertical: 5,
    height: 50,
    padding: 10,
    backgroundColor: '#FFC300',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5,
    marginLeft: 10,
  },
  badgeText: {
    marginTop: 4,
    fontSize: 14,
  },
  clearSearchContainer: {
    position: 'absolute',
    right: 60,
    top: '50%',
    transform: [{ translateY: -10 }]
  }
});

export default DeliveryHistory;

