import type { InstagramAccount } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generatePresignedURL, hasObject } from "~/utils/s3";

const addAccountPhotoToInfo = async (accounts: InstagramAccount[]) => {
  const updatedAccounts = await Promise.all(
    accounts.map(async (account) => ({
      ...account,
      profileImage: (await hasObject(
        `image/instagram-user/sm/${account.id}.png`,
      ))
        ? generatePresignedURL(`image/instagram-user/sm/${account.id}.png`)
        : "/favicon.ico",
    })),
  );
  return updatedAccounts;
};

export const instagramAccountRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const accounts = await ctx.db.instagramAccount.findMany({
      take: 1000,
      orderBy: [{ id: "asc" }],
    });
    return addAccountPhotoToInfo(accounts);
  }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const accounts = await ctx.db.instagramAccount.findMany({
        orderBy: [{ id: "asc" }],
        where: {
          id: input.id,
        },
      });
      return addAccountPhotoToInfo(accounts);
    }),
});
