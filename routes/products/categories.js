const express = require("express");
const router = express.Router();
const AllProducts = require("../../models/AllProducts");

router.get("/", async (request, response) => {
    try {
      const allproducts = await AllProducts.find();
      response.send(allproducts);
    } catch (error) {
      response.send(error);
    }
  }
);

router.get("/:productCategory", async (req, res) => {
  try {
    if(req.params.productCategory){
      await AllProducts.find({ productCategory: request.params.productCategory}, (error, data) => {
          if(data){
            response.status(200).json({
              message: `${productCategory} has successfully loaded!`,
              data
          })
          }
          else{
            response.status(404).json({
              message: "Not found!"
            })
          }
        }
      );
    }
    else{
      response.status(400).json({
        message: "Query not provided!"
      })
    }
  } 
  catch (error) {
    response.status(500).json({ 
      message: "Internal server error" 
    });
  }
});
module.exports = router;
