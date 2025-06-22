import jwt from 'jsonwebtoken';
import models from '../models/index.js';

const { User } = models;

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const error = new Error('Not authorized, no token provided');
      error.status = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role'],
    });

    if (!req.user) {
      const error = new Error('Not authorized, user not found');
      error.status = 401;
      throw error;
    }

    next();
  } catch (error) {
    res.status(error.status || 401).json({
      success: false,
      message: error.message || 'Not authorized',
    });
  }
};

export const checkAdminRole = (req, res, next) => {
  try {
    if (req.user?.role === 'Admin') {
      return next();
    } else {
      return res.status(403).json({ message: 'Access denied.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Invalid Credential.' });
  }
};

export const checkSupplierRole = (req, res, next) => {
  try {
    if (req.user?.role === 'Supplier') {
      return next();
    } else {
      return res.status(403).json({ message: 'Access denied.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Invalid Credential.' });
  }
};

