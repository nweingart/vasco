import React, { useEffect, useState } from 'react';
import {Platform, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from "@expo/vector-icons/Ionicons";

const MyDatePicker = ({ onConfirm, color, current }) => {
  const [date, setDate] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());
  const [show, setShow] = useState(false);

  useEffect(() => {
    setDate(current);
    setTempDate(current || new Date());
  }, [current]);

  const onChange = (event, selectedDate) => {
    setTempDate(selectedDate || tempDate);
  };

  const confirmDate = () => {
    setDate(tempDate);
    onConfirm(tempDate);
    setShow(false);
  };

  const showDatepicker = () => {
    setShow(true);
  };


  return (
    <View style={{ borderRadius: 10, borderWidth: 2, borderColor: 'black', marginVertical:10, marginRight: 25 }}>
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
          <View style={{ marginLeft: -47.5}}>
            <DateTimePicker
              testID="dateTimePicker"
              value={tempDate}
              mode='date'
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
              style={{backgroundColor: 'white'}}
            />
            <TouchableOpacity style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', width: 75, height: 40, marginLeft: 135, marginTop: 10, marginBottom: 10, borderRadius: 10}} onPress={confirmDate}>
              <Text style={{ color: 'white'}}>Confirm</Text>
            </TouchableOpacity>
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
    borderRadius: 7.5,
  },
  calendarIcon: {
    marginLeft: 25,
  },
  calendarText: {
    fontSize: 14,
    marginLeft: 75,
    fontWeight: 500,
    marginTop: 5,
  }
})

export default MyDatePicker
