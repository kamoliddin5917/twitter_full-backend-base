const jwt = require("../utils/jwt");
const pg = require("../utils/pg");

module.exports = {
  POST: async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: "Invalid values!" });

    const findUser = await pg(
      "select * from users where user_email = $2 and status = $1",
      "active",
      email
    );

    if (findUser.rows.length)
      return res
        .status(400)
        .json({ message: "There is such an email database" });
    const createUser = await pg(
      "INSERT INTO users(user_firstname, user_lastname, user_email, user_password)VALUES($1,$2,$3,$4) returning user_id",
      firstName,
      lastName,
      email,
      password
    );

    const token = jwt.sign({ userId: createUser.rows[0].user_id });

    res.status(201).json({ message: "User created", token });
  },
};
