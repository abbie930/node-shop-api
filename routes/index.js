const express = require('express')
const router = express.Router()

const user = require('./modules/user')
const product = require('./modules/product')
const cart = require('./modules/cart')
const order = require('./modules/order')
const auth = require('./modules/auth')
const stripe = require('./modules/stripe')

const { errorHandler } = require('../middleware/error-handler')

router.use('/product', product)
router.use('/user', user)
router.use('/cart', cart)
router.use('/order', order)
router.use('/auth', auth)
router.use('checkout', stripe)

router.use('/', errorHandler)

module.exports = router
