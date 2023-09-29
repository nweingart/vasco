// DeliveryFeed.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs, startAfter } from 'firebase/firestore';
import { auth, db } from  '../../../firebase/Firebase'

// Import the DeliveryCard component
import DeliveryCard from './DeliveryCard';

const DeliveryFeed = ({ startDate, endDate, status }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
  const navigate = useNavigate();

  const userEmail = auth.currentUser.email

  const fetchDeliveries = async (lastDoc = null) => {
    let deliveryQuery = query(
      collection(db, 'deliveries'),
      where('email', '==', userEmail),
      orderBy('deliveryDate', 'desc')
    );

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      deliveryQuery = query(
        deliveryQuery,
        where('deliveryDate', '>=', start),
        where('deliveryDate', '<=', end)
      );
    }

    if (status) {
      deliveryQuery = query(deliveryQuery, where('deliveryStatus', '==', status));
    }

    if (lastDoc) {
      deliveryQuery = query(deliveryQuery, startAfter(lastDoc));
    }

    const deliveryDocs = await getDocs(deliveryQuery);
    const deliveryData = deliveryDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    setLastVisibleDoc(deliveryDocs.docs[deliveryDocs.docs.length - 1]);
    if (lastDoc) {
      setDeliveries(prev => [...prev, ...deliveryData]);
    } else {
      setDeliveries(deliveryData);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [userEmail, startDate, endDate, status]);

  const handleCardClick = (delivery) => {
    console.log("Navigating to:", `/delivery/${delivery.id}`);
    navigate(`/dashboard/delivery/${delivery.id}`, { state: { delivery } });
  };

  return (
    <div style={feedContainerStyle}>
      {deliveries.map(delivery => (
        <div style={cardStyle} key={delivery.id}>
          <DeliveryCard data={delivery} onClick={() => handleCardClick(delivery)} />
        </div>
      ))}
    </div>
  );
};

const feedContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const cardStyle = {
  margin: '10px 0'
};

export default DeliveryFeed
