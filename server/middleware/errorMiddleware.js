export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`);

  // Handle Multer specific errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Maximum size allowed is 5MB.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: `Too many files. Maximum allowed is 3.` });
    }
    return res.status(400).json({ message: err.message });
  }

  // Handle custom file filter errors or general errors
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
