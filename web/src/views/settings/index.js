import React, { useState } from 'react';
import AccountTab from "./Account";
import WorkflowTab from "./Workflow";
import EmailTab from "./Email";

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');

  const renderTabContent = () => {
    switch(activeTab) {
      case 'account':
        return <AccountTab />;
      case 'workflow':
        return <WorkflowTab />;
      case 'email':
        return <EmailTab />;
      default:
        return null;
    }
  }

  return (
    <div style={styles.settingsContainer}>
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('account')}
          style={activeTab === 'account' ? {...styles.button, ...styles.activeButton} : styles.button}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab('workflow')}
          style={activeTab === 'workflow' ? {...styles.button, ...styles.activeButton} : styles.button}
        >
          Workflow
        </button>
        <button
          onClick={() => setActiveTab('email')}
          style={activeTab === 'email' ? {...styles.button, ...styles.activeButton} : styles.button}
        >
          Email
        </button>
      </div>
      <div style={styles.tabContent}>
        {renderTabContent()}
      </div>
    </div>
  );
}

const styles = {
  settingsContainer: {
    width: '100%',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 15px',
    border: 'none',
    background: '#f5f5f5',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background 0.3s',
  },
  activeButton: {
    background: '#FFC300',
    color: '#fff',
    fontWeight: 'bold',
  },
  tabContent: {
    padding: '20px',
    background: '#fff',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
  },
};

export default Settings;


// Manufacturing
// General Contractor
// Owner
// Architect
// Subcontractor
// Logistics
// Other
