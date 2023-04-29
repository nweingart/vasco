import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import firebase from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyBUmfk8B8SDEt_mbf3NpdrgVqOyjp5Cn0k',
  authDomain: 'vasco-6851a.firebaseapp.com',
  projectId: "vasco-6851a",
  storageBucket: "vasco-6851a.appspot.com",
  messageSenderId: "1061727349342",
  appId: "1:1061727349342:web:c5581ea02b061685dba2cf",
  measurementId: "G-V3TH1LEPG9",
}


const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const storage = getStorage(app)

export { auth, db, storage }
