import React, { useState } from 'react';
import UserInput from '../../firebase/utils/UsersInput';
import Table from '../../common/Table';

const Users = () => {
  const [currentItem, setCurrentItem] = useState(null);

  const handleEdit = (item) => {
    setCurrentItem(item);
  };

  const handleCloseModal = () => {
    setCurrentItem(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Manage Users</h2>
      <UserInput currentItem={currentItem} onCloseModal={handleCloseModal} />
      <hr style={{ margin: '20px 0' }} />
      <Table collectionName="users" onEdit={handleEdit} />
    </div>
  );
}

export default Users;
