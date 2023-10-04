import type { RouterOutputs } from "~/utils/api";

type posts = RouterOutputs["post"]["getAll"];
export const filterPostsByInstagramAccount = (
  posts: posts,
  selectedAccounts: string[],
) => {
  return posts.filter((post) => selectedAccounts.includes(post.author.name));
};
