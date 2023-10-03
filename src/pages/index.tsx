// Home.js
import React from "react";
import Map from "src/components/Map"; // Import the Map component
import { api } from "~/utils/api";

const Home = () => {
  const { data, isLoading: postsLoading } = api.post.getAll.useQuery();

  if (postsLoading) return <div />;
  if (!data) return <p>Something went wrong</p>;
  return (
    <div>
      <Map posts={data} />
    </div>
  );
};

export default Home;
