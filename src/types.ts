export type GrammarSymbol = string;
export type GrammarRule = GrammarSymbol[];
export type GrammarRules = { [key in GrammarSymbol]?: GrammarRule[] };
export type Precedence = "<" | ">" | "=" | " ";
export type StackElement = {
  symbol: string;
  isTerminal: boolean;
};
export type Lexem = { number: number; type: string; value: string };
export type WithTerminal = Lexem & { isTerminal: boolean };
export enum PrecedenceEnum {
  Less = "<",
  Greater = ">",
  Equal = "=",
  Empty = " ",
}
