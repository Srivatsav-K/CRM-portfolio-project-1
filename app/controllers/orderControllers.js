const Order = require('../models/order')

const orderControllers = {}

orderControllers.list = (req, res) => {
    const userId = req.user._id

    Order.find({ user: userId }).populate('client', ['name']).populate('contact', ['name'])
        .then((orders) => {
            res.json(orders)
        })
        .catch((err) => {
            res.json(err)
        })
}

orderControllers.listAll = (req, res) => {
    Order.find().populate('client', ['name']).populate('contact', ['name']).populate('user', ['username'])
        .then((orders) => {
            res.json(orders)
        })
        .catch((err) => {
            res.json(err)
        })
}

orderControllers.show = (req, res) => {
    const userId = req.user._id
    const id = req.params.id

    Order.findOne({ _id: id }).populate('client', ['name']).populate('contact', ['name']).populate('user', ['username'])
        .then((order) => {
            if (!order) {
                res.json({ errors: 'Not found!' })
            } else {
                res.json(order)
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

orderControllers.create = (req, res) => {
    const userId = req.user._id
    const body = req.body

    const order = new Order({ ...body, user: userId })
    order.save()
        .then((order) => {
            Order.findById(order._id).populate('client', ['name']).populate('contact', ['name']).populate('user', ['username'])
                .then((order) => {
                    res.json(order)
                })
                .catch((err) => {
                    res.json(err)
                })
        })
        .catch((err) => {
            res.json(err)
        })
}

orderControllers.update = (req, res) => {
    const userId = req.user._id
    const body = req.body
    const id = req.params.id

    Order.findByIdAndUpdate(id, body, { new: true, runValidators: true }).populate('client', ['name']).populate('contact', ['name']).populate('user', ['username'])
        .then((order) => {
            if (!order) {
                res.json({ errors: 'Not found!' })
            } else {
                res.json(order)
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

orderControllers.destroy = (req, res) => {
    const userId = req.user._id
    const id = req.params.id

    Order.findOneAndDelete({ _id: id })
        .then((order) => {
            if (!order) {
                res.json({ errors: 'Not found!' })
            } else {
                res.json(order)
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = orderControllers