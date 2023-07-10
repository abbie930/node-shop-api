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
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    )
    res.status(200).json(updatedProduct)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

//DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json('Product has been deleted...')
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

//GET PRODUCT (everybody can see product)
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
