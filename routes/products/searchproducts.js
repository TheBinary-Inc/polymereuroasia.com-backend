const express = require("express");
const AllProducts = require("../../models/AllProducts");
const verify_admin = require("../../middlewares/verify-admin");
const search_products = express.Router();

search_products.post("/search", verify_admin, async (req, res) => {
    const { search_product } = req.body;
    if(search_product){
        try{
           const searchedProducts = await AllProducts.aggregate([
                {
                    $search: {
                      index: 'default',
                      text: {
                        query: search_product,
                        path: {
                          'wildcard': '*'
                        }
                      }
                    }
                  }
              ]).limit(10);
              if(searchedProducts){
                res.status(200).json({ 
                    message: "Successfully searched!",
                    search_results: searchedProducts
                });
              }
              else{
                res.status(404).json({ 
                    message: "No products found!" ,
                    search_results: []
                });
              }
        }
        catch(err){
            res.status(500).json({ 
                message: "Internal server error" 
              });
        }
    }
    else{
        res.status(404).json({ 
            message: "No info provided!" 
        });
    }
})

module.exports = search_products;