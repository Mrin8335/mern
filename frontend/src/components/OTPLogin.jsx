import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const OTPLogin = () => {
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { tempToken } = location.state;

    const onChange = e => setToken(e.target.value);

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${tempToken}`
                }
            };
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/otp/authenticate`, { token }, config);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="container">
            <h1>Enter OTP</h1>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="OTP"
                    name="token"
                    value={token}
                    onChange={onChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </main>
    );
};

export default OTPLogin;
