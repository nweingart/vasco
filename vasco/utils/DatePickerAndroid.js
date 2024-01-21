
import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerAndroid = ({ date, onDateChange }) => {
  if (Platform.OS !== 'android') {
    return null;
  }

  return (
    <View style={styles.container}>
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          if (selectedDate) {
            onDateChange(selectedDate);
          }
        }}
        style={styles.datePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  datePicker: {
    width: '100%',
    backgroundColor: 'white',
  },
});

export default DatePickerAndroid
