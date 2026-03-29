const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PassSchema = new Schema({
    appointment: {
        type: Schema.Types.ObjectId,
        ref: 'appointments'
    },
    qrCode: {
        type: String,
        required: true
    },
    issuedAt: {
        type: Date,
        default: Date.now
    },
    validUntil: {
        type: Date,
        required: true
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'organizations'
    }
});

module.exports = Pass = mongoose.model('passes', PassSchema);
