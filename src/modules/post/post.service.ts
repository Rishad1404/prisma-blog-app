import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};
const getAllPost = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured:boolean|undefined;
  status:PostStatus | undefined;
  authorId:string | undefined
}) => {
  const andConditions:PostWhereInput[] = [];

  // search condition-----------------------------------------------------------------------
  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search as string,
          },
        },
      ],
    });
  }

  // tags condition-------------------------------------------------------------------------
  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  // isFeaturedCondition
  if(typeof isFeatured==='boolean'){
    andConditions.push({
      isFeatured
    })
  }

  // status-------------------------------------------------------------------------------
  if(status){
    andConditions.push({
      status
    })
  }


  // authorId----------------------------------------------------------------------------
  if(authorId){
    andConditions.push({
      authorId
    })
  }

  const allPost = await prisma.post.findMany({
    where: {
      AND: andConditions,
    },
  });
  return allPost;
};

export const PostService = {
  createPost,
  getAllPost,
};
