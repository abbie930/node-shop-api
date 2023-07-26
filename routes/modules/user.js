const router = require('express').Router()
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../../middleware/verifyToken')

const userController = require('../../controllers/user-controller')


router.put('/:id', verifyToken, userController.editUser)
router.delete('/:id', verifyTokenAndAuthorization,userController.deleteUser)
router.get('/find/:id', verifyTokenAndAdmin, userController.getUser)
router.get('/', verifyTokenAndAdmin, userController.getAllUser)
router.get('/stats', verifyTokenAndAdmin, userController.getUserStats)


module.exports = router