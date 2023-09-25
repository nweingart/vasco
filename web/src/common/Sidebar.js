import { Link } from 'react-router-dom';

const Sidebar = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{
        width: '200px',
        height: '100vh',
        padding: '20px',
        backgroundColor: '#FFC300',
        position: 'fixed',
      }}>
        <h3>Menu</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: 'black' }}>Dashboard</Link>
          <Link to="/dashboard/projects" style={{ textDecoration: 'none', color: 'black' }}>Projects</Link>
          <Link to="/dashboard/vendors" style={{ textDecoration: 'none', color: 'black' }}>Vendors</Link>
          <Link to="/dashboard/users" style={{ textDecoration: 'none', color: 'black' }}>Users</Link>
          <Link to="/dashboard/settings" style={{ textDecoration: 'none', color: 'black' }}>Settings</Link>
        </nav>
      </div>
      <div style={{ flex: 1, padding: '20px', marginLeft: '220px' }}>
        {children}
      </div>
    </div>
  );
}

export default Sidebar
