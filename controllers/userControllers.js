const User = require("../models/user-model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createError = require("../helpers/createError");
const { SECRET_KEY } = process.env;

const signUp = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });

    if (user) {
      throw createError(409, "User with such name already exists");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await User.create({ name, password: hashedPassword });

    const { _id } = await User.findOne({ name });

    const token = jwt.sign({ id: _id }, SECRET_KEY, { expiresIn: "1h" });

    await User.findByIdAndUpdate({ _id }, { token });

    res.status(201).json({
      id: _id,
      name,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const logIn = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) {
      throw createError(401, "Wrong name or password");
    }

    const passwordCompare = await bcryptjs.compare(password, user.password);

    if (!passwordCompare) {
      throw createError(401, "Wrong name or password");
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      id: user._id,
      name,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const logOut = async (req, res, next) => {
  try {
    const { authorization = "" } = req.body;
    const [bearer, token] = authorization.split(" ");

    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findOne({ id });

    if (!user) {
      throw createError(401, "Not authorized");
    }
    await User.findByIdAndUpdate(id, {token: null})
    res.status(204).json({ message: "No content" });
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  const { authorization = "", name } = req.body;
  const [bearer, token] = authorization.split(" ");

  const { id } = jwt.verify(token, SECRET_KEY);
  const user = await User.findOne({ id });
console.log(user)
  if (!user) {
    throw createError(401, "Not authorized");
  }

  res.status(201).res({ name, token });
};

module.exports = {
  signUp,
  logIn,
  logOut,
  getCurrent
};