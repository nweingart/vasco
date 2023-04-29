import React, { useState, useEffect } from 'react'
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native'
import { db, auth } from '../firebase/Firebase'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { collection, query, where, getDocs } from "firebase/firestore";


const ReceiptHistory = () => {
  const [data, setData] = useState([])
  const email = auth.currentUser.email

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "receipts"), where("email", "==", email))
      const querySnapshot = await getDocs(q)
      setData(querySnapshot.docs.map(doc => doc.data()))
    }
    fetchData()
  }, [])

  console.log(data)


  const navigation = useNavigation()

  const handleBack = () => {
    navigation.navigate('Home')
  }



  return (
    <ScrollView onAccessibilityEscape={Keyboard.dismiss} style={styles.container}>
      <View style={styles.backButtonWrapper}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back-outline" size='25' color={'black'} />
        </TouchableOpacity>
      </View>
      <View>
        {
          data?.map((item) => {
            return (
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                borderColor: 'black',
                borderWidth: 2,
                padding: 5,
                marginVertical: 5,
              }}>
                <Text style={{ }}>{item?.timestamp}</Text>
                <Image source={{ uri: item?.downloadURL }} style={{ width: 50, height: 50, marginLeft: 100  }} />
              </View>
            )
          })
        }
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gold',
    opacity: 0.9,
  },
  backButtonWrapper: {
    marginTop: 75,
    marginBottom: 25,
    marginLeft: 25,
  },
  imageSectionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 50,
  },
  textSectionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: -25,
    height: 250,
  },
  subtitle: {
    marginTop: 25,
    marginBottom: -30,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    marginLeft: 35,
  },
  textBoxWrapper: {
    marginTop: '10%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    padding: 35,
    paddingRight: 50,
    marginTop: -20,
    paddingTop: 10,
    height: 125,
    width: 350,
    borderRadius: 15,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  clearButton: {
    marginLeft: 35,
    marginTop: 130,
    marginBottom: -130,
    zIndex: 5,
  },
  buttonsWrapper: {
    flexDirection: 'row',
  },
})
export default ReceiptHistory
