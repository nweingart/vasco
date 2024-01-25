import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CalendarModal from './CalendarModal';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/Firebase';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment-timezone';
import { useAuth } from "../auth/AuthContext";

const CalendarComponent = () => {
  const [selectedDay, setSelectedDay] = useState(getCurrentDate());
  const [markedDates, setMarkedDates] = useState(getMarkedDates());
  const [deliveries, setDeliveries] = useState({});
  const navigation = useNavigation();
  const { orgId } = useAuth();

  console.log(orgId)

  const navigateToPhotoBackup = (vendor, subcontractor, project, deliveryId) => {
    navigation.navigate('PhotoBackup', { deliveryData: {
        vendor,
        subcontractor,
        project,
        deliveryId,
      }});
  };


  useEffect(() => {
    let unsubscribe = () => {};

    console.log(orgId)

    if (orgId) {
      const queryRef = query(collection(db, 'ScheduledDeliveries'), where('orgId', '==', orgId));

      unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
        let newDeliveries = {};

        querySnapshot.forEach((doc) => {
          const data = { ...doc.data(), deliveryId: doc.id, isSubmitted: false };
          const estDate = moment(data.deliveryDate).tz('America/New_York').format('YYYY-MM-DD');
          if (newDeliveries[estDate]) {
            newDeliveries[estDate].push(data);
          } else {
            newDeliveries[estDate] = [data];
          }
        });

        setDeliveries(newDeliveries);
        setMarkedDates(getMarkedDates(newDeliveries));
      }, (error) => {
        console.error('Error fetching deliveries:', error);
      });
    }

    return () => unsubscribe()
  }, [orgId])

  useEffect(() => {
    setMarkedDates(getMarkedDates());
  }, [deliveries]);

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getMarkedDates() {
    let markedDates = {};
    const today = getCurrentDate();

    for (let date in deliveries) {
      markedDates[date] = {
        dots: [{ color: '#FFC300', selectedDotColor: 'white' }],
        marked: true,
        selected: date === selectedDay,
        selectedColor: date === selectedDay ? '#FFC300' : undefined
      };
    }

    if (!markedDates[today]) {
      markedDates[today] = {
        selected: true,
        selectedColor: 'gray'
      };
    }

    return markedDates;
  }

  function updateMarkedDates(newSelectedDay) {
    const updatedMarkedDates = { ...getMarkedDates(deliveries) };

    Object.keys(updatedMarkedDates).forEach((key) => {
      updatedMarkedDates[key] = {
        ...updatedMarkedDates[key],
        selected: key === newSelectedDay
      };
    });

    if (updatedMarkedDates[newSelectedDay]) {
      updatedMarkedDates[newSelectedDay].selectedColor = '#FFC300';
    } else {
      updatedMarkedDates[newSelectedDay] = {
        selected: true,
        selectedColor: '#FFC300'
      };
    }

    setMarkedDates(updatedMarkedDates);
  }

  const onDayPress = (day) => {
    setSelectedDay(day.dateString);
    updateMarkedDates(day.dateString);
  };

  const [isModalVisible, setModalVisible] = useState(false);

  const handleAddEvent = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleModalSubmit = (newDelivery) => {
    setModalVisible(false);
  };

  /*const handleModalSubmit = (newDelivery) => {
    console.log("Before update:", deliveries);

    setDeliveries(prevDeliveries => {
      const estDate = moment(newDelivery.deliveryDate).tz('America/New_York').format('YYYY-MM-DD');
      const updatedDeliveries = { ...prevDeliveries };

      if (updatedDeliveries[estDate]) {
        updatedDeliveries[estDate] = [...updatedDeliveries[estDate], newDelivery];
      } else {
        updatedDeliveries[estDate] = [newDelivery];
      }

      console.log("After update:", updatedDeliveries);
      return updatedDeliveries;
    });

    updateMarkedDates(newDelivery.deliveryDate);
    setModalVisible(false);
  };

   */



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Calendar</Text>
      <CalendarModal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
      <Calendar
        current={getCurrentDate()}
        onDayPress={onDayPress}
        monthFormat={'MMMM yyyy'}
        hideExtraDays={true}
        markingType={'multi-dot'}
        markedDates={markedDates}
        style={styles.calendarStyle}
        theme={styles.calendarTheme}
      />
      <ScrollView style={styles.eventsContainer}>
        {deliveries[selectedDay] && deliveries[selectedDay].length > 0 ? (
          deliveries[selectedDay].map((event, index) => (
            <TouchableOpacity
              onPress={event.isSubmitted ? null : () => navigateToPhotoBackup(event.vendor, event.subcontractor, event.project, event.deliveryId)}
              style={styles.eventItem}
              key={index}
            >
              <View style={{ flex: 1 }}>
                <View style={{ display: 'flex', flexDirection: 'column'}}>
                  <Text style={styles.eventText}>
                    {event.vendor}
                  </Text>
                  <Text style={styles.eventText}>
                    {event.material}
                  </Text>
                  <Text style={styles.eventText}>
                    {event.project}
                  </Text>
                  <Text style={styles.eventText}>
                    {event.notes}
                  </Text>
                  <View style={{ display: 'flex', flexDirection: 'row'}}>
                    <Text style={styles.eventText}>
                      {event.subcontractor}
                    </Text>
                    <Text style={styles.eventText}>
                      {event.user}
                    </Text>
                  </View>
                </View>
                {event.isSubmitted && event.status === 'Approved' && (
                  <Ionicons name="checkmark-circle-outline" size={24} color="green" />
                )}
                {event.isSubmitted && event.status === 'Not Approved' && (
                  <Ionicons name="close-circle-outline" size={24} color="red" />
                )}
              </View>
              <TouchableOpacity style={styles.cloudIcon}>
                <Ionicons name={'cloud-download-outline'} size={24} color={'#FFC300'} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noEventItem}>
            <Text style={styles.noEventText}>No Deliveries Scheduled</Text>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={handleAddEvent}>
        <Ionicons name="calendar" size={24} color="white" />
        <Text style={styles.fabIconText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 100,
    marginBottom: 40,
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  eventText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 2.5,
  },
  calendarStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  calendarTheme: {
    todayTextColor: '#FFC300',
    arrowColor: '#FFC300',
  },
  eventsContainer: {
    flex: 1,
    paddingTop: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#FFC300',
    borderRadius: 50,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    width: 80,
    height: 80,
  },
  fabIconText: {
    fontSize: 24,
    marginLeft: 5,
    color: 'white',
  },
  noEventItem: {
    alignItems: 'center',
    marginTop: 20,
  },
  noEventText: {
    color: '#666',
},
  checkIcon: {
    fontSize: 24,
      color: 'green',
  },
  closeIcon: {
    fontSize: 24,
      color: 'red',
  },
  cloudIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
})

export default CalendarComponent
