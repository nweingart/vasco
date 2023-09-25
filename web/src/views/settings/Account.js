// AccountTab.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/Firebase'

const AccountTab = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    phone: '',
    industry: '',
    employeeRange: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  const docRef = doc(db, 'users', 'user123');

  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async () => {
    try {
      await setDoc(docRef, formData, { merge: true });
      console.log("Document successfully written!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  const styles = {
    inputWrapper: {
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '4px'
    },
    readonlyInput: {
      backgroundColor: '#f5f5f5',
      pointerEvents: 'none'
    },
    label: {
      display: 'block',
      marginBottom: '8px'
    },
    button: {
      backgroundColor: '#FFC300',
      color: 'white',
      padding: '12px 20px',
      fontWeight: 'bold',
      borderRadius: 10,
      border: 'none',
    }
  };

  return (
    <div>
      <div style={styles.inputWrapper}>
        <label style={styles.label} htmlFor="companyName">Company Name</label>
        <input
          style={isEditing ? styles.input : {...styles.input, ...styles.readonlyInput}}
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          readOnly={!isEditing}
        />
      </div>

      <div style={styles.inputWrapper}>
        <label style={styles.label} htmlFor="companyEmail">Company Email</label>
        <input
          style={isEditing ? styles.input : {...styles.input, ...styles.readonlyInput}}
          type="email"
          id="companyEmail"
          name="companyEmail"
          value={formData.companyEmail}
          onChange={handleChange}
          readOnly={!isEditing}
        />
      </div>

      <div style={styles.inputWrapper}>
        <label style={styles.label} htmlFor="phone">Phone</label>
        <input
          style={isEditing ? styles.input : {...styles.input, ...styles.readonlyInput}}
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          readOnly={!isEditing}
        />
      </div>

      <div style={styles.inputWrapper}>
        <label style={styles.label} htmlFor="industry">Industry</label>
        <input
          style={isEditing ? styles.input : {...styles.input, ...styles.readonlyInput}}
          type="text"
          id="industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          readOnly={!isEditing}
        />
      </div>

      <div style={styles.inputWrapper}>
        <label style={styles.label} htmlFor="employeeRange">Employee Range</label>
        <select
          style={isEditing ? styles.input : {...styles.input, ...styles.readonlyInput}}
          id="employeeRange"
          name="employeeRange"
          value={formData.employeeRange}
          onChange={handleChange}
          disabled={!isEditing}
        >
          <option value="1-5">1-5</option>
          <option value="5-15">5-15</option>
          <option value="15-30">15-30</option>
          <option value="30-50">30-50</option>
          <option value="50-100">50-100</option>
          <option value="100+">100+</option>
        </select>
      </div>

      <div style={styles.inputWrapper}>
        <label style={styles.label} htmlFor="streetAddress">Street Address</label>
        <input
          style={isEditing ? styles.input : {...styles.input, ...styles.readonlyInput}}
          type="text"
          id="streetAddress"
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleChange}
          readOnly={!isEditing}
        />
      </div>

      <div style={styles.inputWrapper}>
        <label style={styles.label} htmlFor="city">City</label>
        <input
          style={isEditing ? styles.input : {...styles.input, ...styles.readonlyInput}}
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          readOnly={!isEditing}
        />
      </div>

      <div style={styles.inputWrapper}>
        <label style={styles.label} htmlFor="state">State</label>
        <select
          style={isEditing ? styles.input : {...styles.input, ...styles.readonlyInput}}
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          disabled={!isEditing}
        >
          <option value="AL">Alabama</option>
          <option value="AK">Alaska</option>
          <option value="AZ">Arizona</option>
          <option value="AR">Arkansas</option>
          <option value="CA">California</option>
          <option value="CO">Colorado</option>
          <option value="CT">Connecticut</option>
          <option value="DE">Delaware</option>
          <option value="FL">Florida</option>
          <option value="GA">Georgia</option>
          <option value="HI">Hawaii</option>
          <option value="ID">Idaho</option>
          <option value="IL">Illinois</option>
          <option value="IN">Indiana</option>
          <option value="IA">Iowa</option>
          <option value="KS">Kansas</option>
          <option value="KY">Kentucky</option>
          <option value="LA">Louisiana</option>
          <option value="ME">Maine</option>
          <option value="MD">Maryland</option>
          <option value="MA">Massachusetts</option>
          <option value="MI">Michigan</option>
          <option value="MN">Minnesota</option>
          <option value="MS">Mississippi</option>
          <option value="MO">Missouri</option>
          <option value="MT">Montana</option>
          <option value="NE">Nebraska</option>
          <option value="NV">Nevada</option>
          <option value="NH">New Hampshire</option>
          <option value="NJ">New Jersey</option>
          <option value="NM">New Mexico</option>
          <option value="NY">New York</option>
          <option value="NC">North Carolina</option>
          <option value="ND">North Dakota</option>
          <option value="OH">Ohio</option>
          <option value="OK">Oklahoma</option>
          <option value="OR">Oregon</option>
          <option value="PA">Pennsylvania</option>
          <option value="RI">Rhode Island</option>
          <option value="SC">South Carolina</option>
          <option value="SD">South Dakota</option>
          <option value="TN">Tennessee</option>
          <option value="TX">Texas</option>
          <option value="UT">Utah</option>
          <option value="VT">Vermont</option>
          <option value="VA">Virginia</option>
          <option value="WA">Washington</option>
          <option value="WV">West Virginia</option>
          <option value="WI">Wisconsin</option>
          <option value="WY">Wyoming</option>
        </select>
      </div>


      <div style={styles.inputWrapper}>
        <label style={styles.label} htmlFor="zipCode">Zip Code</label>
        <input
          style={isEditing ? styles.input : {...styles.input, ...styles.readonlyInput}}
          type="text"
          id="zipCode"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          readOnly={!isEditing}
        />
      </div>

      <button style={styles.button} onClick={isEditing ? handleSubmit : handleToggleEdit}>
        {isEditing ? "Save" : "Edit"}
      </button>
    </div>
  );
}

export default AccountTab;
