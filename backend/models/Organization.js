const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = Organization = mongoose.model('organizations', OrganizationSchema);
