import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const DropdownComponent = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(["1", "2", "3", "4", "5", "Add"]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState('');

  const handleOpen = () => {
    if (value === 'Add') {
      setOpen(false);
      setModalVisible(true);
    } else {
      setOpen(true);
    }
  };

  const handleAddItem = () => {
    setItems(prevItems => [...prevItems.slice(0, -1), newItem, "Add"]);
    setModalVisible(false);
    setNewItem('');
  };

  return (
    <View>
      <DropDownPicker
        open={open}
        value={value}
        items={items.map((item) => ({ label: item, value: item }))}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onOpen={handleOpen}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={{marginTop: 50, marginHorizontal: 20, backgroundColor: 'white', borderRadius: 20, padding: 35}}>
          <Text style={{marginBottom: 15}}>Enter new item:</Text>
          <TextInput
            value={newItem}
            onChangeText={setNewItem}
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15}}
          />
          <Button title="Add Item" onPress={handleAddItem} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
        </View>
      </Modal>
    </View>
  );
};

export default DropdownComponent
