const { HttpError } = require("../helpers");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

const { ctrlWrapper } = require("../utils");

const { User } = require("../models/user");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email alredy in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json({
    email: result.email,
    subscription: result.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Emmail or Password invalid");
  }

  const paswordCompare = await bcrypt.compare(password, user.password);
  if (!paswordCompare) {
    throw HttpError(401, "Emmail or Password invalid");
  }
  console.log(user);
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout success",
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
};
