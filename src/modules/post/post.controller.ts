import { NextFunction, Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middlewares/auth";

const createPost = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized!",
      });
    }
    const result = await PostService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (e: any) {
    next();
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const searchString = typeof search === "string" ? search : undefined;

    // true or false
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const result = await PostService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Error occurred",
      details: err,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      throw new Error("Post id is required");
    }

    const result = await PostService.getPostById(postId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Failed to find",
      details: err,
    });
  }
};

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!");
    }
    const result = await PostService.getMyPosts(user?.id as string);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Post fetched failed",
      details: err,
    });
  }
};

// update Post
const updatePost = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!");
    }
    const { postId } = req.params;

    const isAdmin=user.role===UserRole.ADMIN

    const result = await PostService.updatePost(
      postId as string,
      req.body,
      user.id,
      isAdmin
    );
    console.log(user);
    res.status(200).json(result);
  } catch (e) {
    next()
  }
};

// delete post
const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!");
    }
    const { postId } = req.params;

    const isAdmin=user.role===UserRole.ADMIN

    const result = await PostService.deletePost(
      postId as string,
      user.id,
      isAdmin
    );
    console.log(user);
    res.status(200).json(result);
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "Post Delete failed";
    res.status(400).json({
      error: errorMessage,
      details: e,
    });
  }
};

// Stats
const getStats = async (req: Request, res: Response) => {
  try {

    const result = await PostService.getStats();

    res.status(200).json(result);
  } catch (e) {
    const errorMessage =
     ( e instanceof Error) ? e.message : "Stats fetch failed";
    res.status(400).json({
      error: errorMessage,
      details: e,
    });
  }
};




export const PostController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getStats
};
