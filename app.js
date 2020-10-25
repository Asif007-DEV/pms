var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');
var logoutRouter = require('./routes/logout');
var deshboardRouter = require('./routes/deshboard');
var addNewCategoryRouter = require('./routes/addNewCategory');
var categoryListRouter = require('./routes/categoryList');
var addPasswordRouter = require('./routes/addPassword');
var passwordListRouter = require('./routes/passwordList');
var joinRouter = require('./routes/join');
var usersRouter = require('./routes/users');
var categoryApi = require('./api/addCategoryApi');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'sdfldnkj',
  resave: false,
  saveUninitialized: true
}));

app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/logout', logoutRouter);
app.use('/deshboard', deshboardRouter);
app.use('/addNewCategory', addNewCategoryRouter);
app.use('/categoryList', categoryListRouter);
app.use('/addPassword', addPasswordRouter);
app.use('/passwordList', passwordListRouter);
app.use('/joinResults', joinRouter);
app.use('/users', usersRouter);
app.use('/api',categoryApi);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
