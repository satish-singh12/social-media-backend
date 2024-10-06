const router = require("express").Router();
const postController = require("../controllers/postController");
const auth = require("../middleware/auth");

// router
//   .route("/posts")
//   .post(auth, postController.createPost)
//   .get(auth, postController.getPost);

router.post("/posts/:id", auth, postController.createPost);
router.get("/posts", auth, postController.getPost);

module.exports = router;
