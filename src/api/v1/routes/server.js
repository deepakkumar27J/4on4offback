const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 8080;

app.use(cors());

app.get("/api/home", (req, res)=>{
    res.json({message: "new messager"});
})

app.listen(PORT, ()=>{
    console.log(`Server start on port ${PORT}`);
})