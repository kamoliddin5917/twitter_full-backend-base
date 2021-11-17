const jwt = require("../utils/jwt");

module.exports = {
  AUTH: (req, res, next) => {
    try {
      if (req.url === "/login" || req.url === "/signup") {
        next();
      } else {
        const { token } = req.headers;
        const { userId } = jwt.verify(token);
        if (userId) {
          next();
        } else {
          res.status(400).json({
            message:
              "Assalomu Alaykum Registratsiyadan o'tin agar o'tgan bo'sez Login qilin!",
          });
        }
      }
    } catch (error) {
      res.status(400).json({
        message:
          "Assalomu Alaykum Registratsiyadan o'tin agar o'tgan bo'sez Login qilin!",
      });
    }
  },
};
