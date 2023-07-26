const router = require('express').Router()
const { verifyTokenAndAdmin } = require('../../middleware/verifyToken')

const productController = require('../../controllers/product-controller')


router.get('/find/:id', productController.getProduct)
router.put('/:id', verifyTokenAndAdmin, productController.editProduct)
router.put('/:id', verifyTokenAndAdmin, productController.editProduct)
router.delete('/:id', verifyTokenAndAdmin, productController.deleteProduct)
router.post('/', verifyTokenAndAdmin, productController.createProduct)
router.get('/', productController.getAllProduct)


module.exports = router
