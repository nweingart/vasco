import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { setStatusFilter, setDateFiler } from "../../redux/redux";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const Filter = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleSave = () => {
    dispatch(setStatusFilter(status));
    dispatch(setDateFiler({ startDate, endDate }));
    navigation.goBack();
  }

  const handleBack = () => {
    navigation.goBack();
  }

  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Start</Text>
        <TextInput
          style={styles.input}
          value={startDate}
          onChangeText={setStartDate}
          placeholder="Enter Start Date"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>End</Text>
        <TextInput
          style={styles.input}
          value={endDate}
          onChangeText={setEndDate}
          placeholder="Enter End Date"
        />
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status</Text>
        <View style={styles.statusOptionsContainer}>
          <TouchableOpacity style={styles.statusOptionButton} onPress={() => setStatus('Approved')}>
            <Text style={{ ...styles.statusOption, color: 'white'}}>Approved</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statusOptionButton, {backgroundColor: 'red'}]} onPress={() => setStatus('Not Approved')}>
            <Text style={{ ...styles.statusOption, color: 'white'}}>Not Approved</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 30,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#3A86FF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  statusContainer: {
    marginTop: 20,
  },
  statusLabel: {
    fontSize: 16,
    marginBottom: 15,
  },
  statusOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusOptionButton: {
    flex: 0.45,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    alignItems: 'center',
  },
  statusOption: {
    fontSize: 16,
  },
})

export default Filter;
