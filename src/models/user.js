const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'shipping_api_secret'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String, required: true, unique: true, trim: true, lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error('Email is invalid')
        }
    },
    password: { type: String, required: true, minlength: 7, trim: true },
    role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
    tokens: [{ token: { type: String, required: true } }]
}, { timestamps: true })

// Relationship: a user owns many shipments
userSchema.virtual('shipments', {
    ref: 'Shipment',
    localField: '_id',
    foreignField: 'owner'
})

// Hide sensitive data from any response
userSchema.methods.toJSON = function () {
    const user = this.toObject()
    delete user.password
    delete user.tokens
    return user
}

// Generate a JWT for the user
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' })
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

// Find a user by email + password (login)
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) throw new Error('Unable to login')
    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch) throw new Error('Unable to login')
    return user
}

// Hash the password before saving
userSchema.pre('save', async function () {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8)
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User
