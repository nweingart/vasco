import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import DatePicker from "../../common/DatePicker";
import { setStartDateFilter, setEndDateFilter, setStatusFilter } from "../../redux/redux";

const screenWidth = Dimensions.get('window').width;
const isTablet = screenWidth >= 768;

const Filter = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const statusFilter = useSelector(state => state.statusFilter);
  const startDateFilter = useSelector(state => state.startDateFilter);
  const endDateFilter = useSelector(state => state.endDateFilter);

  const [status, setStatus] = useState(statusFilter || '');
  const [startDate, setStartDate] = useState(startDateFilter || null);
  const [endDate, setEndDate] = useState(endDateFilter || null);

  const [startDateModalVisible, setStartDateModalVisible] = useState(false);
  const [endDateModalVisible, setEndDateModalVisible] = useState(false);

  const toggleStartDateModal = () => {
    setStartDateModalVisible(!startDateModalVisible);
  };

  const toggleEndDateModal = () => {
    setEndDateModalVisible(!endDateModalVisible);
  };

  const handleSave = () => {
    dispatch(setStatusFilter(status));
    dispatch(setStartDateFilter(startDate));
    dispatch(setEndDateFilter(endDate));
    navigation.goBack();
  }

  const handleBack = () => {
    navigation.goBack();
  }

  const handleStartDateConfirm = date => {
    setStartDate(date);
    toggleStartDateModal();
  };

  const handleEndDateConfirm = date => {
    if (date <= startDate) {
      alert("End Date must be after Start Date.");
    } else {
      setEndDate(date);
      toggleEndDateModal();
    }
  }

  const setApprovedOpacity = () => {
    if (status === 'Approved'){
      return 1;
    } else {
      return 0.5;
    }
  }

  const setNotApprovedOpacity = () => {
    if (status === 'Not Approved'){
      return 1;
    } else {
      return 0.5;
    }
  }

  const handleClearFilters = () => {
    setStatus('');
    setStartDate(null);
    setEndDate(null);
    dispatch(setStatusFilter(''));
    dispatch(setStartDateFilter(null));
    dispatch(setEndDateFilter(null));
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={toggleStartDateModal}>
          <Text style={{ fontSize: 24, fontWeight: 'bold'}}>{startDate ? `Start Date: ${ startDate.toDateString() }` : "Select Start Date"}</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={startDateModalVisible}
          onRequestClose={toggleStartDateModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <DatePicker color={'white'} onConfirm={handleStartDateConfirm} current={startDate} />
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={toggleEndDateModal}>
          <Text style={{ fontSize: 24, fontWeight: 'bold'}}>{endDate ? `End Date: ${ endDate.toDateString() }` : "Select End Date"}</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={endDateModalVisible}
          onRequestClose={toggleEndDateModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <DatePicker color={'white'} onConfirm={handleEndDateConfirm} current={endDate} />
            </View>
          </View>
        </Modal>
      </View>
      <View>
        <Text style={styles.statusLabel}>Status</Text>
        <View style={styles.statusOptionsContainer}>
          <TouchableOpacity style={{ ...styles.statusOptionButton, backgroundColor: '#40D35D', opacity: setApprovedOpacity() }} onPress={() => setStatus('Approved')}>
            <Text style={{ ...styles.statusOption, color: 'white' }}>Approved</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ ...styles.statusOptionButton, backgroundColor: '#FF0A0A', opacity: setNotApprovedOpacity() }} onPress={() => setStatus('Not Approved')}>
            <Text style={{ ...styles.statusOption, color: 'white' }}>Not Approved</Text>
          </TouchableOpacity>
        </View>
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={{ ...styles.button, width: isTablet ? '60%' : '90%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20 }} onPress={handleClearFilters}>
            <Text style={styles.buttonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
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
  statusLabel: {
    fontSize: 16,
    marginBottom: 15,
  },
  statusOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  statusOptionButton: {
    flex: 0.45,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    alignItems: 'center',
   height: isTablet ? 40 : 40,
  },
  statusOption: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20
  },
  closeButton: {
    position: 'absolute',
    top: '90%',
    right: 10,
  },
})

export default Filter;
