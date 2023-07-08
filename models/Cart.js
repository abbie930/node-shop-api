const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema(
  {
    // any user has one cart
    userId: {
      type: String,
      required: true
    },
    // array
    products: [
      {
        productId: { type: String },
        quantity: { type: Number, default: 1 }
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('Cart', CartSchema)
