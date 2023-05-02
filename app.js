const express = require('express');
const app=express();
const dotenv=require('dotenv');
const path = require("path");

const cookie =require('cookie-parser');
const bodyparser =require('body-parser')
const fileupload =require('express-fileupload')
app.use(express.json())
app.use(cookie())
app.use(bodyparser.urlencoded({extended: true}));
app.use(fileupload())
const errorMiddleware=require('./midleware/error')




//config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "config/config.env" });
  }//import routes
const product = require("./Routes/Products");
const user =require("./Routes/UsersRoute");
const Order =require("./Routes/OrderRoutes");
const payment = require("./Routes/PaymentRoute");

const bodyParser = require('body-parser');
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", Order);
app.use("/api/v1", payment);
app.use(express.static(path.join(__dirname, 'build')));


app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});
// Middleware for Errors
app.use(errorMiddleware);

module.exports=app;


