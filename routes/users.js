const router = require('express').Router()
const User = require('../models/User')
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken')


// EDIT
router.put('/:id', verifyToken, async (req, res) => {
   if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      // set the contents of the request body as the new values for the user data and return the updated user record.
      {
        // $set is the update operator in Mongoose
        $set: req.body
      },
      // return the updated user record instead of the pre-update record. This allows to immediately access the updated data.
      { new: true }
    )
    res.status(200).json(updatedUser)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json('User has been deleted...')
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET USER
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...others } = user._doc
    res.status(200).json(others)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET ALL USER
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  // retrieve the value of the new parameter from the request's query parameters. This parameter is a boolean value that indicates whether to retrieve only the latest user data.
  const query = req.query.new
  try {
    const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find()
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET USER STATS
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
  // represent the current date and time
  const date = new Date()
  // hold the date one year ago from the current date : subtract 1 from the year of the date object
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

  try {
    // use aggregation operations to calculate the number of new users per month in the past year.
    const data = await User.aggregate([
      // $gte is one of the query operators in MongoDB, used to compare the value of a field with a specified value to check if it is greater than or equal to that value. (lastYear is the value being compared, representing a date one year ago.)
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' }
        }
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 }
        }
      }
    ])
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router