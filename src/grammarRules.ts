export type Lex = {
  id: number;
  lexType: number;
  val: string;
};

export const grammarRules: { [key: string]: Lex[][] } = {
  rule1: [
    [
      { id: -1, lexType: 1, val: "E" },
      { id: -1, lexType: 4, val: ":=" },
      { id: -1, lexType: 1, val: "E" },
      { id: -1, lexType: 5, val: ";" },
    ],
  ],
  rule2: [
    [
      { id: -1, lexType: 1, val: "E" },
      { id: -1, lexType: 3, val: "or" },
      { id: -1, lexType: 1, val: "E" },
    ],
  ],
  rule3: [
    [
      { id: -1, lexType: 1, val: "E" },
      { id: -1, lexType: 3, val: "xor" },
      { id: -1, lexType: 1, val: "E" },
    ],
  ],
  rule4: [[{ id: -1, lexType: 1, val: "E" }]],
  rule5: [
    [
      { id: -1, lexType: 1, val: "E" },
      { id: -1, lexType: 3, val: "and" },
      { id: -1, lexType: 1, val: "E" },
    ],
  ],
  rule6: [[{ id: -1, lexType: 1, val: "E" }]],
  rule7: [
    [
      { id: -1, lexType: 3, val: "not" },
      { id: -1, lexType: 5, val: "(" },
      { id: -1, lexType: 1, val: "E" },
      { id: -1, lexType: 5, val: ")" },
    ],
  ],
  rule8: [
    [
      { id: -1, lexType: 5, val: "(" },
      { id: -1, lexType: 1, val: "E" },
      { id: -1, lexType: 5, val: ")" },
    ],
  ],
  rule9: [[{ id: -1, lexType: 1, val: "alpha" }]],
};
