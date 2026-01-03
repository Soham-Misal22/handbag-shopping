const express =  require('express');
const app = express()

const ownersRouter = require('./routes/ownersRouter')
const usersRouter = require('./routes/usersRouter')
const productsRouter = require('./routes/productsRouter')

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const db = require('./config/mongoose-connection')

app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/owners', ownersRouter)

app.listen(3000);