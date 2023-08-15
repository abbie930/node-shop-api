const router = require('express').Router()
const User = require('../../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')

// REGISTER
router.post(
  '/register',
  // 表單驗證
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 10 })
      .withMessage('Username must be between 3 and 10 characters.')
      .notEmpty()
      .withMessage('Username is required.'),
    body('email').isEmail().withMessage('Invalid email format.').notEmpty().withMessage('Email is required.'),
    body('password')
      .matches(/^\S*$/)
      .withMessage('Whitespace is not allowed.')
      .isLength({ min: 8, max: 20 })
      .withMessage('Password must be between 8 and 20 characters.')
      .notEmpty()
      .withMessage('Password is required.'),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords must match.')
      .notEmpty()
      .withMessage('Confirm password is required.')
  ],
  async (req, res) => {
    // 回傳表單驗證錯誤
    const error = validationResult(req)
    // 驗證 user & email 是否存在
    const existErrors = []
    const [existingUser, existingEmail] = await Promise.all([
      User.findOne({ username: req.body.username }),
      User.findOne({ email: req.body.email })
    ])
    if (existingUser) existErrors.push('Username is already taken.')
    if (existingEmail) existErrors.push('Email is already taken.')
    // combine existErrors && validationErrors
    if (existErrors.length || !error.isEmpty()) {
      // 存取表單驗證 msg
      const validationErrors = error.array().map((errorObj) => errorObj.msg)
      const allErrors = [...existErrors, ...validationErrors]
      return res.status(400).json({ status: 'error', message: allErrors.join('\n') })
    }

    try {
      const encryptedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()

      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: encryptedPassword
      })

      const savedUser = await newUser.save()
      res.status(201).json(savedUser)
    } catch (err) {
      res.status(500).json(err)
    }
  }
)

// LOGIN
router.post('/login', async (req, res) => {
  try {
    // find user from db
    const user = await User.findOne({
      username: req.body.username
    })

    // If can't find the user return error
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Incorrect username or password' })
    }

    // decrypt user password
    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC)
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)

    // Check if the password matches
    if (OriginalPassword !== req.body.password) {
      return res.status(401).json({ status: 'error', message: 'Incorrect username or password!' })
    }

    // jwt
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SEC,
      { expiresIn: '3d' }
    )

    // To prevent returning password data (解構賦值Destructuring Assignment & 展開運算符Object Spread Operator)
    // user._doc 是 Mongoose 特有的屬性
    const { password, ...others } = user._doc

    res.status(200).json({ ...others, accessToken })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
