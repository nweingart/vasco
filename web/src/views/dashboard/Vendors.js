import React from 'react';
import VendorInput from "../../firebase/utils/VendorInput";
import Table from "../../common/Table";

const Vendors = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Manage Vendors</h2>
      <VendorInput/>
      <hr style={{ margin: '20px 0' }} />
      <Table collectionName="vendors" />
    </div>
  );
}

export default Vendors
