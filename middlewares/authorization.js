const jwt = require("jsonwebtoken");
const createError = require("../helpers/createError");
const User = require("../models/user-model");

const authorizeHttp = async (req, res, next) => {
  console.log("AUTH HTTP MIDDLEWARE");
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    const { id } = jwt.verify(token, process.env["SECRET_KEY"]);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      throw createError(401, "Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const authorizeSocket = async (socket, next) => {
  console.log("SOCKET AUTH ====>>");
  const { userId, token } = socket.handshake.auth;
  try {
  
    const { id } = jwt.verify(token, process.env["SECRET_KEY"]);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(new Error('Authentication failed'));
    }
    socket.user = { id, name: user.name };
    next();
  } catch (error) {
    return { id: userId, isAuthorized: false };
  }
};

module.exports = { authorizeHttp, authorizeSocket };
