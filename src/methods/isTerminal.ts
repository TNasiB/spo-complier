import { GrammarRules } from "../types";

export function isTerminal(symbol: string, grammarRules: GrammarRules): boolean {
  // Если символ не является ключом в grammarRules, то он считается терминалом
  return !Object.keys(grammarRules).includes(symbol);
}
