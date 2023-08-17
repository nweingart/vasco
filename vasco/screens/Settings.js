import React, { useState } from 'react'
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Keyboard,
  TextInput,
  Modal,
  FlatList,
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { setEmailReceipts, setMailingList } from '../redux/redux'
import { db, auth } from '../firebase/Firebase'
import { setDoc, doc, getDoc } from 'firebase/firestore'

const Settings = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [modalVisible, setModalVisible] = React.useState(false)
  const [email, setEmail] = React.useState([])
  const [localMailingList, setLocalMailingList] = React.useState([])
  const [showInformation, setShowInformation] = React.useState(false)

  const userEmail = auth.currentUser.email
  console.log(userEmail)

  const mailingListRef = doc(db, "mailingLists", userEmail);

  const checkEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  const handleAdd = () => {
    if (checkEmail(email)) {
      const updatedMailingList = localMailingList.concat(email);
      setLocalMailingList(updatedMailingList);

      setDoc(mailingListRef, { mailingList: updatedMailingList }, { merge: true })
        .then(() => {
          Alert.alert('Great Success!', 'Email added to mailing list')
          setEmail('')
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    } else {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address",
      );
    }
  }

  const handleDelete = (email) => {
    const newMailingList = localMailingList.filter((item) => item !== email);
    setLocalMailingList(newMailingList);
    setDoc(mailingListRef, { mailingList: newMailingList }, { merge: true })
      .then(() => {
        Alert.alert('Great Success!', 'Email removed from mailing list')
        setEmail('')
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      })
  }

  React.useEffect(() => {
    const getMailingList = async () => {
      const docSnap = await getDoc(mailingListRef);
      if (docSnap.exists() && docSnap.data().mailingList) {
        console.log("Document data:", docSnap.data());
        setLocalMailingList(docSnap.data().mailingList); // Adjusting the function call here
      } else {
        console.log("No such document or mailingList property doesn't exist!");
      }
    }
    getMailingList();
  }, []);

  const Item = ({ item }) => (
    <View style={styles.emailListItem}>
      <Text>{item}</Text>
      <TouchableOpacity onPress={() => handleDelete(item)}>
        <Ionicons name="trash-outline" size='20' color={'#FFC300'}/>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
      />
    )
  }

  const InformationItem = () => {
    return (
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: showInformation ? '#aeaea9' : 'white', borderRadius: 5, height: 50, width: 300, padding: 5}}>
        <Text style={{ color: showInformation ? 'black' : 'white' }} >Add email recipients will receive an email each time a package is received</Text>
      </View>
    )
  }

  const handleInformation = () => {
    if (showInformation) {
      setShowInformation(false)
    } else {
      setShowInformation(true)
    }
  }
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const navigation = useNavigation()
  const dispatch = useDispatch()

  const handleChange = (text) => {
    setEmail(text)
  }

  const handleBack = () => {
    dispatch(setMailingList(localMailingList))
    if (isEnabled) {
      dispatch(setEmailReceipts(true))
    } else {
      dispatch(setEmailReceipts(false))
    }
    navigation.navigate('Home')
  }

  return (
    <View onAccessibilityEscape={Keyboard.dismiss} style={styles.container}>
      <View style={styles.backButtonWrapper}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back-outline" size='25' color={'black'} />
        </TouchableOpacity>
      </View>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <View style={{ marginVertical: 25, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <InformationItem />
      </View>
      <View style={styles.switchWrapper}>
        <Ionicons onPress={handleInformation} name="information-circle-outline" size='25' color={'black'} />
        <Text style={styles.switchText}>Email Receipts</Text>
        <Switch
          trackColor={{false: '#767577', true: '#FFC300'}}
          thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" color='#FFC300' size='35'/>
        </TouchableOpacity>
      </View>
      <View style={styles.emailListWrapper}>
        <View style={styles.emailListItem}>
          <FlatList
            data={localMailingList}
            renderItem={renderItem}
            keyExtractor={item => item}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </View>
      </View>
      <View style={styles.centeredView}>
        <View>
          <Modal
            animationType="slide"
            presentationStyle="formSheet"
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.buttonClose} onPress={() => setModalVisible(false)}>
                <Ionicons name="close-outline" size='25'/>
              </TouchableOpacity>
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.modalText}>Add Email</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                textContentType={'emailAddress'}
                onChangeText={handleChange}
                value={email}
              />
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAdd}>
                <Text style={{ fontWeight: 'bold' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    opacity: 0.9,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  backButtonWrapper: {
    marginTop: 75,
    marginBottom: 25,
    marginLeft: 25,
  },
  titleWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  switchWrapper:{
    flexDirection: 'row',
    padding: 20,
    marginHorizontal: 50,
  },
  switchText: {
    fontSize: 20,
    marginHorizontal: 20,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 175,
  },
  emailListWrapper: {
    display: 'flex',
    marginLeft: 20,
    marginTop: 175,
    position: 'absolute',
    top: '25%',
    backgroundColor: 'white',
    height: '40%',
    width: '90%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFC300',
  },
  emailListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    zIndex: 100,
  },
  modalView: {
    margin: 20,
    backgroundColor: "lightgray",
    alignItems: "center",
    shadowColor: "#000",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 8,
    width: 300,
    padding: 7.5,
  },
  modalButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFC300',
    marginHorizontal: 10,
    borderRadius: 8,
    height: 40,
    width: 200,
    fontWeight: 'bold',
    marginTop: 50,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 'bold',
  },
  buttonClose: {
    position: 'absolute',
    top: '5%',
    left: '5%'
  },
})

export default Settings
