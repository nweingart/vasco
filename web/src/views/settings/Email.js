import React, { useEffect, useState } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../../firebase/Firebase'

const EmailTab = () => {
  const [deliveryEmails, setDeliveryEmails] = useState([]);
  const [endOfDayEmails, setEndOfDayEmails] = useState([]);
  const [currentDeliveryEmail, setCurrentDeliveryEmail] = useState('');
  const [currentEndOfDayEmail, setCurrentEndOfDayEmail] = useState('');


  const handleSubmit = async () => {
    const emailDoc = {
      everyUpdateEmails: deliveryEmails,
      dailyUpdateEmails: endOfDayEmails,
      dailyUpdateTime: "5:00pm"  // Default value you mentioned before
    };

    try {
      await setDoc(doc(db, "email", "userUniqueId"), emailDoc);
      console.log("Email preferences saved successfully!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  const fetchEmails = async () => {
    const docRef = doc(db, "email", "userUniqueId");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setDeliveryEmails(data.everyUpdateEmails || []);
      setEndOfDayEmails(data.dailyUpdateEmails || []);
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleAddEmail = async (e, currentEmail, setter, setCurrent) => {
    if (e.key === 'Enter' && currentEmail.includes('@') && currentEmail.includes('.')) {
      setter(prev => [...prev, currentEmail]);
      setCurrent('');
      e.preventDefault();
      await handleSubmit();
    }
  };

  const handleRemoveEmail = async (setter, emailToRemove) => {
    setter(prev => prev.filter(email => email !== emailToRemove));
    await handleSubmit();
  };


  const styles = {
    emailContainer: {
      height: '100px',
      width: '90%',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '20px',
      display: 'flex',
      flexWrap: 'wrap'
    },
    emailTag: {
      display: 'inline-block',
      padding: '5px',
      margin: '5px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: '#FFC300',
      fontSize: '14px'
    },
    removeButton: {
      marginLeft: '5px',
      background: 'red',
      color: 'white',
      border: 'none',
      cursor: 'pointer'
    },
    hiddenInput: {
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      width: '100%',
      height: '30px'
    }
  };

  return (
    <div>
      <div>
        <label>Receive Emails for Every Delivery:</label>
        <div style={styles.emailContainer}>
          {deliveryEmails.map(email => (
            <span key={email} style={styles.emailTag}>
              {email}
              <button style={styles.removeButton} onClick={() => handleRemoveEmail(setDeliveryEmails, email)}>x</button>
            </span>
          ))}
          <input
            style={styles.hiddenInput}
            value={currentDeliveryEmail}
            onChange={(e) => setCurrentDeliveryEmail(e.target.value)}
            onKeyDown={(e) => handleAddEmail(e, currentDeliveryEmail, setDeliveryEmails, setCurrentDeliveryEmail)}
          />
        </div>
      </div>

      <div>
        <label>Receive Emails at the End of Every Day:</label>
        <div style={styles.emailContainer}>
          {endOfDayEmails.map(email => (
            <span key={email} style={styles.emailTag}>
              {email}
              <button style={styles.removeButton} onClick={() => handleRemoveEmail(setEndOfDayEmails, email)}>x</button>
            </span>
          ))}
          <input
            style={styles.hiddenInput}
            value={currentEndOfDayEmail}
            onChange={(e) => setCurrentEndOfDayEmail(e.target.value)}
            onKeyDown={(e) => handleAddEmail(e, currentEndOfDayEmail, setEndOfDayEmails, setCurrentEndOfDayEmail)}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailTab;


