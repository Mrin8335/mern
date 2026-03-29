const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Security/Frontdesk', 'Employee/Host'],
        required: true
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'organizations'
    },
    otpSecret: {
        type: String
    },
    otpEnabled: {
        type: Boolean,
        default: false
    },
    otpVerified: {
        type: Boolean,
        default: false
    }
});

module.exports = User = mongoose.model('users', UserSchema);
