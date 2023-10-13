import type { Post, Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generatePresignedURL, listObjectsInFolder } from "~/utils/s3";
import type { ImageSize, PathType } from "~/utils/s3-types";

async function addImageToPost(posts: Post[], imageSize: ImageSize = "lg") {
  const updatedPosts = await Promise.all(
    posts.map(async (post) => {
      const path = `image/post/${post.id}/${imageSize}`;
      const imageNames = await listObjectsInFolder(path);
      const presignedImageUrls = await Promise.all(
        imageNames.map((imageName) =>
          generatePresignedURL((path + imageName) as PathType),
        ),
      );
      return {
        ...post,
        imageUrls: presignedImageUrls,
      };
    }),
  );
  return updatedPosts;
}

async function addInstagramAccountInfoToPost(
  posts: Post[],
  ctx: {
    db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  },
) {
  const allInstagramAccounts = await ctx.db.instagramAccount.findMany();
  return posts.map((post) => {
    const author = allInstagramAccounts.find(
      (account) => account.id === post.instagramId,
    );
    if (!author) throw new TRPCClientError("db post foreign key schema failed");
    return {
      ...post,
      author,
    };
  });
}

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 1000,
      orderBy: [{ createdAt: "desc" }],
    });

    return addInstagramAccountInfoToPost(await addImageToPost(posts), ctx);
  }),
  getByIgId: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.post.findMany({
        orderBy: [{ createdAt: "desc" }],
        where: {
          instagramId: input.id,
        },
      });
    }),
});
