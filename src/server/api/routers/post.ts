import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      take: 1000,
      orderBy: [{ createdAt: "desc" }],
    });
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
