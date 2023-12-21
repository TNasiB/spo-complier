import { grammarRules } from "../grammarRules";
import { Lexem, Precedence, PrecedenceEnum } from "./../types";

const precedenceMatrix: { [key: string]: { [key: string]: Precedence } } = {
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
    E1: PrecedenceEnum.Empty,
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
  const toASymbols: Lexem[] = lexems.map((lexem) => ({
    number: -1,
    type: lexem.type,
    value: lexem.type === "Identifier" || lexem.type === "Constant" ? "a" : lexem.value,
  }));

  const result = toASymbols.reduce((acc: Lexem[][], currentLexem) => {
    if (acc.length === 0) acc.push([]);

    if (currentLexem.value === ";") {
      acc[acc.length - 1].push(currentLexem);
      acc.push([]);
    } else {
      acc[acc.length - 1].push(currentLexem);
    }
    return acc;
  }, []);

  // Удаляем последний пустой массив, если он есть
  if (result.length > 0 && result[result.length - 1].length === 0) {
    result.pop();
  }

  return result;
};

export class ShiftReduce3 {
  tokens: Lexem[][] = [];

  constructor(lexem: Lexem[]) {
    this.tokens = prepareTokensForShiftReduce(lexem);
    this.checkPrecedence();
    this.reduce();
  }

  checkPrecedence() {
    for (let i = 0; i < this.tokens.length; i++) {
      for (let j = 0; j < this.tokens[i].length; j++) {
        const current = this.tokens[i][j];
        const next = this.tokens[i][j + 1];

        if (!next) continue;
        const precedence = precedenceMatrix[current.value][next.value];

        if (next.value !== ";" && precedence === PrecedenceEnum.Empty) {
          console.error(`Ошибка в строке ${i + 1} символ ${j + 1}`);
        }
      }
    }
  }

  parseLine(tokens: Lexem[]): Lexem[] {
    // Эта фунция обрабатывает строку и должна вернуть массив [{value: E}], иначе ошибка
    // debugger;
    const tokensCopy = [...tokens];
    // Делаем копию массива строки
    const reversedGrammarRules = grammarRules.slice().reverse();
    // Реверсим массив правил чтобы начать с последней

    // Эта переменная отвечает за смещение после успешной обработки последовательности правилом
    let success = false;
    // Цикл, который должен завершится, когда массив токенов исчерпнет
    let tokenIndex = 0;

    let successReduce = false;

    while (!success) {
      //Цикл по массиву грамматических правил
      successReduce = false;

      for (let ruleIndex = 0; ruleIndex < reversedGrammarRules.length; ruleIndex++) {
        const currentRule = reversedGrammarRules[ruleIndex];

        const tokenOtrezok = [tokenIndex, currentRule.length + tokenIndex];

        // Беру часть строки, которая сооветствует длине правила и вытаскиваю оттуда только value
        const partOfLine = tokensCopy.slice(...tokenOtrezok).map((token) => token.value);

        if (partOfLine.length === 0) throw new Error("Длина сравниваемой части = 0");

        // Счетчик успешной последовательности
        let successCount = 0;

        // Цикл который сравнивает символ из правила с символом из строки
        for (let tokenOrder = 0; tokenOrder < partOfLine.length; tokenOrder++) {
          if (partOfLine[tokenOrder] === currentRule[tokenOrder]) {
            // Если символ с таким же индексом как и в правиле совпадает, то увеличиваем счетчик на 1
            successCount++;
          }
        }

        // Если наш счетчик успешкного сравнения равен длине массива правила, то выполняем логику замены последовательности символом на нетерминал
        const isERule = currentRule[0] === "E" && currentRule.length === 1;
        if (successCount === currentRule.length && !isERule) {
          tokensCopy.splice(tokenOtrezok[0], currentRule.length, {
            number: -1,
            type: "NonTerm",
            value: "E",
          });

          tokenIndex = 0;
          successReduce = true;

          break;
        }
      }

      if (!successReduce) {
        tokenIndex++;
      }

      if (tokenIndex === tokensCopy.length) {
        tokenIndex = 0;
      }

      // Если остался 1 символ и это E завершаем цикл
      if (tokensCopy.length === 1 && tokensCopy[0].value === "E") {
        success = true;
      }
    }

    return tokensCopy;
  }

  reduce() {
    for (let i = 0; i < this.tokens.length; i++) {
      const currentLine = [...this.tokens[i]];
      const parseResult = this.parseLine(currentLine);
      console.log({ parseResult });
      if (parseResult.length === 1 && parseResult[0].value === "E") {
        console.log(`Строка ${i + 1} успешно разобрана`);
      } else {
        throw new Error(`Синтаксическая ошибка в строке ${i + 1}`);
      }
    }
  }
}
