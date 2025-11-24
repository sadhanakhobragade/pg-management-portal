// backend/models/Room.js

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    room_number: { 
        type: String, 
        required: true, 
        unique: true 
    },
    type: { // e.g., single, double, triple
        type: String,
        required: true,
        enum: ['single', 'double', 'triple']
    },
    rent_amount: { 
        type: Number, 
        required: true 
    },
    status: { // e.g., Vacant, Occupied, Maintenance
        type: String,
        enum: ['Vacant', 'Occupied', 'Maintenance'],
        default: 'Vacant'
    },
    current_tenant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null 
    },
    capacity: {
        type: Number,
        required: true,
        default: 1
    }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);