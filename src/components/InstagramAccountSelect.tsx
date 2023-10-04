// InstagramAccountSelect.js

import React from "react";
import Select from "react-select";
import type { MultiValue } from "react-select";

export type OptionType = {
  value: string;
  label: string;
};

type SelectProps = {
  options: OptionType[];
  selectedValues: string[];
  onChange: (newValue: MultiValue<OptionType>) => void;
};
const InstagramAccountSelect: React.FC<SelectProps> = ({
  options,
  selectedValues,
  onChange,
}) => {
  const newLocal = "20px";
  return (
    <div
      style={{
        position: "absolute",
        top: newLocal,
        right: "20px",
        zIndex: "10",
      }}
    >
      <Select
        id="instagramAccount"
        onChange={onChange}
        value={options.filter((option) =>
          selectedValues.includes(option.value),
        )}
        options={options}
        isMulti
      />
    </div>
  );
};

export default InstagramAccountSelect;
