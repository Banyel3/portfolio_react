import { useState } from "react";

type nameInputtedProp = {
  isInputted: boolean;
};
export const NameInputted = ({ isInputted }: nameInputtedProp) => {
  const [NameInput, setNameInput] = useState(false);
  setNameInput(isInputted);
};
