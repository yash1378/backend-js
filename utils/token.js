// utils/token.js
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const createAccessToken = (id) => {
  return jwt.sign({ id }, ACCESS_TOKEN_SECRET, {
    expiresIn: 15 * 60, // 15 minutes (time in seconds)
  });
};

const createRefreshToken = (id) => {
  return jwt.sign({ id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "90d", // 90 days
  });
};

const sendAccessToken = (_req, res, accessToken) => {
  console.log(accessToken);
  // res.json({
  //   accessToken,
  //   message: "Sign in Successful 🥳",
  //   type: "success",
  // });
};

const sendRefreshToken = (res, refreshtoken) => {
  res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
  });
};

const createPasswordResetToken = ({ _id, email, password }) => {
  const secret = password;
  return jwt.sign({ id: _id, email }, secret, {
    expiresIn: 15 * 60, // 15 minutes
  });
};


module.exports = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
  createPasswordResetToken,
};
