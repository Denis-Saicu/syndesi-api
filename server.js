const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const _ = require('lodash');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, './config/.env')});
const cookieParser = require('cookie-parser');
const connectDB =require('./config/connectdb');

connectDB();

const port = process.env.PORT || 5000;

const app = express();

const authentication = require('./authentication/routes/auth-routes');

app.use(fileUpload({
    createParentPath: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(cors());

app.use('/syndesi_api/authentication', authentication)

app.listen(port, () => {
    console.log(`Syndesi-API listening at https://localhost:${port}`);
});