const router = require('express').Router()
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../../middleware/verifyToken')

const cartController = require('../../controllers/cart-controller')

router.get('/find/:userId', verifyTokenAndAuthorization, cartController.getUserCart)
router.put('/:id', verifyTokenAndAuthorization, cartController.editCart)
router.delete('/:id', verifyTokenAndAuthorization, cartController.deleteCart)
router.post('/', verifyToken, cartController.createCart)
router.get('/', verifyTokenAndAdmin, cartController.createCart)

module.exports = router
