const mongoose = require('mongoose')

const shipmentSchema = new mongoose.Schema({
    trackingNumber: {
        type: String, required: true, unique: true, trim: true, uppercase: true
    },
    customer: { type: String, required: true, trim: true },
    origin: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    weightKg: {
        type: Number, required: true,
        validate(value) {
            if (value <= 0) throw new Error('Weight must be a positive number')
        }
    },
    status: {
        type: String,
        enum: ['pending', 'in-transit', 'delivered', 'cancelled'],
        default: 'pending'
    },
    // Relationship: each shipment belongs to a user (owner)
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true })

const Shipment = mongoose.model('Shipment', shipmentSchema)
module.exports = Shipment
