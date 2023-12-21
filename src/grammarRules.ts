export const grammarRules = [
  ["E", ":=", "E", ";"],
  ["E", "or", "E"],
  ["E", "xor", "E"],
  ["E"],
  ["E", "and", "E"],
  ["(", "E", ")"],
  ["not", "(", "E", ")"],
  ["a"],
];
