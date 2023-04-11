const siteRouter = require('./site');
const productsRouter = require('./products');
const usersRouter = require('./users');
const bodyParser = require('body-parser');
const AuthRouter = require('./auth')

function route(app){

    app.use('/products',productsRouter);
    app.use('/users',usersRouter);
    app.use('/auth',AuthRouter);

    app.use('/',siteRouter);  //trang chu,luon de duoi 
    

}

module.exports = route;
