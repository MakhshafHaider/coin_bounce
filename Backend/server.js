const express = require('express');
const dbConnect = require('./database/index');
const router = require('./routes/index');
const errorHandler= require('./middlewares/errorHandlers');
const cookieParser = require('cookie-parser');
const { PORT } = require('./config/index');

const app = express();

dbConnect();

app.use(cookieParser());

app.use(express.json())
app.use(router);
app.use('/storage', express.static("storage"))

app.use(errorHandler);

app.listen(PORT, () =>{
    console.log(`server is runnng on PORT ${PORT}`)
})