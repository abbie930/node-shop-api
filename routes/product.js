const router = require('express').Router()
const Product = require('../models/Product')
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken')



// CREATE
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body)

  try {
    const savedProduct = await newProduct.save()
    res.status(200).json(savedProduct)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// EDIT
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    res.status(200).json(updatedProduct)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


module.exports = router
