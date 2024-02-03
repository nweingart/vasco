import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, Button, TextInput, Platform, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAuth } from "../auth/AuthContext";
import { collection, onSnapshot, query, where, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/Firebase';
import DatePickerIOS from "../../utils/DatePickerIOS";
import DatePickerAndroid from "../../utils/DatePickerAndroid";

const CalendarModal = ({ isVisible, onClose }) => {
  const { orgId } = useAuth();
  const [projectOpen, setProjectOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [subcontractorOpen, setSubcontractorOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [projectItems, setProjectItems] = useState([]);
  const [vendorItems, setVendorItems] = useState([]);
  const [subcontractorItems, setSubcontractorItems] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [projectValue, setProjectValue] = useState('');
  const [projectName, setProjectName] = useState('');
  const [vendorValue, setVendorValue] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [subcontractorValue, setSubcontractorValue] = useState('');
  const [subcontractorName, setSubcontractorName] = useState('');
  const [userValue, setUserValue] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddNewProjectModalVisible, setIsAddNewProjectModalVisible] = useState(false);
  const [isAddNewVendorModalVisible, setIsAddNewVendorModalVisible] = useState(false);
  const [isAddNewSubcontractorModalVisible, setIsAddNewSubcontractorModalVisible] = useState(false);
  const [isAddNewUserModalVisible, setIsAddNewUserModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');


  console.log('projectValue', projectValue)
  console.log('projectName', projectName)
  console.log('vendorValue', vendorValue)
  console.log('vendorName', vendorName)
  console.log('subcontractorValue', subcontractorValue)
  console.log('subcontractorName', subcontractorName)
  console.log('userValue', userValue)
  console.log('userName', userName)


  useEffect(() => {
    if (!orgId) return;
    const fetchItems = async () => {
      const queries = {
        Projects: setProjectItems,
        Vendors: setVendorItems,
        Subcontractors: setSubcontractorItems,
        Users: setUserItems,
      };
      Object.entries(queries).forEach(async ([collectionName, setItems]) => {
        const q = query(collection(db, collectionName), where("orgId", "==", orgId));
        onSnapshot(q, (querySnapshot) => {
          const items = querySnapshot.docs.map(doc => ({
            label: doc.data().name || doc.data().description || `${doc.data().firstName} ${doc.data().lastName}`,
            value: doc.id,
          }));
          setItems([{ label: 'Add New+', value: `add_new_${collectionName.toLowerCase()}` }, ...items]);
        });
      });
    };
    fetchItems();
  }, [orgId]);

  const handleAddNewItem = async (collectionName) => {
    if (!newItemName.trim()) {
      alert("Please enter a name.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, collectionName), {
        name: newItemName,
        orgId: orgId,
        createdAt: new Date(),
      });
      // After successful addition, close the modal and set the dropdown's value to the new item's ID
      const newItemId = docRef.id; // Get the new item's ID from the document reference
      closeModal(collectionName);
      setNewItemName(''); // Reset input field

      switch (collectionName) {
        case 'Projects':
          setProjectValue(newItemId);
          setProjectName(newItemName);
          break;
        case 'Vendors':
          setVendorValue(newItemId);
          setVendorName(newItemName);
          break;
        case 'Subcontractors':
          setSubcontractorValue(newItemId);
          setSubcontractorName(newItemName);
          break;
        case 'Users':
          setUserValue(newItemId);
          setUserName(newItemName);
          break;
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add new item. Please try again.");
    }
  };

  const closeModal = (collectionName) => {
    switch (collectionName) {
      case 'Projects':
        setIsAddNewProjectModalVisible(false);
        break;
      case 'Vendors':
        setIsAddNewVendorModalVisible(false);
        break;
      case 'Subcontractors':
        setIsAddNewSubcontractorModalVisible(false);
        break;
      case 'Users':
        setIsAddNewUserModalVisible(false);
        break;
    }
  };

  const handleClose = () => {
    // Reset all dropdown states to null or their default values
    setProjectValue(null);
    setVendorValue(null);
    setSubcontractorValue(null);
    setUserValue(null);
    setDeliveryNotes('');
    setMaterialDescription('');

    // Reset the selected date to the current date or a default value
    setSelectedDate(new Date());

    // Close any "Add New" modals that might be open
    setIsAddNewProjectModalVisible(false);
    setIsAddNewVendorModalVisible(false);
    setIsAddNewSubcontractorModalVisible(false);
    setIsAddNewUserModalVisible(false);

    // Clear any temporary new item names
    setNewItemName('');

    // Finally, call onClose to handle any additional logic needed when closing the modal
    onClose();
  };

  const renderAddNewItemModal = (category) => {
    let isModalVisible = false;
    let setModalVisible = null;
    let resetDropdownState = null;
    let placeholderText = '';

    switch (category) {
      case "Projects":
        isModalVisible = isAddNewProjectModalVisible;
        setModalVisible = setIsAddNewProjectModalVisible;
        resetDropdownState = () => setProjectValue(null);
        placeholderText = 'Enter new project name';
        break;
      case "Vendors":
        isModalVisible = isAddNewVendorModalVisible;
        setModalVisible = setIsAddNewVendorModalVisible;
        resetDropdownState = () => setVendorValue(null);
        placeholderText = 'Enter new vendor name';
        break;
      case "Subcontractors":
        isModalVisible = isAddNewSubcontractorModalVisible;
        setModalVisible = setIsAddNewSubcontractorModalVisible;
        resetDropdownState = () => setSubcontractorValue(null);
        placeholderText = 'Enter new subcontractor name';
        break;
      case "Users":
        isModalVisible = isAddNewUserModalVisible;
        setModalVisible = setIsAddNewUserModalVisible;
        resetDropdownState = () => setUserValue(null);
        placeholderText = 'Enter new user name';
        break;
    }

    return (
      <Modal
        visible={isModalVisible}
        onRequestClose={handleClose}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder={placeholderText}
              onChangeText={setNewItemName}
              value={newItemName}
            />
            <View style={styles.buttonContainerModal}>
              <Button title="Cancel" onPress={handleClose} color="#999" />
              <Button title="Add" onPress={() => {
                handleAddNewItem(category);
                setNewItemName('');
              }} />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const handleProjectChange = (value) => {
    // Check if 'Add New+' option was selected
    if (value === 'add_new_projects') {
      setIsAddNewProjectModalVisible(true);
    } else {
      const selectedItem = projectItems.find(item => item.value === value);
      if (selectedItem) {
        setProjectValue(selectedItem.value);
        setProjectName(selectedItem.label);
      } else {
        // Reset if item not found (fallback, ideally shouldn't happen)
        setProjectValue('');
        setProjectName('');
      }
    }
  };


  const handleVendorChange = (value) => {
    if (value === 'add_new_vendors') {
      setIsAddNewVendorModalVisible(true);
    } else {
      const selectedItem = vendorItems.find(item => item.value === value);
      if (selectedItem) {
        setVendorValue(selectedItem.value);
        setVendorName(selectedItem.label);
      } else {
        setVendorValue('');
        setVendorName('');
      }
    }
  };

  const handleSubcontractorChange = (value) => {
    if (value === 'add_new_subcontractors') {
      setIsAddNewSubcontractorModalVisible(true);
    } else {
      const selectedItem = subcontractorItems.find(item => item.value === value);
      if (selectedItem) {
        setSubcontractorValue(selectedItem.value);
        setSubcontractorName(selectedItem.label);
      } else {
        setSubcontractorValue('');
        setSubcontractorName('');
      }
    }
  };

  const handleUserChange = (value) => {
    if (value === 'add_new_users') {
      setIsAddNewUserModalVisible(true);
    } else {
      const selectedItem = userItems.find(item => item.value === value);
      if (selectedItem) {
        setUserValue(selectedItem.value);
        setUserName(selectedItem.label);
      } else {
        setUserValue('');
        setUserName('');
      }
    }
  };



  const handleSubmit = async () => {
    // Prepare the document data
    const deliveryData = {
      deliveryDate: selectedDate.toISOString(), // Convert date to ISO string format
      logged: false,
      material: materialDescription,
      notes: deliveryNotes,
      orgId: orgId,
      project: projectName,
      subcontractor: subcontractorName,
      vendor: vendorName,
      user: userName,
    };

    try {
      // Add a new document in collection "ScheduledDeliveries"
      await addDoc(collection(db, "ScheduledDeliveries"), deliveryData);
      alert("Delivery scheduled successfully!");
      handleClose();
    } catch (error) {
      console.error("Error scheduling delivery: ", error);
      alert("Failed to schedule delivery. Please try again.");
    }
  };


  return (
    <Modal style={{ height: '100%', width: '100%' }} presentationStyle={'fullScreen'} animationType="slide"  visible={isVisible} onRequestClose={handleClose}>
      <View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Delivery Details</Text>
            <DropDownPicker
              placeholder={"Select Project"}
              style={{
                marginVertical: 10,
                height: 40, // Reduced height
                backgroundColor: '#fafafa',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 5
              }}
              dropDownContainerStyle={{
                borderColor: '#ddd',
                borderWidth: 1,
                borderRadius: 5,
              }}
              labelStyle={{
                fontSize: 14, // Reduced font size for the label
                textAlign: 'left',
              }}
              open={projectOpen}
              value={projectValue}
              items={projectItems}
              setOpen={setProjectOpen}
              setValue={setProjectValue}
              onChangeValue={handleProjectChange}
            />
            {projectOpen ? <View style={{ height: 40, marginVertical: 10 }} /> : (
              <DropDownPicker
                placeholder={"Select Vendor"}
                style={{
                  marginVertical: 10,
                  height: 40, // Reduced height
                  backgroundColor: '#fafafa',
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 5
                }}
                dropDownContainerStyle={{
                  borderColor: '#ddd',
                  borderWidth: 1,
                  borderRadius: 5,
                }}
                labelStyle={{
                  fontSize: 14, // Reduced font size for the label
                  textAlign: 'left',
                }}
                open={vendorOpen}
                value={vendorValue}
                items={vendorItems}
                setOpen={setVendorOpen}
                setValue={setVendorValue}
                onChangeValue={handleVendorChange}
              />
            )}
            {projectOpen || vendorOpen ? <View style={{ height: 40, marginVertical: 10 }} /> : (
              <DropDownPicker
                placeholder={"Select Subcontractor"}
                style={{
                  marginVertical: 10,
                  height: 40, // Reduced height
                  backgroundColor: '#fafafa',
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 5
                }}
                dropDownContainerStyle={{
                  borderColor: '#ddd',
                  borderWidth: 1,
                  borderRadius: 5,
                }}
                labelStyle={{
                  fontSize: 14, // Reduced font size for the label
                  textAlign: 'left',
                }}
                open={subcontractorOpen}
                value={subcontractorValue}
                items={subcontractorItems}
                setOpen={setSubcontractorOpen}
                setValue={setSubcontractorValue}
                onChangeValue={handleSubcontractorChange}
              />
            )}
            {projectOpen || vendorOpen || subcontractorOpen ? <View style={{ height: 40, marginVertical: 10 }} /> : (
              <DropDownPicker
                placeholder={"Select User"}
                style={{
                  marginVertical: 10,
                  height: 40, // Reduced height
                  backgroundColor: '#fafafa',
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 5
                }}
                dropDownContainerStyle={{
                  borderColor: '#ddd',
                  borderWidth: 1,
                  borderRadius: 5,
                }}
                labelStyle={{
                  fontSize: 14, // Reduced font size for the label
                  textAlign: 'left',
                }}
                open={userOpen}
                value={userValue}
                items={userItems}
                setOpen={setUserOpen}
                setValue={setUserValue}
                onChangeValue={handleUserChange}
              />
            )}
            <TextInput
              style={styles.mainInput}
              placeholder="Material Description"
              onChangeText={setMaterialDescription}
              value={materialDescription}
            />
            <TextInput
              style={{...styles.mainInput, marginTop: -1 }}
              placeholder="Delivery Notes"
              onChangeText={setDeliveryNotes}
              value={deliveryNotes}
            />
            {
              Platform.OS === "ios" ? (
                <DatePickerIOS
                  style={{ width: '100%', marginVertical: 10 }}
                  date={selectedDate}
                  onDateChange={setSelectedDate}
                  mode="date"
                />
              ) : (
                <DatePickerAndroid
                  style={{ width: '100%', marginVertical: 10 }}
                  date={selectedDate}
                  onDateChange={setSelectedDate}
                  mode="date"
                />
              )}
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={handleClose} color="red" />
              <Button title="Submit" onPress={handleSubmit} />
            </View>
          </View>
        </ScrollView>
        {renderAddNewItemModal("Projects")}
        {renderAddNewItemModal("Vendors")}
        {renderAddNewItemModal("Subcontractors")}
        {renderAddNewItemModal("Users")}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Adjusted from 'center' to 'flex-start'
  },
  fullScreenModalView: {// Added to ensure the modal view takes up the full screen// Reduced side padding for more space
    alignItems: 'center',
    width: '100%', // Ensure the modal view spans the width of the screen
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,// Optional: to make the title stand out
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 8, // Reduced padding for more compact inputs
    marginVertical: 5, // Reduced vertical margin to fit more elements
    borderRadius: 5,
    backgroundColor: '#ffffff',
    width: '100%', // Ensure inputs take the full width minus padding
    fontSize: 14, // Optional: adjust font size for better fit
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    marginTop: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    maxHeight: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  buttonContainerModal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  mainInput: {
    width: '100%',
    marginVertical: 10, // Matched with dropdown for consistent spacing
    height: 50, // Smaller height for compact appearance
    backgroundColor: '#fafafa', // Background color to match dropdowns
    borderWidth: 1,
    borderColor: '#ddd', // Border color to match dropdowns
    borderRadius: 5, // Border radius to match dropdowns
    paddingVertical: 10, // Adjust padding as needed for text alignment
    paddingHorizontal: 10, // Padding for the text inside the box
    fontSize: 14,
  },
});
export default CalendarModal;
