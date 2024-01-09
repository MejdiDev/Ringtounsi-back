// post.route.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const auth = require("../middleware/auth.middleware");

router.get("/", auth(), postController.getAllPosts);
router.get("/:id", auth(), postController.getPostById);
router.post("/", auth(), postController.createPost);
router.put("/:id", auth(), postController.updatePost);
router.delete("/:id", auth(), postController.deletePost);

module.exports = router;
