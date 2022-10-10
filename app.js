require('dotenv').config();
require('express-async-errors');

const port = process.env.PORT || 5000;

// express
const express = require('express');
const app = express();

// DB
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routers/auth');
const usersRouter = require('./routers/users');
const productsRouter = require('./routers/products');
const reviewsRouter = require('./routers/reviews');
const ordersRouter = require('./routers/orders');

// middlewares
const notFound = require('./middleware/not-found');
const errorHanlder = require('./middleware/error-handler');

// other external packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const helemt = require('helmet');
const rateLimiter = require('express-rate-limit');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

app.set('trust proxy', 1);
app.use(rateLimiter({
 windowMs: 15 * 60 * 1000,
 max: 50,
}));
app.use(helemt());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

// app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'))
app.use(fileUpload());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/orders', ordersRouter);

app.use(notFound);
app.use(errorHanlder);

const start = async () => {
 try {
  await connectDB(process.env.MONGO_URI);
  app.listen(port, () => console.log(`Listening on port ${ port }`));  
 } catch (err) {
  console.log(err);
  exist(1);
 }
}

start();