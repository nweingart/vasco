import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase'

const UserInput = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const docRef = await addDoc(collection(db, 'users'), {
        firstName,
        lastName,
        email,
        role
      });
      console.log("Document written with ID: ", docRef.id);
      closeModal();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={openModal}>Add User</button>
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)'  // Add a blur effect to the background
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
                <label>First Name:</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Last Name:</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Role:</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="Admin">Admin</option>
                  <option value="Receiving">Receiving</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Operations">Operations</option>
                  <option value="Accounting">Accounting</option>
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

export default UserInput;

