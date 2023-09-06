import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './views/dashboard/DeliveryHistory'
import Login from './views/auth/Login'
import Register from './views/auth/Register'
import { AuthProvider } from './context/context';
import PrivateRoute from './context/privateRoute';
import { Provider } from "react-redux";
import { store } from './redux/Redux';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute />} >
              <Route index element={<Dashboard />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </Provider>
  );
}

export default App;
