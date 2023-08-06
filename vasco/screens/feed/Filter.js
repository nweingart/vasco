import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {useDispatch, useSelector} from "react-redux";
import { useNavigation } from "@react-navigation/native";
import DatePicker from "../../common/DatePicker";
import { setStartDateFilter, setEndDateFilter, setStatusFilter } from "../../redux/redux";

const Filter = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const statusFilter = useSelector(state => state.statusFilter);  // Add this line

  const [status, setStatus] = useState(statusFilter || '');  // Initialize to current filter

  const startDate = useSelector(state => state.startDateFilter);
  const endDate = useSelector(state => state.endDateFilter);

  const handleSave = () => {
    dispatch(setStatusFilter(status));
    navigation.goBack();
  }

  const handleBack = () => {
    navigation.goBack();
  }

  const handleStartDateConfirm = date => {
    dispatch(setStartDateFilter(date));
  };

  const handleEndDateConfirm = date => {
    if (date <= startDate) {
      alert("End Date must be after Start Date.");
    } else {
      dispatch(setEndDateFilter(date));
    }
  }

  const setApprovedOpacity = () => {
    if ( status === 'Approved'){
      return 1
    } else {
      return 0.5
    }
  }

  const setNotApprovedOpacity = () => {
    if ( status === 'Not Approved'){
      return 1
    } else {
      return 0.5
    }
  }


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
        <DatePicker color={'white'} onConfirm={handleStartDateConfirm} current={startDate} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>End</Text>
        <DatePicker color={'white'} onConfirm={handleEndDateConfirm} current={endDate} />
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status</Text>
        <View style={styles.statusOptionsContainer}>
          <TouchableOpacity style={{ ...styles.statusOptionButton, backgroundColor: '#40D35D', opacity: setApprovedOpacity()}} onPress={() => setStatus('Approved')}>
            <Text style={{ ...styles.statusOption, color: 'white'}}>Approved</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ ...styles.statusOptionButton, backgroundColor: '#FF0A0A', opacity: setNotApprovedOpacity()}} onPress={() => setStatus('Not Approved')}>
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
    backgroundColor: '#FFC300',
  },
  buttonText: {
    color: 'black',
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
