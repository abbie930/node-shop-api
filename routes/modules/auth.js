const router = require('express').Router()
const User = require('../../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

// REGISTER
router.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
  })

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    // find user from db
    const user = await User.findOne({
      username: req.body.username
    })
    console.log(user)

    // If can't find the user return error
    if (!user) {
      return res.status(401).json({ error: 'Wrong name!' })
    }

    // decrypt user password
    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC)
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
    console.log(OriginalPassword)

    // Check if the password matches
    if (OriginalPassword !== req.body.password) {
      return res.status(401).json({ error: 'Wrong Credentials!' })
    }

    // jwt
    const accessToken =  jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    }, process.env.JWT_SEC, {expiresIn:'3d'})

    // To prevent returning password data (解構賦值Destructuring Assignment & 展開運算符Object Spread Operator)
    // user._doc 是 Mongoose 特有的屬性
    const { password, ...others } = user._doc

    res.status(200).json({ ...others, accessToken })
  } catch (err) {
    res.status(500).json({error: err.message})
  }
})


module.exports = router
