require("dotenv").config()
const createError = require('http-errors');
const express = require('express');
const mongoose = require("mongoose")
const appUtils = require("./utils");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const fileRouter = require("./routes/file")
const linkRouter = require("./routes/link")

const app = express();
appUtils(app)

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log("connected to my db") })
  .catch(e => { 
    console.log(e)
    process.exit(1)
   })

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter)
app.use('/f', fileRouter)
app.use('/l', linkRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
