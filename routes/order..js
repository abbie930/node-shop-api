const router = require('express').Router()
const Order = require('../models/Order')
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

//CREATE
router.post('/', verifyToken, async (req, res) => {
  const newOrder = new Order(req.body)

  try {
    const savedOrder = await newOrder.save()
    res.status(200).json(savedOrder)
  } catch (err) {
    res.status(500).json(err)
  }
})

// EDIT (only admin can update)
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    )
    res.status(200).json(updatedOrder)
  } catch (err) {
    res.status(500).json(err)
  }
})

//DELETE (only admin can delete)
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.status(200).json('Order has been deleted...')
  } catch (err) {
    res.status(500).json(err)
  }
})

//GET USER ORDERS
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    // users can have more than one orders
    const orders = await Order.find({ userId: req.params.userId })
    res.status(200).json(orders)
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET ALL ORDERS (only for admin)
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
    res.status(200).json(orders)
  } catch (err) {
    res.status(500).json(err)
  }
})
