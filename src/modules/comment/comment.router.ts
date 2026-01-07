import express, {  Router } from "express";
import { CommentController } from "./comment.controller";
import auth, { UserRole } from "../../middlewares/auth";


const router = express.Router();

router.get('/author/:authorId',
    CommentController.getCommentsByAuthor
)

router.get('/:commentId',
    CommentController.getCommentById
)

router.patch('/:commentId',
    auth(UserRole.ADMIN,UserRole.USER),
    CommentController.updateComment
)

router.patch('/:commentId/moderate',
    auth(UserRole.ADMIN),
    CommentController.moderateComment
)

router.post('/',
    auth(UserRole.USER,UserRole.ADMIN),
    CommentController.createComment
)

router.delete('/:commentId',
    auth(UserRole.USER,UserRole.ADMIN),
    CommentController.deleteComment
)


export const CommentRouter: Router = router;
