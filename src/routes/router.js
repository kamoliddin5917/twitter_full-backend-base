const { Router } = require("express");
const router = Router();

// Conrtollers
const signupConttroller = require("../controllers/signup");
const loginController = require("../controllers/login");
const homecontroller = require("../controllers/index");
const profileController = require("../controllers/profile");

router.get("/profile", profileController.GET);
router.get("/:postId?", homecontroller.GET);

router.post("/signup", signupConttroller.POST);
router.post("/login", loginController.POST);
router.post("/profile", profileController.POST);
router.post("/comment/:postId", homecontroller.POST);

router.put("/profile/:postId", profileController.PUT);
router.put("/comment/:commentId", homecontroller.PUT);
router.put("/user", profileController.USER_PUT);

router.delete("/profile/:postId", profileController.DELETE);
router.delete("/comment/:commentId", homecontroller.DELETE);
router.delete("/exit", profileController.USER_EXIT);
router.delete("/post/comment/:commentId", profileController.COMMENT_DELETE);

module.exports = router;
