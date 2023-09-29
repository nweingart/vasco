import React, { useState } from 'react';
import DeliveryFeed from './DeliveryFeed'; // Path to your DeliveryFeed component

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('purchaserReview');

  const styles = {
    tabsHeader: {
      display: 'flex',
      gap: '10px',
      borderBottom: '2px solid #ddd',
      padding: '10px 0',
      backgroundColor: '#ffffff',
    },
    button: {
      padding: '10px 15px',
      border: 'none',
      background: '#f5f5f5',
      cursor: 'pointer',
      borderRadius: '5px',
      transition: 'background 0.3s',
      marginLeft: 10,
    },
    activeButton: {
      background: '#FFC300',
      color: '#fff',
      fontWeight: 'bold',
    }
  };

  return (
    <div>
      <div style={styles.tabsHeader}>
        <button
          style={{...styles.button, ...(activeTab === 'purchaserReview' ? styles.activeButton : {})}}
          onClick={() => setActiveTab('purchaserReview')}>
          Purchaser Review
        </button>
        <button
          style={{...styles.button, ...(activeTab === 'accountingReview' ? styles.activeButton : {})}}
          onClick={() => setActiveTab('accountingReview')}>
          Accounting Review
        </button>
        <button
          style={{...styles.button, ...(activeTab === 'archive' ? styles.activeButton : {})}}
          onClick={() => setActiveTab('archive')}>
          Archive
        </button>
      </div>
      {activeTab === 'purchaserReview' && <DeliveryFeed />}
      {activeTab === 'accountingReview' && <DeliveryFeed />}
      {activeTab === 'archive' && <DeliveryFeed />}
    </div>
  );
};

export default Dashboard
