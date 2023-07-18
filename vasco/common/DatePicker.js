import React, { useState } from 'react'
import {Platform, View, Button, Text, TouchableOpacity, StyleSheet } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import Ionicons from "@expo/vector-icons/Ionicons"

const MyDatePicker = ({ onConfirm }) => {
  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setTempDate(selectedDate || date);
  };

  const confirmDate = () => {
    setDate(tempDate);
    onConfirm(tempDate)
    setShow(false);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View style={{ borderRadius: 10, borderWidth: 2, borderColor: 'black', marginVertical:15, marginRight: 25 }}>
      <TouchableOpacity onPress={showDatepicker}  style={styles.container}>
        <View style={styles.calendarIcon}>
          <Ionicons
            name="calendar-outline"
            size={25}
            color="black"
          />
        </View>
        {show ? (
          <View>
            <DateTimePicker
              testID="dateTimePicker"
              value={tempDate}
              mode='date'
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
              style={{backgroundColor: 'white'}}
            />
            <Button onPress={confirmDate} title="Confirm" color={'black'} />
          </View>
        ) : (
          <Text style={styles.calendarText}>{date.toDateString()}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFC300',
    borderRadius: 7.5,
  },
  calendarIcon: {
    marginLeft: 25,
  },
  calendarText: {
    fontSize: 16,
    marginRight: 85,
    fontWeight: 500,
    marginTop: 5,
  }
})

export default MyDatePicker
