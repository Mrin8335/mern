const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
    visitor: {
        type: Schema.Types.ObjectId,
        ref: 'visitors'
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'organizations'
    }
});

module.exports = Appointment = mongoose.model('appointments', AppointmentSchema);
