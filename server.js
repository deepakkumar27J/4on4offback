const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 8080;
const apiRoutes = require("./src/api/v1/routes");

app.use(cors());
app.use(express.json());
app.use('api/v1', apiRoutes);

app.listen(PORT, ()=>{
    console.log(`Server start on port ${PORT}`);
})