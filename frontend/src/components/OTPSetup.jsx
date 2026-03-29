import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OTPSetup = () => {
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const setupOTP = async () => {
            try {
                const authToken = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                };
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/otp/setup`, {}, config);
                setQrCode(res.data.qrCode);
                setSecret(res.data.secret);
            } catch (err) {
                console.error(err);
            }
        };

        setupOTP();
    }, []);

    const onChange = e => setToken(e.target.value);

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const authToken = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/users/otp/verify`, { token }, config);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="container">
            <h1>Set up OTP</h1>
            <p>Scan the QR code with your authenticator app and enter the OTP to verify.</p>
            {qrCode && <img src={qrCode} alt="QR Code" />}
            <p>Your secret: {secret}</p>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="OTP"
                    name="token"
                    value={token}
                    onChange={onChange}
                    required
                />
                <button type="submit">Verify</button>
            </form>
        </main>
    );
};

export default OTPSetup;
