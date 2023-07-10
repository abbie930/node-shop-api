const router = require('express').Router()
const User = require('../models/User')
const { verifyToken, verifyTokenAndAuthorization } = require('../middleware/verifyToken')


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

module.exports = router