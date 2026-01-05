import { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const createPost = async (req: Request, res: Response) => {
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
    console.error(e);
    res.status(400).json({
      message: e.message,
      meta: e.meta,
    });
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

    const status=req.query.status as PostStatus | undefined;

    const authorId=req.query.authorId as string | undefined



    const {page,limit,skip,sortBy,sortOrder}=paginationSortingHelper(req.query)

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const result = await PostService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page ,
      limit,
      skip,
      sortBy,
      sortOrder
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Error occurred",
      details: err,
    });
  }
};

export const PostController = {
  createPost,
  getAllPost,
};
