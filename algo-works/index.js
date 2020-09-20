var express = require("express");
var app = express();
const img = require('./controller/images');

//routes
app.get('/photos', img.getImages);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
