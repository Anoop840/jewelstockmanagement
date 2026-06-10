import multer from 'multer';
import path from 'path';

// Define where to store images and how to name them
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be saved in an 'uploads' folder in the root directory
  },
  filename: (req, file, cb) => {
    // Save files with a unique timestamp to avoid name collisions (e.g., 17180429-ring.jpg)
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

export default upload;