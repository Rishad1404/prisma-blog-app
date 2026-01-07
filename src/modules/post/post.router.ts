import express, {  Router } from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";


const router = express.Router();

router.get('/',
    PostController.getAllPost
)

router.get('/my-posts',
    auth(UserRole.USER,UserRole.ADMIN),
    PostController.getMyPosts 
)

router.get('/:postId',
    PostController.getPostById
)

// Only user can create post not admin
router.post("/", 
    auth(UserRole.USER),
    PostController.createPost);

export const postRouter: Router = router;
