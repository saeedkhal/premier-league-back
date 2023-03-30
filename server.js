const express = require('express');
const morgan = require('morgan');
const apiRouter = require('./router/apiRouter')
require('colors')
const app = express();

app.use(morgan('dev'))

app.use('/api' , apiRouter)

app.listen(8888 , ()=>{
    console.log('server liste on port 8888'.green.bold)
})