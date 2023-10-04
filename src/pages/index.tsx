// Home.js
import React, { useState } from "react";
import Map from "src/components/Map"; // Import the Map component
import { api } from "~/utils/api";
import InstagramAccountSelect from "src/components/InstagramAccountSelect";
import type { OptionType } from "src/components/InstagramAccountSelect";
import type { MultiValue } from "react-select";

const Home = () => {
  const { data: postData, isLoading: postsLoading } =
    api.post.getAll.useQuery();
  const { data: instagramAccounts } = api.instagramAccount.getAll.useQuery();
  const [selectedIgAccount, setSelectedIgAccount] = useState<string[]>([]);

  const handleIgAccountToggle = (newValue: MultiValue<OptionType>) => {
    setSelectedIgAccount(newValue.map((option) => option.value));
  };
  if (postsLoading) return <div />;
  if (!postData) return <p>Something went wrong while fetching posts...</p>;
  if (!instagramAccounts)
    return <p>Something went wrong while fetching igers...</p>;

  const instagrammerOptions = instagramAccounts.map((account) => ({
    value: account.name,
    label: account.name,
  }));
  return (
    <div style={{ position: "relative" }}>
      <InstagramAccountSelect
        options={instagrammerOptions}
        selectedValues={selectedIgAccount}
        onChange={handleIgAccountToggle}
      />
      <Map posts={postData} />
    </div>
  );
};

export default Home;
