const express = require('express');
const port = 8000;
const app = express();
const fs = require("fs");

const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);
});

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
  console.log("main_lab!" + req.method);
  res.sendFile('./main_lab.html', {root: __dirname});
});