const express = require('express');
const router = express.Router();
const CheckLog = require('../models/CheckLog');
const Pass = require('../models/Pass');
const auth = require('../middleware/auth');

// Check-in
router.post('/checkin', auth, async (req, res) => {
    const { passId } = req.body;
    const scannedBy = req.user.id;

    try {
        const pass = await Pass.findById(passId);
        if (!pass) {
            return res.status(404).json({ msg: 'Pass not found' });
        }

        const newCheckLog = new CheckLog({
            pass: passId,
            checkIn: new Date(),
            scannedBy,
            organization: req.user.organization
        });

        const checkLog = await newCheckLog.save();
        res.json(checkLog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Check-out
router.put('/checkout/:id', auth, async (req, res) => {
    try {
        const checkLog = await CheckLog.findOne({ pass: req.params.id, checkOut: null });
        if (!checkLog) {
            return res.status(404).json({ msg: 'Check-in log not found' });
        }

        if (checkLog.organization.toString() !== req.user.organization) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        checkLog.checkOut = new Date();
        await checkLog.save();
        res.json(checkLog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all check logs
router.get('/', auth, async (req, res) => {
    try {
        const checkLogs = await CheckLog.find({ organization: req.user.organization }).populate({
            path: 'pass',
            populate: {
                path: 'appointment',
                populate: {
                    path: 'visitor host'
                }
            }
        }).populate('scannedBy');
        res.json(checkLogs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
