const Cart = require('../models/Cart')

const cartController = {
  // any user can create its own cart
  createCart: async (req, res, next) => {
    const newCart = new Cart(req.body)

    try {
      const savedCart = await newCart.save()
      res.status(200).json(savedCart)
    } catch (err) {
      next(err)
    }
  },
  editCart: async (req, res, next) => {
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
      next(err)
    }
  },
  deleteCart: async (req, res, next) => {
    try {
      await Cart.findByIdAndDelete(req.params.id)
      res.status(200).json('Cart has been deleted...')
    } catch (err) {
      next(err)
    }
  },
  getUserCart: async (req, res, next) => {
    try {
      // every user has only one cart
      const cart = await Cart.findOne({ userId: req.params.userId })
      res.status(200).json(cart)
    } catch (err) {
      next(err)
    }
  },
  getAllUsersCart: async (req, res, next) => {
    try {
      const carts = await Cart.find()
      res.status(200).json(carts)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = cartController
