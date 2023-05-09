const signToken = require("./signToken").signToken;

exports.createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
