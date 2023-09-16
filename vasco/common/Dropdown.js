import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from "@expo/vector-icons/Ionicons";

const screenWidth = Dimensions.get('window').width;
const isTablet = screenWidth >= 768;

const DropdownModal = ({
   data,
   defaultText,
   onValueChange,
   label,
   icon,
   required
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [items, setItems] = useState(data.map(item => ({ label: item, value: item })));

  const handleChange = (value) => {
    console.log('Received value:', value);
    setSelectedValue(value);
    setModalVisible(false);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  const displayText = selectedValue || defaultText;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {required && !selectedValue && <Ionicons name={'medical'} size={15} color={'red'} style={{ marginLeft: -20, marginRight: 10 }} />}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Ionicons name={icon} size={25} color={'black'} style={styles.iconStyle} />
          <Text style={styles.buttonText}>{displayText}</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={30} color="black" />
            </TouchableOpacity>
            {label && <Text style={styles.label}>{label}</Text>}
            <DropDownPicker
              open={dropdownOpen}
              value={selectedValue}
              items={items}
              setOpen={setDropdownOpen}
              setValue={(callback) => {
                const value = callback(items);
                handleChange(value);
              }}
              setItems={setItems}
              searchable={true}
              placeholder={defaultText}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: isTablet ? 65 : 25,
    width: isTablet ? '60%' : '90%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    marginVertical: isTablet ? 20 : 10,
    backgroundColor: '#FFC300',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 25,
  },
  buttonText: {
    fontWeight: '500',
    fontSize: isTablet ? 18 : 14,
  },
  iconStyle: {
    position: 'absolute',
    left: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    alignItems: 'center',
    backgroundColor: 'white',
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2,
  },
  closeButtonText: {
    fontSize: 24,
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default DropdownModal;
