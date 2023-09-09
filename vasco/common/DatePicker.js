import React, { useEffect, useState } from 'react';
import { Platform, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from "@expo/vector-icons/Ionicons";

const screenWidth = Dimensions.get('window').width;
const isTablet = screenWidth >= 768;

const DatePicker = ({ onConfirm, color, current }) => {
  const [date, setDate] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());
  const [show, setShow] = useState(false);

  useEffect(() => {
    setDate(current);
    setTempDate(current || new Date());
  }, [current]);

  const onChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set') {
        confirmDate(selectedDate);
        console.log("Selected date (Android):", selectedDate); // Debugging line
      }
      setShow(false);
    } else {
      setTempDate(selectedDate || tempDate);
      console.log("Temp date (iOS):", selectedDate || tempDate); // Debugging line
    }
  };


  const confirmDate = (newDate = tempDate) => {
    setDate(newDate);
    onConfirm(newDate);
    if (Platform.OS === 'ios') setShow(false);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View style={{ height: isTablet ? 45 : 25, width: isTablet ? '60%' : '90%', borderRadius: 10, borderWidth: 2, borderColor: 'black', marginVertical:10 }}>
      <TouchableOpacity onPress={showDatepicker}  style={{...styles.container, backgroundColor: color}}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {!date && <Ionicons name="medical" size={15} color="red" style={{ marginLeft: 5, marginRight: 5 }} />}
          <View style={{ marginLeft: !date ? 0 : 25}}>
            <Ionicons
              name="calendar-outline"
              size={25}
              color="black"
            />
          </View>
        </View>
        {show ? (
          <View style={{ zIndex: 10, marginLeft: isTablet ? '15%' : -47.5, marginTop: isTablet ? '10%' : 0}}>
            <DateTimePicker
              testID="dateTimePicker"
              value={tempDate}
              mode='date'
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
              style={{backgroundColor: 'white'}}
              transform={ isTablet ? [{ scale: 1.25 }] : undefined}
            />
            {
              Platform.OS === 'ios' ?
                <TouchableOpacity
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', width: 75, height: 40, marginLeft: 135, marginTop: 10, marginBottom: 10, borderRadius: 10}}
                  onPress={() => confirmDate(tempDate)}>
                  <Text style={{ color: 'white'}}>Confirm</Text>
                </TouchableOpacity>  : null
            }
          </View>
        ) : (
          <Text style={styles.calendarText}>{date ? date.toDateString() : "Select Date"}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: isTablet ? 10 : 7.5,
    height: isTablet ? 41 : 25,
    zIndex: 10,
  },
  calendarIcon: {
    marginLeft: isTablet ? 35 : 25,
  },
  calendarText: {
    fontSize: isTablet ? 18 : 14,
    marginLeft: isTablet ? 200 : 75,
    fontWeight: '500',
    marginTop: isTablet ? 7 : 5,
  }
})

export default DatePicker;

