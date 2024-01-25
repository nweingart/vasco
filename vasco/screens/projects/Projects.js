import React, { useState } from 'react'
import {ScrollView, StyleSheet, Text, View} from 'react-native'

const Projects = () => {
  const [projects, setProjects] = useState({})

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.title}>Projects</Text>
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
    marginTop: 100,
    marginBottom: 40,
  },
})

export default Projects
