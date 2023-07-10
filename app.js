const express = require('express')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
// mongoose connect
require('./config/mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json())
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)



app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
