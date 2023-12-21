export const grammarRules = [
  ["E"],
  ["if", "E", "then", "E", "else", "E"],
  ["if", "E", "then", "E"],
  ["E", ":=", "E"],
  ["if", "E", "then", "E", "else", "E", "E"],
  ["E", ":=", "E"],
  ["E", "<", "E"],
  ["E", ">", "E"],
  ["E", "=", "E"],
];
