import React from 'react'
import { ScrollView, Text, View, StyleSheet } from 'react-native'

const DeliveryFeed = () => {

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.title}>Delivery Feed</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 40,
  },
})

export default DeliveryFeed

