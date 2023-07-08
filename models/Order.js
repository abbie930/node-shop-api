const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    // Array
    products: [
      {
        productId: { type: String },
        quantity: { type: Number, default: 1 }
      }
    ],
    amount: {
      type: Number,
      required: true
    },
    // after purchasing the stripe library, is going to return as an object
    address: {
      type: Object,
      required: true
    },
    status: {
      type: String,
      default: "pending"
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', OrderSchema)
