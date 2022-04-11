const express = require("express");
const router = express.Router();
const AllProducts = require("../../models/AllProducts");

router.get("/", async (request, response) => {
    try {
      const allproducts = await AllProducts.find().sort({_id:1}) ;
      response.send(allproducts);
    } catch (error) {
      response.send(error);
    }
  }
);

router.get("/:productCategory", async (req, res) => {
  try {
    if(req.params.productCategory === "all" || req.params.productCategory === "undefined"){
      const cat = await AllProducts.find().sort({_id:1}).limit((+req.query.page + 1) * req.query.pageCount)
      res.status(200).json(cat)
    }else{
      const cat = await AllProducts.find({productCategory: req.params.productCategory}).limit((+req.query.page + 1) * req.query.pageCount)
      res.status(200).json(cat)
    }
  } 
  catch (error) {
    res.status(500).json({ 
      message: "Internal server error" 
    });
  }
});
module.exports = router;
