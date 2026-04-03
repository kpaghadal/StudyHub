import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'studyhub_secret_key', { 
    expiresIn: process.env.JWT_EXPIRE || '1h' 
  });
};

export default generateToken;
