import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const instagramAccountRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.instagramAccount.findMany({
      take: 1000,
      orderBy: [{ id: "asc" }],
    });
  }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.instagramAccount.findMany({
        orderBy: [{ id: "asc" }],
        where: {
          id: input.id,
        },
      });
    }),
});
