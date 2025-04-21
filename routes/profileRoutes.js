const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path');
const verifyToken = require('../middleware/verifyToken');
const profileController = require('../controllers/profileController')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter
});

router.get('/', profileController.showProfile)
router.get('/edit', profileController.showEditProfile)
router.post('/update', upload.single('profileImage'), profileController.updateProfile)
router.get('/change-password', profileController.showChangePassword)
router.post('/change-password', profileController.updatePassword)

module.exports = router;
