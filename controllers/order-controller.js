const Order = require('../models/Order')

const orderController = {
  createOrder: async (req, res, next) => {
    const newOrder = new Order(req.body)

    try {
      const savedOrder = await newOrder.save()
      res.status(200).json(savedOrder)
    } catch (err) {
      next(err)
    }
  },
  editOrder: async (req, res, next) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body
        },
        { new: true }
      )
      res.status(200).json(updatedOrder)
    } catch (err) {
      next(err)
    }
  },
  deleteOrder: async (req, res, next) => {
    try {
      await Order.findByIdAndDelete(req.params.id)
      res.status(200).json('Order has been deleted...')
    } catch (err) {
      next(err)
    }
  },
  getUserOrders: async (req, res, next) => {
    try {
      // users can have more than one orders
      const orders = await Order.find({ userId: req.params.userId })
      res.status(200).json(orders)
    } catch (err) {
      next(err)
    }
  },
  getAllOrders: async (req, res, next) => {
    try {
      const orders = await Order.find()
      res.status(200).json(orders)
    } catch (err) {
      next(err)
    }
  },
  getMonthlyIncome: async (req, res, next) => {
    // use only this month and previous month => compare our incomes
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))

    // aggregate our data
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: '$createdAt' },
            sales: '$amount'
          }
        },
        {
          $group: {
            _id: '$month',
            total: { $sum: '$sales' }
          }
        }
      ])
      res.status(200).json(income)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = orderController
