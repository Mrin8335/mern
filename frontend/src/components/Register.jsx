import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Employee/Host',
        organizationName: ''
    });
    const navigate = useNavigate();

    const { name, email, password, role, organizationName } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, { name, email, password, role, organizationName });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="container">
            <h1>Register</h1>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                />
                <input
                    type="text"
                    placeholder="Organization Name"
                    name="organizationName"
                    value={organizationName}
                    onChange={onChange}
                    required
                />
                <select name="role" value={role} onChange={onChange}>
                    <option value="Admin">Admin</option>
                    <option value="Security/Frontdesk">Security/Frontdesk</option>
                    <option value="Employee/Host">Employee/Host</option>
                </select>
                <button type="submit">Register</button>
            </form>
        </main>
    );
};

export default Register;
