export const grammarRules = [
  ["E", ";"],
  ["if", "E", "then", "E", "else", "E"],
  ["if", "E", "then", "E"],
  ["E", ":=", "E"],
  ["E", "else", "E"],
  ["a", ":=", "a"],
  ["a", "<", "a"],
  ["a", ">", "a"],
  ["a", "=", "a"],
];
