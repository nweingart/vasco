import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';
import DatePickerAndroid from '../../utils/DatePickerAndroid'
import DatePickerIOS from '../../utils/DatePickerIOS'

const CalendarModal = ({ isVisible, onClose, onSubmit }) => {
  const [vendor, setVendor] = useState('');
  const [material, setMaterial] = useState('');
  const [date, setDate] = useState(new Date());

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleSubmit = () => {
    onSubmit({ vendor, material, deliveryDate: date.toISOString().split('T')[0] });
    setVendor('');
    setMaterial('');
    setDate(new Date());
  };

  const DatePicker = Platform.OS === 'ios' ? DatePickerIOS : DatePickerAndroid;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Delivery</Text>
          <TextInput
            style={styles.input}
            onChangeText={setVendor}
            value={vendor}
            placeholder="Vendor"
          />
          <TextInput
            style={styles.input}
            onChangeText={setMaterial}
            value={material}
            placeholder="Material Name"
          />
          <DatePicker
            date={date}
            onDateChange={handleDateChange}
          />
          <View style={styles.buttonContainer}>
            <Button title="Submit" onPress={handleSubmit} />
            <Button title="Cancel" onPress={onClose} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
});

export default CalendarModal
