// backend/controllers/aiController.js

const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Room = require('../models/Room');

// Simple helper function to check if a keyword exists in the message (case-insensitive)
const containsKeyword = (message, keywords) => {
    const lowerCaseMessage = message.toLowerCase();
    return keywords.some(keyword => lowerCaseMessage.includes(keyword));
};

// Data store for simple/fixed property info (REPLACING EXTERNAL AI DRAFTING/FAQ)
const propertyInfo = {
    'wifi': 'The Wi-Fi password is "PG_SecureNet123". Please do not share it outside the property.',
    'quiet hours': 'Quiet hours are enforced strictly between 10 PM and 8 AM.',
    'guests': 'Guests are permitted for a maximum of 2 consecutive nights, with prior notification to the owner.',
    'default_rent_due_date': 'The standard rent due date is the 5th of every month.',
};


exports.generateChatResponse = async (message, userId) => {
    let defaultResponse = "I'm the PG Management Assistant. I can check your rent, room, or complaints. How can I assist you?";

    try {
        // Fetch the current user and their detailed data (Room population is essential here)
        const user = await User.findById(userId).populate('room');

        if (!user) {
            return "I couldn't find your user profile in the system. Please ensure you are logged in.";
        }

        const userRole = user.role;
        const userName = user.name.split(' ')[0]; 
        
        // --- 1. GREETINGS ---
        if (containsKeyword(message, ['hello', 'hi', 'hey'])) {
            return `Hello ${userName}! I am your automated PG Assistant. What can I assist you with today?`;
        }

        // ===========================================
        // TENANT-FOCUSED DATA QUERIES
        // ===========================================
        if (userRole === 'tenant') {
            const hasRoom = user.room && user.room.room_number !== 'Unassigned';

            // 1. Rent/Financial Inquiry (Pulls live data)
            if (containsKeyword(message, ['rent', 'amount', 'due date', 'deposit'])) {
                if (!hasRoom) return "You must be assigned a room to get financial details.";
                
                if (containsKeyword(message, ['deposit', 'security'])) {
                     return `Your security deposit amount is ₹${user.room.rent_amount * 2}.`;
                }
                
                return `Your monthly rent amount is ₹${user.room.rent_amount.toLocaleString()}. The rent is due by the ${propertyInfo.default_rent_due_date}.`;
            }

            // 2. Complaint Status
            if (containsKeyword(message, ['complaint', 'status', 'issue'])) {
                const pendingComplaints = await Complaint.countDocuments({ tenant: userId, status: 'Pending' });
                return pendingComplaints > 0 
                    ? `You have ${pendingComplaints} request(s) pending owner review.` 
                    : "You have no outstanding maintenance complaints.";
            }
        }

    

        // ===========================================
        // OWNER-FOCUSED DATA QUERIES
        // ===========================================
        if (userRole === 'owner') {
            // Pre-calculate counts for both checks (less overhead)
            const occupiedRoomsCount = await Room.countDocuments({ status: 'occupied' });
            const totalRooms = await Room.countDocuments();
            const vacantRooms = totalRooms - occupiedRoomsCount;

        

// 🛑 1. FINANCIAL OVERVIEW (REVENUE) - PRIORITY 1
if (containsKeyword(message, ['revenue', 'income', 'monthly money', 'earn'])) {
    
    
    const totalRevenue = await Room.aggregate([
        // This array ensures we match whatever casing was used in the database:
        { $match: { status: { $in: ['occupied', 'Occupied'] } } }, 
        { $group: { _id: null, total: { $sum: '$rent_amount' } } }
    ]);
    
    const revenue = totalRevenue[0]?.total || 0;
    
    return `Your current expected monthly revenue is ₹${revenue.toLocaleString()}.`;
}


            // 🛑 2. OCCUPANCY SUMMARY - PRIORITY 2: Check for general room terms
            if (containsKeyword(message, ['vacant', 'occupancy', 'rooms', 'total', 'occupied', 'how many'])) {
                return `You have ${totalRooms} total rooms. ${vacantRooms} are currently vacant and ${occupiedRoomsCount} are occupied.`;
            }
            
            // 3. Pending Actions
            if (containsKeyword(message, ['pending', 'maintenance', 'requests', 'actions'])) {
                const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
                return pendingComplaints > 0
                    ? `ATTENTION: You have ${pendingComplaints} urgent complaints pending resolution.`
                    : "No pending maintenance requests at this time.";
            }
        }
    

        // ===========================================
        // 3. GENERAL FAQ QUERIES (Rule-Based fixed data)
        // ===========================================
        if (containsKeyword(message, ['wi-fi', 'password', 'internet'])) {
            return propertyInfo.wifi;
        }
        if (containsKeyword(message, ['quiet hours', 'rules'])) {
            return propertyInfo['quiet hours'];
        }
        if (containsKeyword(message, ['guests', 'visitor'])) {
            return propertyInfo.guests;
        }


    } catch (err) {
        console.error("AI Controller Error:", err.message);
        return "I apologize, an internal server error occurred while processing your data query.";
    }

    return defaultResponse; // Default response if no specific rule matches
};