const jwt = require("../utils/jwt");
const pg = require("../utils/pg");

module.exports = {
  POST: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Invalid values!" });

    const findUser = await pg(
      "select user_id from users where user_email = $2 and user_password = $3 and status = $1",
      "active",
      email,
      password
    );

    if (findUser.rows.length) {
      const token = jwt.sign({ userId: findUser.rows[0].user_id });

      res.status(200).json({ message: "ok", token });
    } else {
      res.status(404).json({ message: "Not found!" });
    }
  },
};
