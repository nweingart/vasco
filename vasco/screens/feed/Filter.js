import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { setStatusFilter, setDateFiler } from "../../redux/redux";
import { useDispatch } from "react-redux";
import {useNavigation} from "@react-navigation/native";

const Filter = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const handleSave = () => {
    dispatch(setStatusFilter(status))
    dispatch(setDateFiler({ startDate, endDate }))
  }

  const handleBack = () => {
    navigation.goBack()
  }

  const [status, setStatus] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dateContainer}>
        <View>
          <Text>Start</Text>
        </View>
        <View>
          <Text>End</Text>
        </View>
      </View>
      <View>
        <Text>Status</Text>
        <TouchableOpacity onPress={() => setStatus('Approved')}>
          <Text>Approved</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStatus('Not Approved')}>
          <Text>Not Approved</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  dateContainer: {
    flexDirection: 'column',
  }
})

export default Filter
