const jwt = require("../utils/jwt");
const pg = require("../utils/pg");

module.exports = {
  GET: async (req, res) => {
    const { postId } = req.params;
    if (postId) {
      if (isNaN(postId))
        return res.json({ message: `This id not (${postId}) Number!` });
      const information = await pg(
        `select
                   user_id as id, user_firstname as first_name, user_lastname as last_name, user_email as email, user_date as created,
                   post_id, post_name, post_date as post_created, comment_id, comment_name, comment_date as comment_created
                   from users left join posts on users.user_id = posts.post_author
                   left join comments on  posts.post_id = comments.comment_post
                   where
                   posts.post_id = $2 and
                   users.status = $1`,
        "active",
        postId
      );
      if (!information.rows.length)
        return res.status(400).json({
          message: `There is no such id (${postId}) post in the database`,
        });
      return res.status(200).json({ message: "ok", twitter: information.rows });
    }
    const information = await pg(
      `select
         user_id as id, user_firstname as first_name, user_lastname as last_name, user_email as email, user_date as created,
         post_id, post_name, post_date as post_created, comment_id, comment_name, comment_date as comment_created
         from users left join posts on users.user_id = posts.post_author
         left join comments on  posts.post_id = comments.comment_post
         where
         users.status = $1`,
      "active"
    );

    if (!information.rows.length)
      return res
        .status(500)
        .json({ message: "There is no information in the database!" });
    res.status(200).json({ message: "ok", twitter: information.rows });
  },
  POST: async (req, res) => {
    try {
      const { comment } = req.body;
      if (!comment) return res.status(400).json({ message: "Invalid values!" });
      const { postId } = req.params;
      if (isNaN(postId))
        return res.status(400).json({ message: "Invalid values!" });

      const { token } = req.headers;
      const { userId } = jwt.verify(token);
      const information = await pg(
        "INSERT INTO comments(comment_author, comment_post, comment_name)VALUES($1, $2, $3) returning comment_id as id, comment_date as created, comment_name as comment, comment_author, comment_post",
        userId,
        postId,
        comment
      );
      if (!information.rows.length)
        return res.status(400).json({ message: "Not created!" });
      res.status(201).json({ message: "ok", comment: information.rows });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Database Error 500!" });
    }
  },
  PUT: async (req, res) => {
    try {
      const { comment } = req.body;
      if (!comment) return res.status(400).json({ message: "Invalid values!" });
      const { commentId } = req.params;
      if (isNaN(commentId))
        return res.status(400).json({ message: "Invalid values!" });
      const { token } = req.headers;
      const { userId } = jwt.verify(token);
      const information = await pg(
        "update comments set comment_name = $3 where comment_author = $1 and comment_id = $2 returning comment_id as id, comment_date as created, comment_name as comment, comment_author, comment_post",
        userId,
        commentId,
        comment
      );
      if (!information.rows.length)
        return res.status(400).json({ message: "Not update!" });
      res.status(201).json({ message: "ok", comment: information.rows });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Database Error 500!" });
    }
  },
  DELETE: async (req, res) => {
    try {
      const { commentId } = req.params;
      if (isNaN(commentId))
        return res.status(400).json({ message: "Invalid values!" });
      const { token } = req.headers;
      const { userId } = jwt.verify(token);
      const information = await pg(
        "delete from comments where comment_author = $1 and comment_id = $2 returning comment_id as id, comment_date as created, comment_name as comment, comment_author, comment_post",
        userId,
        commentId
      );
      if (!information.rows.length)
        return res.status(400).json({ message: "Not deleted!" });
      res.status(200).json({ message: "ok", post: information.rows });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Database Error 500!" });
    }
  },
};
