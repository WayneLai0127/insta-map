import React from "react";
import type { RouterOutputs } from "~/utils/api";

type post = RouterOutputs["post"]["getAll"][number];

const MarkerCard = ({ post }: { post: post }) => {
  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded bg-white p-4 shadow-md">
      <h2 className="text-xl font-semibold">{post.locationName}</h2>
      <p className="text-gray-700">{post.review}</p>
    </div>
  );
};

export default MarkerCard;
