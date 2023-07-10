const router = require('express').Router()
const Cart = require('../models/Cart')
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

//CREATE (any user can create its own cart)
router.post('/', verifyToken, async (req, res) => {
  const newCart = new Cart(req.body)

  try {
    const savedCart = await newCart.save()
    res.status(200).json(savedCart)
  } catch (err) {
    res.status(500).json(err)
  }
})

// EDIT (user can only change its own card )
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    )
    res.status(200).json(updatedCart)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
