import React, { useState } from 'react'
import { Modal, View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native'
import DatePickerAndroid from '../../utils/DatePickerAndroid'
import DatePickerIOS from '../../utils/DatePickerIOS'
import { useAuth } from "../auth/AuthContext"
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../firebase/Firebase'

const CalendarModal = ({ isVisible, onClose, onSubmit }) => {
  const [vendor, setVendor] = useState('')
  const [project, setProject] = useState('')
  const [material, setMaterial] = useState('')
  const [subcontractor, setSubcontractor] = useState('')
  const [user, setUser] = useState('')
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState(new Date())
  const { orgId } = useAuth()

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate)
  };

  const handleSubmit = async () => {
    const newDelivery = {
      project,
      vendor,
      material,
      subcontractor,
      user,
      notes,
      deliveryDate: date.toISOString().split('T')[0],
      orgId
    };

    try {
      const docRef = await addDoc(collection(db, 'ScheduledDeliveries'), newDelivery);
      onSubmit({ ...newDelivery, deliveryId: docRef.id });
      setProject('');
      setVendor('');
      setMaterial('');
      setSubcontractor('');
      setDate(new Date());
      setUser('');
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Error adding delivery:', error);
      // Handle error appropriately
    }
  };

  const handleCancel = () => {
    setProject('');
    setVendor('');
    setMaterial('');
    setSubcontractor('');
    setDate(new Date());
    setUser('');
    setNotes('');
    onClose();
  }


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
            onChangeText={setProject}
            value={project}
            placeholder="Project"
          />
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
            placeholder="Material Description"
          />
          <TextInput
            style={styles.input}
            onChangeText={setSubcontractor}
            value={subcontractor}
            placeholder="Subcontractor"
          />
          <TextInput
            style={styles.input}
            onChangeText={setUser}
            value={user}
            placeholder="User"
          />
          <TextInput
            style={styles.input}
            onChangeText={setNotes}
            value={notes}
            placeholder="Notes"
          />
          <DatePicker
            date={date}
            onDateChange={handleDateChange}
          />
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={handleCancel} color="red" />
            <Button title="Submit" onPress={handleSubmit} />
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
    height: '100%',
  },
  modalView: {
    width: '100%',
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
    width: '90%',
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
