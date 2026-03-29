const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CheckLogSchema = new Schema({
    pass: {
        type: Schema.Types.ObjectId,
        ref: 'passes'
    },
    checkIn: {
        type: Date
    },
    checkOut: {
        type: Date
    },
    scannedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'organizations'
    }
});

module.exports = CheckLog = mongoose.model('checklogs', CheckLogSchema);
