import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

import OTPLogin from './components/OTPLogin';
import OTPSetup from './components/OTPSetup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/otp-login" element={<OTPLogin />} />
        <Route path="/otp-setup" element={<OTPSetup />} />
      </Routes>
    </Router>
  );
}

export default App;
