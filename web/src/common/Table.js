import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/Firebase';

const Table = ({ collectionName }) => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const dataCollection = collection(db, collectionName);

    // Setting up the real-time listener
    const unsubscribe = onSnapshot(dataCollection, (snapshot) => {
      const dataArray = snapshot.docs.map(doc => ({
        id: doc.id,  // Including the doc id in the data
        ...doc.data()
      }));
      setData(dataArray);
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, [collectionName]);

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      console.log('Document successfully deleted!');
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const handleFilterChange = (event, header) => {
    setFilters({
      ...filters,
      [header]: event.target.value
    });
  };

  const filteredData = data.filter(row =>
    Object.keys(filters).every(header =>
      !filters[header] || String(row[header]).toLowerCase().includes(filters[header].toLowerCase())
    )
  );

  // If data is empty, don't render
  if (!data.length) return null;

  // Extract headers (keys) from the first data object, excluding 'id'
  const headers = Object.keys(data[0] || {}).filter(header => header !== 'id');

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
      <tr>
        {headers.map(header => (
          <th key={header} style={{ border: '1px solid black', padding: '8px' }}>
            {header}
          </th>
        ))}
        <th>Actions</th>
      </tr>
      <tr>
        {headers.map(header => (
          <th key={header} style={{ border: '1px solid black', padding: '8px' }}>
            <input
              type="text"
              value={filters[header] || ''}
              onChange={e => handleFilterChange(e, header)}
              placeholder={`Filter by ${header}`}
            />
          </th>
        ))}
        <th></th>
      </tr>
      </thead>
      <tbody>
      {filteredData.map((item, index) => (
        <tr key={index}>
          {headers.map(header => (
            <td key={header} style={{ border: '1px solid black', padding: '8px' }}>
              {item[header]}
            </td>
          ))}
          <td>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}

export default Table;
