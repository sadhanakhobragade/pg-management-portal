// backend/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   name: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true }, 
   role: { 
      type: String, 
      enum: ['owner', 'tenant'], 
      default: 'tenant' 
   },
    
    phone: { type: String, default: 'N/A' }, 
   room: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Room',
      default: null
   },
   is_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
