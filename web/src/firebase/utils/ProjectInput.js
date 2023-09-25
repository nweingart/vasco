import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';

const ProjectInput = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [job, setJob] = useState('');
  const [description, setDescription] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [status, setStatus] = useState('');

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        job,
        description,
        zipCode,
        status,
      });
      console.log("Document written with ID: ", docRef.id);
      closeModal();
      setJob('')
      setDescription('')
      setZipCode('')
      setStatus('')
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={openModal}>Add Project</button>
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
                <label>Job No.</label>
                <input required={true} type="text" value={job} onChange={(e) => setJob(e.target.value)} placeholder="Job No." />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Project Description</label>
                <input required={true} type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Job Description" />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Zip Code</label>
                <input required={true} type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="Zip Code" />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Status</label>
                <select
                  required={true}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="" disabled selected>Select a status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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

export default ProjectInput
