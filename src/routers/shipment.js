const express = require('express')
const Shipment = require('../models/shipment')
const auth = require('../middleware/auth')

const router = express.Router()

// Create a shipment (owned by the logged-in user)
router.post('/shipments', auth, async (req, res) => {
    try {
        const shipment = new Shipment({ ...req.body, owner: req.user._id })
        await shipment.save()
        res.status(201).send(shipment)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

// Get my shipments — supports filter, pagination, sorting
// GET /shipments?status=in-transit&limit=10&skip=0&sortBy=createdAt:desc
router.get('/shipments', auth, async (req, res) => {
    try {
        const match = { owner: req.user._id }
        if (req.query.status) match.status = req.query.status

        const sort = {}
        if (req.query.sortBy) {
            const [field, order] = req.query.sortBy.split(':')
            sort[field] = order === 'desc' ? -1 : 1
        }

        const shipments = await Shipment.find(match)
            .limit(parseInt(req.query.limit) || 0)
            .skip(parseInt(req.query.skip) || 0)
            .sort(sort)

        res.send(shipments)
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

// Public tracking by tracking number (no auth — like a real tracking page)
router.get('/shipments/track/:trackingNumber', async (req, res) => {
    try {
        const shipment = await Shipment.findOne({
            trackingNumber: req.params.trackingNumber.toUpperCase()
        }).select('trackingNumber origin destination status updatedAt')

        if (!shipment) {
            return res.status(404).send({ error: 'Tracking number not found' })
        }
        res.send(shipment)
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

// Get one of my shipments by id
router.get('/shipments/:id', auth, async (req, res) => {
    try {
        const shipment = await Shipment.findOne({ _id: req.params.id, owner: req.user._id })
        if (!shipment) return res.status(404).send({ error: 'Shipment not found' })
        res.send(shipment)
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

// Update one of my shipments (validated fields only)
router.patch('/shipments/:id', auth, async (req, res) => {
    const allowed = ['customer', 'origin', 'destination', 'weightKg', 'status']
    const updates = Object.keys(req.body)
    const isValid = updates.every((u) => allowed.includes(u))
    if (!isValid) return res.status(400).send({ error: 'Invalid updates' })

    try {
        const shipment = await Shipment.findOne({ _id: req.params.id, owner: req.user._id })
        if (!shipment) return res.status(404).send({ error: 'Shipment not found' })

        updates.forEach((u) => shipment[u] = req.body[u])
        await shipment.save()
        res.send(shipment)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

// Delete one of my shipments
router.delete('/shipments/:id', auth, async (req, res) => {
    try {
        const shipment = await Shipment.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!shipment) return res.status(404).send({ error: 'Shipment not found' })
        res.send({ message: 'Shipment deleted successfully', shipment })
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

module.exports = router
