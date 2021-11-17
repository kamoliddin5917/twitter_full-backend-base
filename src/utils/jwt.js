const jwt = require("jsonwebtoken");

module.exports = {
  sign: (data) => {
    return jwt.sign(data, "7faqatolg'a");
  },
  verify: (data) => {
    return jwt.verify(data, "7faqatolg'a");
  },
};
