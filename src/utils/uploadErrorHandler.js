// middlewares/uploadErrorHandler.js
const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer errors
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: 400,
        message: "File size too large. Maximum size is 5MB",
        data: null,
      });
    }
    return res.status(400).json({
      status: 400,
      message: `Upload error: ${err.message}`,
      data: null,
    });
  } else if (err) {
    // Other errors
    return res.status(400).json({
      status: 400,
      message: err.message,
      data: null,
    });
  }
  next();
};

module.exports = uploadErrorHandler;
