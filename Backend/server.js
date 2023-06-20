const express = require('express');
const cors = require('cors');
const dbConnect = require('./database/index');
const router = require('./routes/index');
const errorHandler= require('./middlewares/errorHandlers');
const cookieParser = require('cookie-parser');
const { PORT } = require('./config/index');

const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3000'],  
}

const app = express();

dbConnect();

app.use(cookieParser());

app.use(cors(corsOptions))

app.use(express.json({
    limit: '100mb'
}))
app.use(router);
app.use('/storage', express.static("storage"))

app.use(errorHandler);

app.listen(PORT, () =>{
    console.log(`server is runnng on PORT ${PORT}`)
})