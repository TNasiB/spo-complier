import { grammarRules } from "../grammarRules";
import { precedenceMatrix } from "../matrix";
import { Lexem, PrecedenceEnum } from "./../types";

const prepareTokensForShiftReduce = (lexems: Lexem[]): Lexem[][] => {
  const toASymbols: Lexem[] = lexems.map((lexem) => ({
    number: -1,
    type: lexem.type,
    value:
      lexem.type === "Identifier" || lexem.type === "Roman numeral" ? "a" : lexem.value,
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

    console.log(this.tokens);
    this.checkPrecedence();
    this.reduce();
  }

  checkPrecedence() {
    for (let i = 0; i < this.tokens.length; i++) {
      for (let j = 0; j < this.tokens[i].length; j++) {
        const current = this.tokens[i][j];
        const next = this.tokens[i][j + 1];

        if (!next) continue;

        console.log(current.value, next.value);
        const precedence = precedenceMatrix[current.value][next.value];

        if (next.value !== ";" && precedence === PrecedenceEnum.Empty) {
          // console.error(`Ошибка в строке ${i + 1} символ ${j + 1}`);
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

          console.log(...tokensCopy);

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
      if (parseResult.length === 1 && parseResult[0].value === "E") {
        console.log(`Строка ${i + 1} успешно разобрана`);
      } else {
        throw new Error(`Синтаксическая ошибка в строке ${i + 1}`);
      }
    }
  }
}
