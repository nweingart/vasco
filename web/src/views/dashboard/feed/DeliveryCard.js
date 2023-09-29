import React from 'react';

const DeliveryCard = ({ data, onClick }) => {

  const cardStyle = {
    border: '1px solid #ddd',
    padding: '15px',
    margin: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer'
  };

  const infoStyle = {
    marginBottom: '10px',
    fontSize: '14px'
  };

  const imgRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    overflowX: 'auto',
    padding: '5px 0'
  };

  const imgStyle = {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  const handleImageClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      <div style={infoStyle}>Status: {data.deliveryStatus}</div>
      <div style={infoStyle}>Project: {data.deliveryProject}</div>
      <div style={infoStyle}>Vendor: {data.deliveryVendor}</div>
      <div style={infoStyle}>Notes: {data.deliveryNotes}</div>

      <div style={infoStyle}>
        Receipts:
        <div style={imgRowStyle}>
          {data.deliveryReceiptDownloadUrls?.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Receipt ${index}`}
              style={imgStyle}
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick(url);
              }}
            />
          ))}
        </div>
      </div>
      <div style={infoStyle}>
        Photos:
        <div style={imgRowStyle}>
          {data.deliveryPhotoDownloadUrls?.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Photo ${index}`}
              style={imgStyle}
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick(url);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryCard;

