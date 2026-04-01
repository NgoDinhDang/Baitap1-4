const User = require("../models/user.model");
const HttpError = require("../utils/http-error");

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new HttpError(400, "name, email and password are required");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      throw new HttpError(400, "Email already exists");
    }

    const user = await User.create({
      name,
      email,
      password
    });

    res.status(201).json({
      message: "Register successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new HttpError(400, "email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.password !== password) {
      throw new HttpError(400, "Email or password is incorrect");
    }

    res.json({
      message: "Login successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login
};
