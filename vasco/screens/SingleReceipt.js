import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SingleReceipt = () => {
  return (
    <View style={styles.container}>
      <Text>Single Receipt</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default SingleReceipt
