// backend/models/Complaint.js

const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    issue: { // Short summary/title of the issue
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    },
    resolution_details: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);