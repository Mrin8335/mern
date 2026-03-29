import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/stats`, config);
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchStats();
    }, []);

    const exportAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob'
            };
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/appointments/export`, config);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'appointments.csv');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error(err);
        }
    };

    const exportCheckLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob'
            };
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/checklogs/export`, config);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'checklogs.csv');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error(err);
        }
    };

    const chartData = {
        labels: ['Total', 'Pending', 'Approved', 'Rejected', 'Checked In'],
        datasets: [
            {
                label: 'Appointments',
                data: stats ? [stats.totalAppointments, stats.pendingAppointments, stats.approvedAppointments, stats.rejectedAppointments, stats.checkedIn] : [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }
        ]
    };

    return (
        <main className="container">
            <h1>Dashboard</h1>
            {stats && (
                <div>
                    <h2>Stats</h2>
                    <button onClick={exportAppointments}>Export Appointments</button>
                    <button onClick={exportCheckLogs}>Export Check Logs</button>
                    <div style={{ width: '600px', margin: 'auto' }}>
                        <Bar data={chartData} />
                    </div>
                </div>
            )}
        </main>
    );
};

export default Dashboard;
