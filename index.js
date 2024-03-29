const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv/config");
const allproducts = require("./routes/products/allproducts");
const allservices = require("./routes/products/services");
const register = require("./routes/auth/admin-register");
const login = require("./routes/auth/admin-login")
const category = require('./routes/products/categories');
const search = require("./routes/products/searchproducts");
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v2/allproducts", allproducts);
app.use("/v2/services", allservices);
app.use("/v2/category", category);
app.use("/v2/admin", login);
app.use("/v2/admin", register);
app.use("/v2/products", search);


mongoose.connect(
  process.env.DB_CONNECTION_CREDENTIAL,
  {
    useNewUrlParser: true,

    useCreateIndex: true,

    useFindAndModify: false,

    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to db");
  }
);

app.listen(PORT, () => console.log("listening " + PORT));
