const express = require('express')
const router = require('./routes')
const cors = require('cors')

// mongoose connect
require('./config/mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api', router)


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
