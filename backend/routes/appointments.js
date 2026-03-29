const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const { sendEmail, sendSms } = require('../utils/notifications');

// Create a new appointment
router.post('/', auth, async (req, res) => {
    const { visitor, host, date } = req.body;

    try {
        const newAppointment = new Appointment({
            visitor,
            host,
            date,
            organization: req.user.organization
        });

        const appointment = await newAppointment.save();

        // Notify host
        const populatedAppointment = await Appointment.findById(appointment._id).populate('host');
        const hostEmail = populatedAppointment.host.email;
        const emailSubject = 'New Appointment Request';
        const emailText = `You have a new appointment request. Please log in to approve or reject it.`;
        await sendEmail(hostEmail, emailSubject, emailText);

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all appointments
router.get('/', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ organization: req.user.organization }).populate('visitor').populate('host');
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Approve an appointment
router.put('/approve/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate('visitor');
        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        if (appointment.organization.toString() !== req.user.organization) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        appointment.status = 'Approved';
        await appointment.save();

        // Notify visitor
        const visitorEmail = appointment.visitor.email;
        const visitorPhone = appointment.visitor.phone;
        const emailSubject = 'Appointment Approved';
        const emailText = `Your appointment has been approved.`;
        const smsText = `Your appointment has been approved.`;
        await sendEmail(visitorEmail, emailSubject, emailText);
        await sendSms(visitorPhone, smsText);

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Reject an appointment
router.put('/reject/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        if (appointment.organization.toString() !== req.user.organization) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        appointment.status = 'Rejected';
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
