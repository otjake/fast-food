var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {handleErrors, AppError} = require("./api/middleware/customErrorHandler");
var rfs = require('rotating-file-stream');
const bodyParser = require("body-parser");


var indexRouter = require('./api/routes/index');
var usersRouter = require('./api/routes/users');
var categoriesRouter = require('./api/routes/category');
var productsRouter = require('./api/routes/product');
const authenticateUserMiddleware = require("./api/middleware/auth");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// setup the logger
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
})


app.use(logger('combined', { stream: accessLogStream }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
// app.use(morgan('tiny'));
// app.use(expressValidator)

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/category', authenticateUserMiddleware, categoriesRouter);
app.use('/product', authenticateUserMiddleware, productsRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
// });
app.all("*", (req, res, next) => {
    next(new AppError ( `This path ${req.originalUrl} isn't on this server!`, 404));
});

app.use(handleErrors);

// error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

module.exports = app;
