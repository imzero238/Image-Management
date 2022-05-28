const express = require("express");

const app = express();
const PORT = 5050;

app.post('/upload', (req, res) => {
    console.log('/upload called!');
    res.json({result: "success"});
});

app.listen(PORT, () => console.log("Express server listening on PORT" + PORT));