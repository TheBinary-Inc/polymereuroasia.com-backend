const express = require("express");
const router = express.Router();
const fs = require("fs");
const verify_admin = require("../../middlewares/verify-admin");
const cloudinary = require("../../cloudinary");
const upload = require("../../multer");
const AllProducts = require("../../models/AllProducts");

router.get("/", async (req, res) => {
  try {
      const cat = await AllProducts.find().sort({_id:-1}).limit((+req.query.page + 1) * req.query.pageCount)
      res.status(200).json(cat)
  } catch (error) {
    res.send(error);
  }
});
// router.get("/", async (request, response) => {
//   try {
//     const allproducts = await AllProducts.find();
//     response.send(allproducts);
//   } catch (error) {
//     response.send(error);
//   }
// });

router.post("/",upload.array("image"), verify_admin, async (request, response) => {
  const uploader = async (path) => await cloudinary.uploads(path, "Images");
  if (request.method === "POST") {
    const urls = [];
    if (request.files) {
      const files = request.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        urls.push(newPath);
        fs.unlinkSync(path);
      }
    }
    const product = new AllProducts({
      name: request.body.name,
      descriptionUz: request.body.descriptionUz,
      descriptionRu: request.body.descriptionRu,
      image: urls,
      price: request.body.price,
      author: request.body.author,
      authorPhoneNumber: request.body.authorPhoneNumber,
      productCategory: request.body.productCategory,
      address: request.body.address,
      views: 0
    });
    try {
      const saveProduct = await product.save();
      response.json(saveProduct);
    } catch (error) {
      response.json(error);
    }
  } else {
    response.status(405).json({
      error: "unsuccess",
    });
  }
});

router.get("/:productId", async (request, response) => {
  try {
    const specificProduct = await AllProducts.findById(
      request.params.productId
    );
    response.json(specificProduct);
  } catch (error) {
    response.json({ message: error });
  }
});

router.delete("/:productId", verify_admin, async (request, response) => {
  try {
    const removedProduct = await AllProducts.deleteOne({
      _id: request.params.productId,
    });
    response.json(removedProduct);
  } catch (error) {
    response.json({ message: error });
  }
});

router.patch("/:productId", verify_admin, async (request, response) => {
  try {
    const updatedProduct = await AllProducts.updateOne(
      { _id: request.params.productId },
      { $set: { 
        name: request.body.name, 
        price: request.body.price, 
        authorPhoneNumber: request.body.authorPhoneNumber, 
        address: request.body.address 
      }}
    );
    response.json(updatedProduct);
  } catch (error) {
    response.json({ message: error });
  }
});

router.patch("/view/:productId", async (request, response) => {
  try {
    const updatedProductOne = await AllProducts.findById(request.params.productId)
    const updatedProduct = await AllProducts.updateOne(
      { _id: request.params.productId },
      { $set: { 
          views: updatedProductOne.views + 1
      }}
    );
    response.json(updatedProduct);
  } catch (error) {
    response.json({ message: error });
  }
});

module.exports = router;
