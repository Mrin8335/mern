const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
const Organization = require('../models/Organization');
const auth = require('../middleware/auth');
// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role, organizationName } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        let organization = await Organization.findOne({ name: organizationName });
        if (!organization) {
            organization = new Organization({ name: organizationName });
            await organization.save();
        }

        user = new User({
            name,
            email,
            password,
            role,
            organization: organization._id
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            'secret',
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        if (user.otpEnabled) {
            const payload = {
                user: {
                    id: user.id,
                    organization: user.organization,
                    otp: true
                }
            };

            const tempToken = jwt.sign(
                payload,
                'secret',
                { expiresIn: '5m' }
            );
            return res.json({ otpRequired: true, tempToken });
        }

        const payload = {
            user: {
                id: user.id,
                organization: user.organization
            }
        };

        jwt.sign(
            payload,
            'secret',
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// OTP Setup
router.post('/otp/setup', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const secret = speakeasy.generateSecret({
            name: `Visitor Pass Management (${user.email})`
        });

        user.otpSecret = secret.base32;
        await user.save();

        qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error generating QR code');
            }
            res.json({ secret: secret.base32, qrCode: data_url });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// OTP Verify
router.post('/otp/verify', auth, async (req, res) => {
    const { token } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.otpSecret,
            encoding: 'base32',
            token
        });

        if (verified) {
            user.otpEnabled = true;
            user.otpVerified = true;
            await user.save();
            res.json({ msg: 'OTP enabled' });
        } else {
            res.status(400).json({ msg: 'Invalid OTP' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// OTP Authenticate
router.post('/otp/authenticate', auth, async (req, res) => {
    const { token } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.otpSecret,
            encoding: 'base32',
            token,
            window: 1
        });

        if (!verified) {
            return res.status(400).json({ msg: 'Invalid OTP' });
        }

        const payload = {
            user: {
                id: user.id,
                organization: user.organization
            }
        };

        jwt.sign(
            payload,
            'secret',
            { expiresIn: 3600 },
            (err, jwtToken) => {
                if (err) throw err;
                res.json({ token: jwtToken });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
