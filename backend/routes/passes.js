const express = require('express');
const router = express.Router();
const Pass = require('../models/Pass');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const auth = require('../middleware/auth');

// Create a new pass
router.post('/', auth, async (req, res) => {
    const { appointment, validUntil } = req.body;

    try {
        const qrCode = await QRCode.toDataURL(appointment);

        const newPass = new Pass({
            appointment,
            qrCode,
            validUntil,
            organization: req.user.organization
        });

        const pass = await newPass.save();
        res.json(pass);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get pass as PDF
router.get('/pdf/:id', auth, async (req, res) => {
    try {
        const pass = await Pass.findById(req.params.id).populate({
            path: 'appointment',
            populate: {
                path: 'visitor host'
            }
        });

        if (!pass) {
            return res.status(404).json({ msg: 'Pass not found' });
        }

        if (pass.organization.toString() !== req.user.organization) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${pass.appointment.visitor.name}-pass.pdf`);
        doc.pipe(res);

        doc.fontSize(25).text('Visitor Pass', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Name: ${pass.appointment.visitor.name}`);
        doc.text(`Company: ${pass.appointment.visitor.company}`);
        doc.text(`Host: ${pass.appointment.host.name}`);
        doc.text(`Valid Until: ${pass.validUntil.toDateString()}`);
        doc.moveDown();
        doc.image(pass.qrCode, {
            fit: [250, 250],
            align: 'center',
            valign: 'center'
        });

        doc.end();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
