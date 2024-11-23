const express = require("express");
const cors = require("cors");
const passport = require('passport');
const connectDB = require('./src/api/v1/config/database');
const app = express();
const PORT = 8080;
const apiRoutes = require("./src/api/v1/routes/index");
require('./src/api/v1/config/passport-config');


app.use(passport.initialize());
app.use(cors());
app.use(express.json());
connectDB();

app.use('/api/v1', apiRoutes);

app.listen(PORT, ()=>{
    console.log(`Server start on port ${PORT}`);
})