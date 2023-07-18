import React, { useState } from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';


const Filter = () => {
  const [filterValue, setFilterValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);


  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Text>Filter</Text>
      </TouchableOpacity>
      <View>
        <Modal visible={modalOpen} animationType='slide'>

        </Modal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default Filter
