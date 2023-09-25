import React, { useState, useEffect } from 'react';
import { db, auth } from "../../firebase/Firebase";
import { collection, getDocs, query, orderBy, where, startAfter } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setStatusFilter, setStartDateFilter, setEndDateFilter } from "../../redux/Redux";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function DeliveryHistory() {
  const [deliveries, setDeliveries] = useState([]);
  const [search, setSearch] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userEmail = auth.currentUser.email;
  const startDate = useSelector(state => state.startDateFilter);
  const endDate = useSelector(state => state.endDateFilter);
  const status = useSelector(state => state.statusFilter);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Signed out successfully!");
      navigate('/login'); // Redirect to the login page after sign-out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

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
  }, []);

  useEffect(() => {
    setDeliveries([]);
    fetchDeliveries();
  }, [startDate, endDate, status]);

  useEffect(() => {
    if (search) {
      const filtered = deliveries.filter(item =>
        item.deliveryProject?.toLowerCase().includes(search.toLowerCase()) ||
        item.deliveryVendor?.toLowerCase().includes(search.toLowerCase()) ||
        item.deliveryNotes?.toLowerCase().includes(search.toLowerCase())
      );

      setDeliveries(filtered);
    }
  }, [search]);

  const handleClearSearch = () => {
    setSearch('');
    fetchDeliveries();
  };

  const handleSearchChange = (text) => {
    setSearch(text);

    if (!text) {
      setFilteredDeliveries(deliveries);
      return;
    }

    const searchTerm = text.toLowerCase();
    const filtered = deliveries.filter(delivery => {
      return delivery.notes && delivery.notes.toLowerCase().includes(searchTerm);
    });

    setFilteredDeliveries(filtered);
  };

  useEffect(() => {
    setFilteredDeliveries(deliveries);
  }, [deliveries]);

  const renderTableHeader = () => {
    return (
      <thead>
      <tr>
        <th style={styles.tableHeader}>Date</th>
        <th style={styles.tableHeader}>Time</th>
        <th style={styles.tableHeader}>Status</th>
        <th style={styles.tableHeader}>Project</th>
        <th style={styles.tableHeader}>Vendor</th>
        <th style={styles.tableHeader}>Notes</th>
        <th style={styles.tableHeader}>Images</th>
      </tr>
      </thead>
    );
  };

  const renderTableRow = (item) => {
    const dateObject = new Date(item?.deliveryDate?.seconds * 1000);
    const formattedDate = dateObject.toDateString();
    const formattedTime = dateObject.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    return (
      <tr key={item.id} onClick={() => { /* Navigate to EditDetail route */ }}>
        <td style={styles.tableCell}>{formattedDate}</td>
        <td style={styles.tableCell}>{formattedTime}</td>
        <td style={styles.tableCell}>{item.deliveryStatus === 'Approved' ? '✔️' : '❌'}</td>
        <td style={styles.tableCell}>{item.deliveryProject}</td>
        <td style={styles.tableCell}>{item.deliveryVendor}</td>
        <td style={styles.tableCell}>{item.deliveryNotes}</td>
        <td style={styles.tableCell}>
          {item?.deliveryPhotoDownloadUrls.concat(item?.deliveryReceiptDownloadUrls || []).map((url, index) => (
            <img key={index} src={url} alt="Delivery" width="100" height="100" />
          ))}
        </td>
      </tr>
    );
  };

  return (
    <div style={styles.container}>
      <h1>Delivery History</h1>
      <div style={styles.signOutButton}>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
      <div style={styles.searchContainer}>
        <input
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder="Search"
        />
        <div style={styles.clearButton}>
          <button onClick={handleClearSearch}>Clear Search</button>
        </div>
      </div>
      <div>
        {startDate && endDate && (
          <button onClick={() => {dispatch(setStartDateFilter(null)); dispatch(setEndDateFilter(null))}}>
            🗓 {startDate.toDateString()} - {endDate.toDateString()}
          </button>
        )}
        {status && (
          <button onClick={() => dispatch(setStatusFilter(null))}>
            📝 {status}
          </button>
        )}
      </div>
      <table>
        {renderTableHeader()}
        <tbody>
        {filteredDeliveries.map(item => renderTableRow(item))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: 20
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    padding: '8px',
    border: '1px solid #000',
    textAlign: 'left',
  },
  tableCell: {
    padding: '8px',
    border: '1px solid #000',
    textAlign: 'left',
  },
  signOutButton:{
    textAlign: 'right'
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 25,
    marginBottom: 25,
  },
  searchBar: {
    height: 100,
    width: '100%',
  },
  clearButton: {
    marginLeft: 25
  }
};


export default DeliveryHistory;
