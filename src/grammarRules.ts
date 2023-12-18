import { GrammarRules } from "./types";

export const grammarRules: GrammarRules = {
  S: [["a", ":=", "F"]],
  F: [["F", "or", "T"], ["F", "xor", "T"], ["T"]],
  T: [["T", "and", "E"], ["E"]],
  E: [["(", "F", ")"], ["not", "(", "F", ")"], ["a"]],
};
