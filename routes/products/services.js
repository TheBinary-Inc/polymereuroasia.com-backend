const express = require("express");
const router = express.Router();
const fs = require("fs");
const verify_admin = require("../../middlewares/verify-admin");
const cloudinary = require("../../cloudinary");
const upload = require("../../multer");
const AllProducts = require("../../models/AllProducts");

router.get("/", async (request, response) => {
  try {
    const allproducts = await AllProducts.find();
    response.send(allproducts);
  } catch (error) {
    response.send(error);
  }
});

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
      author: request.body.author,
      authorPhoneNumber: request.body.authorPhoneNumber,
      productCategory: request.body.productCategory,
      address: request.body.address,
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

module.exports = router;
