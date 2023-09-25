import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './views/dashboard/DeliveryHistory'
import Login from './views/auth/Login'
import Register from './views/auth/Register'
import { AuthProvider } from './context/context';
import PrivateRoute from './context/privateRoute';
import { Provider } from "react-redux";
import { store } from './redux/Redux';
import Sidebar from "./common/Sidebar";
import Users from "./views/dashboard/Users";
import Vendors from "./views/dashboard/Vendors";
import Projects from "./views/dashboard/Projects";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute />} >
              <Route index element={
                <Sidebar>
                  <Dashboard />
                </Sidebar>
              } />
              <Route path="users" element={
                <Sidebar>
                  <Users />
                </Sidebar>
              } />
              <Route path="vendors" element={
                <Sidebar>
                  <Vendors />
                </Sidebar>
              } />
              <Route path="projects" element={
                <Sidebar>
                  <Projects />
                </Sidebar>
              } />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </Provider>
  );
}

export default App;
