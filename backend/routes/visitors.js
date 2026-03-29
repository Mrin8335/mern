const express = require('express');
const router = express.Router();
const multer = require('multer');
const Visitor = require('../models/Visitor');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Register a new visitor
router.post('/', [auth, upload.single('photo')], async (req, res) => {
    const { name, email, phone, company } = req.body;
    const photo = req.file.path;

    try {
        const newVisitor = new Visitor({
            name,
            email,
            phone,
            company,
            photo,
            organization: req.user.organization
        });

        const visitor = await newVisitor.save();
        res.json(visitor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
