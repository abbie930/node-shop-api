const router = require('express').Router()
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../../middleware/verifyToken')

const orderController = require('../../controllers/order-controller')

router.get('/find/:userId', verifyTokenAndAuthorization, orderController.getUserOrders)
router.get('/income', verifyTokenAndAdmin, orderController.getMonthlyIncome)
router.put('/:id', verifyTokenAndAdmin, orderController.editOrder)
router.delete('/:id', verifyTokenAndAdmin, orderController.deleteOrder)
router.get('/', verifyTokenAndAdmin, orderController.getAllOrders)
router.post('/', verifyToken, orderController.createOrder)

module.exports = router
