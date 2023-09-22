const express = require('express')
const { getAllProperties, postProperty, getProperty, updateProperty, deleteProperty, uploadImage, deleteImage } = require('../Controllers/property')

const router = express.Router()

//----------------Image Upload------------------/
const multer = require('multer');
const storage = multer.diskStorage({
    destination: '',
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
});
const upload = multer({ storage: storage });
//---------------------------------------------/


router.route('/').get(getAllProperties).post(postProperty)
router.route('/:id').get(getProperty).put(updateProperty).delete(deleteProperty)
router.post('/:propertyID/images', upload.single(''), uploadImage).delete('/:propertyID/images/:imageID', deleteImage)


module.exports = router

