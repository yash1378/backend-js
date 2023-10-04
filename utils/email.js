

const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Generate a random 32-character string as the PASSWORD_RESET_SECRET
const PASSWORD_RESET_SECRET = crypto.randomBytes(32).toString("hex");

// utils/email.js
const { createTransport } = require("nodemailer");
const jwt = require("jsonwebtoken");

const createPasswordResetUrl = (id, token) => {
  // Here, we are signing the ID and token together to create a single token.
  // You can also choose to concatenate them or use any other method to generate the URL.
  const passwordResetToken = jwt.sign({ id, token },{PASSWORD_RESET_SECRET}, {
    expiresIn: "15m", // Token expiration time, e.g., 15 minutes
  });

  // Replace "example.com" with your actual client URL or domain
  return `${process.env.CLIENT_URL}/reset-password/${passwordResetToken}`;
};

// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_HOST,
//   auth: {
//     user: 'yashdugriyal1066@gmail.com',
//     pass: 'tgurzzqcptydammg'
//   },
// });


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: 'yashdugriyal1066@gmail.com',
    pass: 'tgurzzqcptydammg'
  }
});

const passwordResetTemplate = (user, url) => {
  const { email } = user;
  return {
    from: `Mail - <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Reset Password`,
    html: `
      <h2>Password Reset Link</h2>
      <p>Reset your password by clicking on the link below:</p>
      <a href=${url}><button>Reset Password</button></a>
      <br />
      <br />
      <small><a style="color: #38A169" href=${url}>${url}</a></small>
      <br />
      <small>The link will expire in 15 mins!</small>
      <small>If you haven't requested a password reset, please ignore this email!</small>
      <br /><br />
      <p>Thanks,</p>
      <p>Authentication API</p>`,
  };
};

const passwordResetConfirmationTemplate = (user) => {
  const { email } = user;
  return {
    from: `Mail - <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Password Reset Successful`,
    html: `
      <h2>Password Reset Successful</h2>
      <p>You've successfully updated your password for your account <${email}>. </p>
      <small>If you did not change your password, reset it from your account.</small>
      <br /><br />
      <p>Thanks,</p>
      <p>Authentication API</p>`,
  };
};

module.exports = {
  transporter,
  createPasswordResetUrl,
  passwordResetTemplate,
  passwordResetConfirmationTemplate,
};
