import React, { useEffect, useState } from 'react';
import { Alert, Modal, View, Text, StyleSheet, Button, TextInput } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {useAuth} from "../auth/AuthContext";
import { collection, onSnapshot, query, where, addDoc} from 'firebase/firestore'
import { db } from '../../firebase/Firebase';

const CalendarModal = ({ isVisible, onClose, onSubmit }) => {
  const { orgId } = useAuth();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [isAddNewModalVisible, setIsAddNewModalVisible] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    if (!orgId) return;

    const q = query(collection(db, "Projects"), where("orgId", "==", orgId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projects = querySnapshot.docs.map(doc => ({
        label: doc.data().description,
        value: doc.id
      }));

      // Always include the "Add New" option and sort the rest alphabetically
      const sortedProjects = [
        { label: 'Add New+', value: 'add_new' },
        ...projects.sort((a, b) => a.label.localeCompare(b.label))
      ];

      setItems(sortedProjects);
    });

    return () => unsubscribe();
  }, [orgId]);

  const handleValueChange = (itemValue) => {
    if (itemValue === 'add_new') {
      // Show the "Add New" modal
      setOpen(false);
      setIsAddNewModalVisible(true);
    } else {
      setValue(itemValue);
    }
  };

  const handleAddNewItem = async () => {
    if (newProjectName.trim()) {
      // Add the new project to Firebase
      try {
        await addDoc(collection(db, 'Projects'), {
          orgId: orgId,
          description: newProjectName // Modify this as per your data structure
        });

        setNewProjectName('');
        setIsAddNewModalVisible(false);
        setValue(null); // Reset the selected value to null
      } catch (error) {
        console.error('Error adding document: ', error);
        // Handle the error appropriately (e.g., show an error message to the user)
      }
    }
  };

  const handleCancelNewItem = () => {
    setNewProjectName(''); // Clear any entered but not submitted text
    setIsAddNewModalVisible(false); // Close the modal
    setValue(null); // Reset the selected value to avoid reopening the modal for 'add_new'
    setOpen(false); // Optionally ensure the dropdown is closed
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Choose a Project</Text>
          <DropDownPicker
            open={open}
            value={value}
            items={[...items]}
            setOpen={setOpen}
            setValue={setValue}
            onChangeValue={handleValueChange}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} color="red" />
            <Button title="Submit" onPress={() => onSubmit(value)} />
          </View>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isAddNewModalVisible}
        onRequestClose={handleCancelNewItem}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="New project name"
              value={newProjectName}
              onChangeText={setNewProjectName}
              autoFocus={true}
            />
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={handleCancelNewItem} color="#999" />
              <Button title="Add" onPress={handleAddNewItem} />
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  dropdown: {
    minWidth: '100%',
    height: 40,
  },
  dropdownContainer: {
    minWidth: '100%',
    zIndex: 1000,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default CalendarModal;

