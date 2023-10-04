import React, { useState, useEffect } from "react";
import Map from "src/components/Map"; // Import the Map component
import { api } from "~/utils/api";
import InstagramAccountSelect from "src/components/InstagramAccountSelect";
import type { OptionType } from "src/components/InstagramAccountSelect";
import type { MultiValue } from "react-select";
import type { RouterOutputs } from "~/utils/api";
import { filterPostsByInstagramAccount } from "~/utils/helper";

type posts = RouterOutputs["post"]["getAll"];
const Home = () => {
  const { data: originalPostData, isLoading: postsLoading } =
    api.post.getAll.useQuery();
  const { data: instagramAccounts } = api.instagramAccount.getAll.useQuery();
  const [selectedIgAccount, setSelectedIgAccount] = useState<string[]>([]);
  const [filteredPostData, setFilteredPostData] = useState<posts>([]);

  const handleIgAccountToggle = (newValue: MultiValue<OptionType>) => {
    setSelectedIgAccount(newValue.map((option) => option.value));
  };

  useEffect(() => {
    // Filter the original data based on selected Instagram accounts
    if (originalPostData && selectedIgAccount.length > 0) {
      const filteredData = filterPostsByInstagramAccount(
        originalPostData,
        selectedIgAccount,
      );
      setFilteredPostData(filteredData);
    } else {
      // If no Instagram accounts selected, use the original data
      setFilteredPostData(originalPostData ?? []);
    }
  }, [originalPostData, selectedIgAccount]);

  if (postsLoading) return <div />;
  if (!originalPostData)
    return <p>Something went wrong while fetching posts...</p>;
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
      <Map posts={filteredPostData} />
    </div>
  );
};

export default Home;
