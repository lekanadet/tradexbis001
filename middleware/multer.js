const multer = require('multer')              




   const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        if (file.fieldname === "productimage") { // if uploading resume
        callback(null, './pictures');
        } 
    },
      filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
      }
})


const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

// defining the upload variable for the configuration of photo being uploaded
const upload = multer({ storage: storage, fileFilter: filefilter });



module.exports = upload;
