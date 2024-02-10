import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRoute } from '@react-navigation/native';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/Firebase';
import DatePickerIOS from '../../utils/DatePickerIOS';
import DatePickerAndroid from '../../utils/DatePickerAndroid';
import  { useNavigation } from '@react-navigation/native'

const EditDelivery = () => {
  const route = useRoute();
  const { deliveryData } = route.params;
  const navigation = useNavigation();

  console.log(deliveryData);

  // Dropdown states
  const [projectOpen, setProjectOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [subcontractorOpen, setSubcontractorOpen] = useState(false);

  // Dropdown items
  const [projectItems, setProjectItems] = useState([]);
  const [vendorItems, setVendorItems] = useState([]);
  const [subcontractorItems, setSubcontractorItems] = useState([]);

  // Selected values
  const [projectValue, setProjectValue] = useState('')
  const [vendorValue, setVendorValue] = useState('')
  const [subcontractorValue, setSubcontractorValue] = useState('')

  // Form fields
  const [materialDescription, setMaterialDescription] = useState(deliveryData.material || '');
  const [deliveryNotes, setDeliveryNotes] = useState(deliveryData.notes || '');
  const [selectedDate, setSelectedDate] = useState(new Date(deliveryData.deliveryDate));

  const handleUpdateDelivery = () => {
    // Confirmation dialog
    Alert.alert(
      "Confirm Update", // Alert Title
      "Are you sure you want to update this delivery?", // Alert Message
      [
        {
          text: "Cancel",
          onPress: () => console.log("Update cancelled"), // Log message or handle cancelation
          style: "cancel"
        },
        {
          text: "Yes", // Confirm button text
          onPress: async () => {
            // Move the update logic into this block
            if (deliveryData && deliveryData.deliveryId) {
              const deliveryRef = doc(db, 'ScheduledDeliveries', deliveryData.deliveryId);

              try {
                await updateDoc(deliveryRef, {
                  // Assuming your Firestore document structure matches these field names
                  project: projectValue.label,
                  vendor: vendorValue.label,
                  subcontractor: subcontractorValue.label,
                  materialDescription: materialDescription.label,
                  deliveryNotes: deliveryNotes.label,
                  deliveryDate: selectedDate.toISOString(), // Adjust based on your date handling
                });

                alert('Delivery updated successfully!');
                // Optionally navigate back or refresh the data
                navigation.goBack(); // Or use a different method to refresh the parent component
              } catch (error) {
                console.error('Error updating delivery:', error);
                alert('Failed to update delivery. Please try again.');
              }
            } else {
              alert('No delivery ID provided.');
            }
          }
        }
      ],
      { cancelable: false }
    );
  };



  useEffect(() => {
    const fetchDropdownItems = async () => {
      const collections = ['Projects', 'Vendors', 'Subcontractors'];
      const setters = [setProjectItems, setVendorItems, setSubcontractorItems];
      const deliveryDataLabels = [
        deliveryData.project,
        deliveryData.vendor,
        deliveryData.subcontractor,
      ];

      collections.forEach((collectionName, index) => {
        const q = query(collection(db, collectionName), where("orgId", "==", deliveryData.orgId));
        onSnapshot(q, (querySnapshot) => {
          const items = querySnapshot.docs.map(doc => ({
            label: doc.data().name,
            value: doc.id,
          }));
          setters[index]([{ label: 'Select', value: '' }, ...items]);

          // Debugging: Log fetched items
          console.log(`Fetched ${collectionName}:`, items);

          // Find and set the initial value for the dropdown based on deliveryData
          const matchingItem = items.find(item => item.label === deliveryDataLabels[index]);
          if (matchingItem) {
            console.log(`Matching ${collectionName}:`, matchingItem.label); // Debugging: Log the match

            switch (collectionName) {
              case 'Projects':
                setProjectValue(matchingItem.value);
                break;
              case 'Vendors':
                setVendorValue(matchingItem.value);
                break;
              case 'Subcontractors':
                setSubcontractorValue(matchingItem.value);
                break;
              default:
                break;
            }
          } else {
            console.log(`No matching ${collectionName} found for label:`, deliveryDataLabels[index]);
          }
        });
      });
    };

    if (deliveryData && deliveryData.orgId) {
      fetchDropdownItems();
    }
  }, [deliveryData, deliveryData.orgId]); // Added deliveryData.orgId to ensure re-fetching if it changes


  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  console.log()

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.headerText}>Edit Delivery Details</Text>
        <DropDownPicker
          open={projectOpen}
          value={projectValue}
          items={projectItems}
          setOpen={setProjectOpen}
          setValue={setProjectValue}
          setItems={setProjectItems}
          zIndex={3000}
          zIndexInverse={1000}
          placeholder="Select Project"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
        <DropDownPicker
          open={vendorOpen}
          value={vendorValue}
          items={vendorItems}
          setOpen={setVendorOpen}
          setValue={setVendorValue}
          setItems={setVendorItems}
          zIndex={2000}
          zIndexInverse={2000}
          placeholder="Select Vendor"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
        <DropDownPicker
          open={subcontractorOpen}
          value={subcontractorValue}
          items={subcontractorItems}
          setOpen={setSubcontractorOpen}
          setValue={setSubcontractorValue}
          setItems={setSubcontractorItems}
          zIndex={1000}
          zIndexInverse={3000}
          placeholder="Select Subcontractor"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
        <TextInput
          style={styles.input}
          onChangeText={setMaterialDescription}
          value={materialDescription}
          placeholder="Material Description"
        />
        <TextInput
          style={styles.input}
          onChangeText={setDeliveryNotes}
          value={deliveryNotes}
          placeholder="Delivery Notes"
          multiline
          numberOfLines={4}
        />
        {
          Platform.OS === "ios" ? (
            <DatePickerIOS
              style={styles.datePicker}
              date={selectedDate}
              onDateChange={setSelectedDate}
              mode="date"
            />
          ) : (
            <DatePickerAndroid
              style={styles.datePicker}
              date={selectedDate}
              onDateChange={setSelectedDate}
              mode="date"
            />
          )}
        <View style={styles.buttonContainer}>
          <Button title="Cancel" onPress={() => navigation.goBack()} color="red" />
          <Button title="Update Delivery" onPress={handleUpdateDelivery} color="#007AFF" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 50,
  },
  formContainer: {
    padding: 20,
  },
  headerText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dropdown: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  datePicker: {
    marginVertical: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default EditDelivery
