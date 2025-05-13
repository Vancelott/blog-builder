"use client";

import { useState } from "react";

export function TextArea({ handleInputChange, id, style, input }) {
  const [value, setValue] = useState<string>(
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi, consequatur accusamus nemo, hic voluptatum tenetur cupiditate iure amet, minus labore fugiat. Illo in iure repellendus quaerat, tempora voluptate neque debitis."
  );

  const handleInput = (newValue: string) => {
    setValue(newValue);
    handleInputChange(id, newValue);
  };

  return (
    <textarea
      style={style}
      onChange={(e) => handleInput(e.target.value)}
      className="bg-transparent border-none text-white text-wrap overflow-hidden resize-none"
      value={!input ? value : input}
    />
  );
}
