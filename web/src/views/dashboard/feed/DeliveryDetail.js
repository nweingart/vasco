import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/Firebase';

const DeliveryDetail = () => {
  const location = useLocation();
  const delivery = location.state.delivery;
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/dashboard');
  }


  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({ ...delivery });

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      margin: '20px',
      width: '100%'
    },
    label: {
      marginTop: '10px'
    },
    input: {
      width: '100%',
      padding: '5px',
      margin: '5px 0'
    },
    textarea: {
      width: '100%',
      padding: '5px',
      margin: '5px 0',
      minHeight: '80px'
    },
    imageScrollBox: {
      display: 'flex',
      overflowX: 'scroll',
      maxWidth: '100%',
      marginTop: '10px'
    },
    image: {
      width: '100px',
      height: '100px',
      objectFit: 'cover',
      borderRadius: '5px',
      cursor: 'pointer'

    },
    imageContainer: {
      position: 'relative',
      display: 'inline-block',
      margin: '5px'
    },
    deleteIcon: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      cursor: 'pointer',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };
  const openImageInFullScreen = (url) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const imgWindow = window.open(url, 'imgWindow');
      imgWindow.document.write('<img src="' + url + '" onload="var that = this; setTimeout(function() { that.style.marginTop = ((window.innerHeight - that.offsetHeight) / 2) + \'px\'; }, 50);" style="display:block; margin:auto;" />');
      imgWindow.document.body.style.backgroundColor = 'black';
      imgWindow.document.body.style.margin = '0';
      imgWindow.document.body.style.display = 'flex';
      imgWindow.document.body.style.justifyContent = 'center';
      imgWindow.document.body.style.alignItems = 'center';
      imgWindow.document.body.style.height = '100vh';
    };
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSave = async () => {
    await updateDelivery(delivery.id, updatedData);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this delivery?')) {
      await deleteDelivery(delivery.id);
      navigate('/dashboard');
    }
  };

  const removeImageUrl = (type, url) => {
    setUpdatedData(prev => {
      const updatedUrls = prev[type].filter(item => item !== url);
      return { ...prev, [type]: updatedUrls };
    });
  };

  async function updateDelivery(deliveryId, updatedData) {
    const deliveryRef = doc(db, 'deliveries', deliveryId);
    await updateDoc(deliveryRef, updatedData);
  }

  async function deleteDelivery(deliveryId) {
    const deliveryRef = doc(db, 'deliveries', deliveryId);
    await deleteDoc(deliveryRef);
  }

  console.log(updatedData.deliveryReceiptDownloadUrls)

  return (
    <div style={styles.container}>
      <button onClick={handleBackClick}>Back to Delivery Feed</button>
      {isEditing ? (
        <div>
          <h2>Edit Delivery for ID: {delivery.id}</h2>
          <label style={styles.label}>Status:</label>
          <input
            value={updatedData.deliveryStatus}
            onChange={e => setUpdatedData(prev => ({ ...prev, deliveryStatus: e.target.value }))}
            style={styles.input}
          />
          <label style={styles.label}>Project:</label>
          <input
            value={updatedData.deliveryProject}
            onChange={e => setUpdatedData(prev => ({ ...prev, deliveryProject: e.target.value }))}
            style={styles.input}
          />
          <label style={styles.label}>Vendor:</label>
          <input
            value={updatedData.deliveryVendor}
            onChange={e => setUpdatedData(prev => ({ ...prev, deliveryVendor: e.target.value }))}
            style={styles.input}
          />
          <label style={styles.label}>Notes:</label>
          <textarea
            value={updatedData.deliveryNotes}
            onChange={e => setUpdatedData(prev => ({ ...prev, deliveryNotes: e.target.value }))}
            style={styles.textarea}
          />

          <div>
            <label style={styles.label}>Receipt Images:</label>
            <div style={{display: 'flex', flexDirection: 'row', overflowX: 'auto', gap: '10px'}}>
              {updatedData.deliveryReceiptDownloadUrls?.map((url, idx) => (
                <div key={idx} style={styles.imageContainer}>
                  <img
                    src={url}
                    alt={`Receipt ${idx}`}
                    style={styles.image}
                  />
                  <div
                    style={styles.deleteIcon}
                    onClick={() => removeImageUrl('deliveryReceiptDownloadUrls', url)}
                  >
                    x
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={styles.label}>Photo Images:</label>
            <div style={{display: 'flex', flexDirection: 'row', overflowX: 'auto', gap: '10px'}}>
              {updatedData?.deliveryPhotoDownloadUrls?.map((url, idx) => (
                <div key={idx} style={styles.imageContainer}>
                  <img
                    src={url}
                    alt={`Photo ${idx}`}
                    style={styles.image}
                  />
                  <div
                    style={styles.deleteIcon}
                    onClick={() => removeImageUrl('deliveryPhotoDownloadUrls', url)}
                  >
                    x
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '20px' }}>
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      ) : (
        <div>
          <h2>Delivery Details for ID: {delivery.id}</h2>
          <div>Status: {delivery.deliveryStatus}</div>
          <div>Project: {delivery.deliveryProject}</div>
          <div>Vendor: {delivery.deliveryVendor}</div>
          <div>Notes: {delivery.deliveryNotes}</div>
          <div style={styles.imageScrollBox}>
            {delivery?.deliveryReceiptDownloadUrls?.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Receipt ${idx}`}
                style={styles.image}
                onClick={() => openImageInFullScreen(url)}
              />
            ))}
          </div>
          <div style={styles.imageScrollBox}>
            {delivery?.deliveryPhotoDownloadUrls?.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Photo ${idx}`}
                style={styles.image}
                onClick={() => openImageInFullScreen(url)}
              />
            ))}
          </div>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default DeliveryDetail;

