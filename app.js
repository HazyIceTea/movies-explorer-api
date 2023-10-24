require('dotenv').config();
const helmet = require('helmet')
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('express');
const { errors } = require('celebrate');
const cors = require('cors');
const { errorLogger } = require('express-winston');
const { requestLogger } = require('./middlewares/logger');
const DefaultErrorHandler = require('./middlewares/DefaultErrorHandler');
const {limiter} = require("./utils/constants");

const { PORT = 3000, DB_LINK } = process.env;

mongoose.connect(DB_LINK, {});

const app = express();

app.use(cors());

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(limiter)

app.use('/', require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use(DefaultErrorHandler);

app.listen(PORT);
