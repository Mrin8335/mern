const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const CheckLog = require('../models/CheckLog');
const { Parser } = require('json2csv');

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
    try {
        const totalAppointments = await Appointment.countDocuments({ organization: req.user.organization });
        const pendingAppointments = await Appointment.countDocuments({ organization: req.user.organization, status: 'Pending' });
        const approvedAppointments = await Appointment.countDocuments({ organization: req.user.organization, status: 'Approved' });
        const rejectedAppointments = await Appointment.countDocuments({ organization: req.user.organization, status: 'Rejected' });
        const checkedIn = await CheckLog.countDocuments({ organization: req.user.organization, checkOut: null });

        res.json({
            totalAppointments,
            pendingAppointments,
            approvedAppointments,
            rejectedAppointments,
            checkedIn
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Export appointments as CSV
router.get('/appointments/export', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ organization: req.user.organization }).populate('visitor').populate('host').lean();
        const fields = [
            { label: 'Visitor', value: 'visitor.name' },
            { label: 'Host', value: 'host.name' },
            { label: 'Date', value: 'date' },
            { label: 'Status', value: 'status' }
        ];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(appointments);

        res.header('Content-Type', 'text/csv');
        res.attachment('appointments.csv');
        res.send(csv);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Export check logs as CSV
router.get('/checklogs/export', auth, async (req, res) => {
    try {
        const checkLogs = await CheckLog.find({ organization: req.user.organization }).populate({
            path: 'pass',
            populate: {
                path: 'appointment',
                populate: {
                    path: 'visitor host'
                }
            }
        }).populate('scannedBy').lean();

        const fields = [
            { label: 'Visitor', value: 'pass.appointment.visitor.name' },
            { label: 'Check In', value: 'checkIn' },
            { label: 'Check Out', value: 'checkOut' },
            { label: 'Scanned By', value: 'scannedBy.name' }
        ];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(checkLogs);

        res.header('Content-Type', 'text/csv');
        res.attachment('checklogs.csv');
        res.send(csv);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
