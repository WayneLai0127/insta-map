import type { Post, Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

    return addInstagramAccountInfoToPost(posts, ctx);
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
