const jwt = require("../utils/jwt");
const pg = require("../utils/pg");

module.exports = {
  GET: async (req, res) => {
    try {
      const { token } = req.headers;
      const { userId } = jwt.verify(token);

      const information = await pg(
        `select
  user_id as id, user_firstname as first_name, user_lastname as last_name, user_email as email, user_date as created,
  post_id, post_name, post_date as post_created, comment_id, comment_name, comment_date as comment_created
  from users left join posts on users.user_id = posts.post_author
  left join comments on  posts.post_id = comments.comment_post
  where
  users.user_id = $2 and
  users.status = $1`,
        "active",
        userId
      );
      if (information.rows.length)
        return res
          .status(200)
          .json({ message: "ok", twitter: information.rows });
      res.status(400).json({ message: "There is no post in the database!" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Database Error 500!" });
    }
  },
  POST: async (req, res) => {
    try {
      const { post } = req.body;
      if (!post) return res.status(400).json({ message: "Invalid values!" });

      const { token } = req.headers;
      const { userId } = jwt.verify(token);
      const information = await pg(
        "INSERT INTO posts(post_author, post_name)VALUES($1, $2) returning post_id as id, post_date as created, post_name as post, post_author",
        userId,
        post
      );
      if (!information.rows.length)
        return res.status(400).json({ message: "Not created!" });
      res.status(201).json({ message: "ok", post: information.rows });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Database Error 500!" });
    }
  },
  PUT: async (req, res) => {
    try {
      const { post } = req.body;
      if (!post) return res.status(400).json({ message: "Invalid values!" });
      const { postId } = req.params;
      if (isNaN(postId))
        return res.status(400).json({ message: "Invalid values!" });
      const { token } = req.headers;
      const { userId } = jwt.verify(token);
      const information = await pg(
        "update posts set post_name = $3 where post_author = $1 and post_id = $2 returning post_id as id, post_date as created, post_name as post, post_author",
        userId,
        postId,
        post
      );
      if (!information.rows.length)
        return res.status(400).json({ message: "Not update!" });
      res.status(201).json({ message: "ok", post: information.rows });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Database Error 500!" });
    }
  },
  DELETE: async (req, res) => {
    try {
      const { postId } = req.params;
      if (isNaN(postId))
        return res.status(400).json({ message: "Invalid values!" });
      const { token } = req.headers;
      const { userId } = jwt.verify(token);
      const information = await pg(
        "delete from posts where post_author = $1 and post_id = $2 returning post_id as id, post_date as created, post_name as post, post_author",
        userId,
        postId
      );
      if (!information.rows.length)
        return res.status(400).json({ message: "Not deleted!" });
      res.status(200).json({ message: "ok", post: information.rows });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Database Error 500!" });
    }
  },
  USER_EXIT: async (req, res) => {
    try {
      const { token } = req.headers;
      const { userId } = jwt.verify(token);
      const information = await pg(
        "update users set status = $2 where user_id = $1 returning user_id as id",
        userId,
        "!active"
      );
      if (!information.rows.length)
        return res.status(400).json({ message: "Not deleted!" });
      res.status(200).json({ message: "ok", user: information.rows });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Database Error 500!" });
    }
  },
  USER_PUT: async (req, res) => {
    try {
      const { firstName, lastName, password } = req.body;
      if (!firstName && !lastName && !password)
        return res.status(400).json({ message: "Bad request!" });
      const { token } = req.headers;
      const { userId } = jwt.verify(token);
      const user = await pg(
        "select user_firstname, user_lastname, user_password from users where user_id = $1 and status = $2",
        userId,
        "active"
      );
      if (!user.rows.length)
        return res.status(400).json({ message: "Invalid values!" });

      const information = await pg(
        `update users set user_firstname = $2, user_lastname = $3, user_password = $4
  where user_id = $1 and status = $5
  returning user_id as id, user_firstname as first_name, user_lastname as last_name, user_password as password`,
        userId,
        firstName ? firstName : user.rows[0].user_firstname,
        lastName ? lastName : user.rows[0].user_lastname,
        password ? password : user.rows[0].user_password,
        "active"
      );
      if (!information.rows.length)
        return res.status(400).json({ message: "Not changed!" });
      res.status(200).json({ message: "ok", changeUser: information.rows });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Database Error 500!" });
    }
  },
};
