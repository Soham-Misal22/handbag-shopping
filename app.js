const express =  require('express');
const cors = require('cors');
const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const indexRouter = require('./routes/indexRouter')
const ownersRouter = require('./routes/ownersRouter')
const usersRouter = require('./routes/usersRouter')
const productsRouter = require('./routes/productsRouter')
const expressSession = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

app.set('view engine', 'ejs')
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(flash());

const db = require('./config/mongoose-connection')

app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/owners', ownersRouter)
app.use('/product', indexRouter)

app.listen(3000);