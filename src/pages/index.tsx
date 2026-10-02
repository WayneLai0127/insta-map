import React, { useMemo, useState } from "react";
import Map from "src/components/Map";
import { api } from "~/utils/api";
import InstagramAccountSelect from "src/components/InstagramAccountSelect";
import type { OptionType } from "src/components/InstagramAccountSelect";
import type { MultiValue } from "react-select";
import type { RouterOutputs } from "~/utils/api";
import { filterPostsByInstagramAccount } from "~/utils/helper";
import ImageWithSkeleton from "~/components/ImageWithSkeleton";

type posts = RouterOutputs["post"]["getAll"];

const Home = () => {
  const { data: originalPostData, isPending: postsLoading } =
    api.post.getAll.useQuery();
  const { data: instagramAccounts } = api.instagramAccount.getAll.useQuery();
  const [selectedIgAccount, setSelectedIgAccount] = useState<string[]>([]);

  const handleIgAccountToggle = (newValue: MultiValue<OptionType>) => {
    setSelectedIgAccount(newValue.map((option) => option.value));
  };

  // Derive the filtered posts during render instead of syncing them into state
  // from an effect (react-hooks/set-state-in-effect).
  const filteredPostData = useMemo<posts>(() => {
    // Filter the original data based on selected Instagram accounts
    if (originalPostData && selectedIgAccount.length > 0) {
      return filterPostsByInstagramAccount(originalPostData, selectedIgAccount);
    }
    // If no Instagram accounts selected, use the original data
    return originalPostData ?? [];
  }, [originalPostData, selectedIgAccount]);

  if (postsLoading) return <div />;
  if (!originalPostData)
    return <p>Something went wrong while fetching posts...</p>;
  if (!instagramAccounts)
    return <p>Something went wrong while fetching igers...</p>;

  const generateOptionLabel = (account: (typeof instagramAccounts)[number]) => {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "0 0 auto", marginRight: "8px" }}>
          <ImageWithSkeleton
            src={account.profileImage}
            alt="IG"
            width={20}
            height={20}
          />
        </div>
        <p>{account.name}</p>
      </div>
    );
  };

  const instagrammerOptions = instagramAccounts.map((account) => ({
    value: account.name,
    label: generateOptionLabel(account),
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
