import { grammarRules } from "../grammarRules";
import { Lexem, PrecedenceEnum } from "../types";

const precedenceMatrix: { [key: string]: { [key: string]: PrecedenceEnum } } = {
  a: {
    a: PrecedenceEnum.Empty,
    ":=": PrecedenceEnum.Equal,
    ";": PrecedenceEnum.Empty,
    or: PrecedenceEnum.Greater,
    xor: PrecedenceEnum.Greater,
    and: PrecedenceEnum.Greater,
    not: PrecedenceEnum.Empty,
    "(": PrecedenceEnum.Empty,
    ")": PrecedenceEnum.Greater,
    E: PrecedenceEnum.Empty,
  },
  ":=": {
    a: PrecedenceEnum.Less,
    ":=": PrecedenceEnum.Empty,
    ";": PrecedenceEnum.Equal,
    or: PrecedenceEnum.Less,
    xor: PrecedenceEnum.Less,
    and: PrecedenceEnum.Less,
    not: PrecedenceEnum.Less,
    "(": PrecedenceEnum.Less,
    ")": PrecedenceEnum.Empty,
    E: PrecedenceEnum.Greater,
  },
  ";": {
    a: PrecedenceEnum.Empty,
    ":=": PrecedenceEnum.Empty,
    ";": PrecedenceEnum.Empty,
    or: PrecedenceEnum.Empty,
    xor: PrecedenceEnum.Empty,
    and: PrecedenceEnum.Empty,
    not: PrecedenceEnum.Empty,
    "(": PrecedenceEnum.Empty,
    ")": PrecedenceEnum.Empty,
    E: PrecedenceEnum.Greater,
  },
  or: {
    a: PrecedenceEnum.Less,
    ":=": PrecedenceEnum.Empty,
    ";": PrecedenceEnum.Empty,
    or: PrecedenceEnum.Greater,
    xor: PrecedenceEnum.Greater,
    and: PrecedenceEnum.Less,
    not: PrecedenceEnum.Less,
    "(": PrecedenceEnum.Less,
    ")": PrecedenceEnum.Greater,
    E: PrecedenceEnum.Empty,
  },
  xor: {
    a: PrecedenceEnum.Less,
    ":=": PrecedenceEnum.Empty,
    ";": PrecedenceEnum.Empty,
    or: PrecedenceEnum.Greater,
    xor: PrecedenceEnum.Greater,
    and: PrecedenceEnum.Less,
    not: PrecedenceEnum.Less,
    "(": PrecedenceEnum.Less,
    ")": PrecedenceEnum.Greater,
    E: PrecedenceEnum.Empty,
  },
  and: {
    a: PrecedenceEnum.Less,
    ":=": PrecedenceEnum.Empty,
    ";": PrecedenceEnum.Empty,
    or: PrecedenceEnum.Greater,
    xor: PrecedenceEnum.Greater,
    and: PrecedenceEnum.Greater,
    not: PrecedenceEnum.Less,
    "(": PrecedenceEnum.Less,
    ")": PrecedenceEnum.Greater,
    E: PrecedenceEnum.Empty,
  },
  not: {
    a: PrecedenceEnum.Empty,
    ":=": PrecedenceEnum.Empty,
    ";": PrecedenceEnum.Empty,
    or: PrecedenceEnum.Empty,
    xor: PrecedenceEnum.Empty,
    and: PrecedenceEnum.Empty,
    not: PrecedenceEnum.Empty,
    "(": PrecedenceEnum.Equal,
    ")": PrecedenceEnum.Empty,
    E: PrecedenceEnum.Empty,
  },
  "(": {
    a: PrecedenceEnum.Less,
    ":=": PrecedenceEnum.Empty,
    ";": PrecedenceEnum.Empty,
    or: PrecedenceEnum.Less,
    xor: PrecedenceEnum.Less,
    and: PrecedenceEnum.Less,
    not: PrecedenceEnum.Less,
    "(": PrecedenceEnum.Less,
    ")": PrecedenceEnum.Equal,
    E: PrecedenceEnum.Empty,
  },
  ")": {
    a: PrecedenceEnum.Empty,
    ":=": PrecedenceEnum.Empty,
    ";": PrecedenceEnum.Empty,
    or: PrecedenceEnum.Greater,
    xor: PrecedenceEnum.Greater,
    and: PrecedenceEnum.Greater,
    not: PrecedenceEnum.Empty,
    "(": PrecedenceEnum.Empty,
    ")": PrecedenceEnum.Greater,
    E: PrecedenceEnum.Empty,
  },
  E: {
    a: PrecedenceEnum.Less,
    ":=": PrecedenceEnum.Less,
    ";": PrecedenceEnum.Empty,
    or: PrecedenceEnum.Empty,
    xor: PrecedenceEnum.Empty,
    and: PrecedenceEnum.Empty,
    not: PrecedenceEnum.Empty,
    "(": PrecedenceEnum.Empty,
    ")": PrecedenceEnum.Empty,
    E: PrecedenceEnum.Empty,
  },
};

const prepareTokensForShiftReduce = (lexems: Lexem[]): Lexem[][] => {
  const toASymbols = lexems.map((lexem) => ({
    number: -1,
    type: lexem.number,
    value:
      lexem.type === "Identificator" || lexem.type === "Constant" ? "a" : lexem.value,
  }));

  return toASymbols.reduce((acc: Lexem[][], currentLexem) => {
    if (currentLexem.value === ";") {
      // Если текущий символ - ';', начинаем новый подмассив
      acc.push([]);
    } else {
      // Если нет, добавляем текущий элемент в последний подмассив
      if (acc.length === 0) acc.push([]);
      // @ts-ignore
      acc[acc.length - 1].push(currentLexem);
    }
    return acc;
  }, []);
};

export class SyntaxAnalyse {
  tokens: Lexem[];
  stack: Lexem[] = [];

  constructor(lexems: Lexem[]) {
    this.tokens = prepareTokensForShiftReduce(lexems);
  }

  shiftReduce() {
    while (this.tokens.length !== 0) {
      const currentToken = this.tokens[0];
      const stackTopToken = this.stack.at(-1);
      const precedence = stackTopToken
        ? precedenceMatrix[stackTopToken.value][currentToken.value]
        : PrecedenceEnum.Less;

      if (precedence === PrecedenceEnum.Greater) {
        // Выполняем свертку, если это возможно
        if (!this.reduce()) {
          // Если свертка не выполнена, тогда выполняем сдвиг
          this.shift(currentToken);
        }
      } else {
        // Сдвигаем, если приоритет текущего токена меньше или равен
        this.shift(currentToken);
      }
    }

    console.log(this.stack);
  }

  shift(token: Lexem) {
    this.stack.push(token);
    this.tokens.shift();
  }

  reduce(): boolean {
    // Iterate over all grammar rules
    for (const rule of grammarRules) {
      const ruleRightSide = rule.slice(1); // Get the right side of the grammar rule
      const ruleLength = ruleRightSide.length;
      const stackTop = this.stack.slice(-ruleLength); // Get the top elements of the stack

      // Check if the top elements of the stack match the right side of the rule
      if (
        stackTop.length === ruleLength &&
        stackTop.every((token, index) => token.value === ruleRightSide[index])
      ) {
        // If there is a match, reduce it
        const reducedToken: Lexem = {
          type: "NonTerminal",
          value: rule[0], // The left side of the rule
          number: -1,
        };

        // Update the stack by removing the matched elements and adding the reduced token
        this.stack.splice(-ruleLength, ruleLength, reducedToken);
        console.log(this.stack);
        return true; // Reduction successful
      }
    }

    return false; // No reduction possible
  }
}
