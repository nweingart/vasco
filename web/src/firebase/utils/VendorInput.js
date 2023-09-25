import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';

const VendorInput = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('');

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const docRef = await addDoc(collection(db, 'vendors'), {
        name,
        email,
        phone,
        type,
      });
      console.log("Document written with ID: ", docRef.id);
      closeModal();
      setName('')
      setEmail('')
      setPhone('')
      setType('')
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={openModal}>Add Vendor</button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{
            width: '25%',
            padding: '20px',
            backgroundColor: 'white',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
            borderRadius: '5px'
          }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label>Name:</label>
                <input required={true} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Email:</label>
                <input required={true} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Phone</label>
                <input required={true} type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Vendor Type:</label>
                <select required={true} value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="" disabled selected>Select a vendor type</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Mechancial">Mechanical</option>
                  <option value="General">General</option>
                  <option value="Lumber">Lumber</option>
                  <option value="Metals">Metals</option>
                  <option value="HVAC">HVAC</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button type="submit" style={{ marginRight: '10px' }}>Add</button>
              <button onClick={closeModal}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorInput
