const express = require("express");
const app = express();
const server = require("http").Server(app);

app.set("view engine", "ejs");



server.listen(process.env.PORT || 3030);