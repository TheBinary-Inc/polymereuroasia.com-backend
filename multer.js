const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'video/mp4'){
        cb(null, true)
    }

    else{
        cb({message: "Unsopported file format"}, false)
    }
}


const upload = multer({
    storage: storage,
    limits: {fileSize: 20000024*20000024},
    fileFilter: fileFilter
})

module.exports = upload;