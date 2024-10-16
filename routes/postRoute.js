const router = require("express").Router();
const postController = require("../controllers/postController");
const auth = require("../middleware/auth");

router.post("/posts/:id", auth, postController.createPost);
router.get("/posts", auth, postController.getPost);

router
  .route("/post/:id")
  .patch(auth, postController.updatePost)
  .get(auth, postController.getSinglePost)
  .delete(auth, postController.deletePost);

router.patch("/post/:id/like", auth, postController.likePost);
router.patch("/post/:id/unlike", auth, postController.unlikePost);
router.get("/userposts/:id", auth, postController.getUserPost);
router.patch("/save/:id", auth, postController.savedPost);
router.patch("/unsave/:id", auth, postController.unSavedPost);
router.get("/getsavedpost", auth, postController.getSavedPost);

module.exports = router;
