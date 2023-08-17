import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Image } from 'react-native';
import { db, auth } from "../../firebase/Firebase";
import { collection, getDocs, query, orderBy, where, startAfter } from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setStatusFilter, setStartDateFilter, setEndDateFilter } from "../../redux/redux";

const DeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [search, setSearch] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);


  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userEmail = auth.currentUser.email;
  const startDate = useSelector(state => state.startDateFilter);
  const endDate = useSelector(state => state.endDateFilter);
  const status = useSelector(state => state.statusFilter);

  const fetchDeliveries = async (lastDoc = null) => {
    let deliveryQuery = query(
      collection(db, 'deliveries'),
      where('email', '==', userEmail),
      orderBy('deliveryDate', 'desc')
    );

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      deliveryQuery = query(
        deliveryQuery,
        where('deliveryDate', '>=', start),
        where('deliveryDate', '<=', end)
      );
    }

    if (status) {
      deliveryQuery = query(deliveryQuery, where('deliveryStatus', '==', status));
    }

    if (lastDoc) {
      deliveryQuery = query(deliveryQuery, startAfter(lastDoc));
    }

    const deliveryDocs = await getDocs(deliveryQuery);
    const deliveryData = deliveryDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    setLastVisibleDoc(deliveryDocs.docs[deliveryDocs.docs.length - 1]);
    if (lastDoc) {
      setDeliveries(prev => [...prev, ...deliveryData]);
    } else {
      setDeliveries(deliveryData);  // reset the deliveries list if not paginating
    }
  };



  useEffect(() => {
    setDeliveries([]); // Clear the current deliveries
    fetchDeliveries(); // Fetch deliveries with the new filters
  }, [startDate, endDate, status]);

  useEffect(() => {
    if (search) {
      const filtered = deliveries.filter(item =>
        item.deliveryProject?.toLowerCase().includes(search.toLowerCase()) ||
        item.deliveryVendor?.toLowerCase().includes(search.toLowerCase()) ||
        item.deliveryNotes?.toLowerCase().includes(search.toLowerCase())
      );

      setDeliveries(filtered);
    } else {
    }
  }, [search]);

  const handleLoadMore = async () => {
    if (lastVisibleDoc) {
      setLoadingMore(true);
      await fetchDeliveries(lastVisibleDoc);
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    fetchDeliveries()
  };

  const handleBack = () => {
    navigation.goBack()
  }

  const handleFilter = () => {
    navigation.navigate('Filter')
  }

  const handleSearchChange = (text) => {
    setSearch(text);

    if (!text) {
      setFilteredDeliveries(deliveries);
      return;
    }

    const searchTerm = text.toLowerCase();
    const filtered = deliveries.filter(delivery => {
      return delivery.notes && delivery.notes.toLowerCase().includes(searchTerm);
    });

    setFilteredDeliveries(filtered);
  };

  useEffect(() => {
    setFilteredDeliveries(deliveries);
  }, [deliveries]);

  const renderDelivery = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('EditDetail', { delivery: item })}>
      <View style={styles.deliveryCardContainer}>
        <View style={styles.deliveryCard}>
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
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={handleBack} style={{ marginTop: 20}}>
          <Ionicons name="arrow-back-outline" size={35} color={'black'} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Delivery History</Text>
      <View style={styles.searchContainer}>
        <View style={styles.leftIconContainer}>
          <Ionicons name="search" size={35} color={'black'} />
        </View>
        <TextInput
          value={search}
          onChangeText={handleSearchChange}
          placeholder="Search"
          style={styles.input}
        />
        <View style={styles.clearSearchContainer}>
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons name="close-circle" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.rightIconContainer}>
          <TouchableOpacity onPress={handleFilter}>
            <View style={{ backgroundColor:'white', borderRadius: 5 }}>
              <Ionicons name="options" size={35} color={endDate || startDate || status ? '#FFC300' : 'black'} />
            </View>
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
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          return (loadingMore && lastVisibleDoc) ? <ActivityIndicator size="small" color="#0000ff" /> : null;
        }}
      />
    </View>
  );
};

export default DeliveryHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0', // Feed background color
    padding: 15,
  },
  backButtonContainer: {
    marginTop: 20,  // Moving down the back button
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20  // Added margin bottom to give space under the title
  },
  deliveryCardContainer: {
    marginBottom: 10  // This gives some space between the cards
  },
  deliveryCard: {  // This is the style for the white card
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5  // This will give shadow on Android
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 5,
    paddingLeft: 10, // Added this for left spacing
    borderRadius: 5,
    backgroundColor: '#E8E8E8',
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 10,
    paddingLeft: 10, // Added this for spacing after the search icon
    borderRadius: 5,
  },
  leftIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 5, // Added this for spacing after the search icon
  },
  clearSearchContainer: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIconContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  filterBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#E8E8E8',
    borderRadius: 15,
    padding: 5,
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  deliveryItem: {
    marginBottom: 15,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 5,
  },
});
