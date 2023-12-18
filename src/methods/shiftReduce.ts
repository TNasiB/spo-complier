import { GrammarRules, Precedence, StackElement, Lexem } from "../types";
import { findRuleForReduction } from "./findRuleForReduction";
import { getPrecedenceMatrix } from "./getPrecedenceMatrix";

export const shiftReduce = (grammarRules: GrammarRules, inputTokens: Lexem[]): string => {
  const stack: StackElement[] = []; // Стек начинается пустым
  const input = [...inputTokens]; // Копия входных токенов
  const precedenceMatrix = getPrecedenceMatrix(); // Матрица предшествования

  const getPrecedence = (topSymbol: string, currentSymbol: string): Precedence => {
    topSymbol = topSymbol === "Identifier" ? "a" : topSymbol;
    currentSymbol = currentSymbol === "Identifier" ? "a" : currentSymbol;

    if (!precedenceMatrix[topSymbol] || !precedenceMatrix[topSymbol][currentSymbol]) {
      console.error(
        `Отношение предшествования не определено для пары символов: ${topSymbol}, ${currentSymbol}`
      );
    }

    return precedenceMatrix[topSymbol][currentSymbol];
  };

  while (input.length > 0) {
    const currentToken = input[0];
    const topStack = stack.length > 0 ? stack[stack.length - 1] : null;

    const precedence = topStack
      ? getPrecedence(topStack.symbol, currentToken.value)
      : "<";

    if (precedence === "<" || precedence === "=") {
      // Сдвиг
      stack.push({
        symbol: currentToken.type, // Используем тип токена в качестве символа
        isTerminal: true,
      });
      input.shift();
    } else if (precedence === ">") {
      // Свертка
      const rule = findRuleForReduction(stack, grammarRules);
      if (!rule) {
        // Выводим номер строки и значение токена, на котором произошла ошибка
        return `Ошибка: Не найдено правило для свертки на токене '${currentToken.value}' в строке ${currentToken.value}`;
      }
      // Остальная логика свертки остается без изменений
    } else {
      // Выводим номер строки и значение токена, на котором произошла ошибка
      return `Ошибка: Входная строка не может быть разобрана на токене '${currentToken.value}' в строке ${currentToken.value}`;
    }
  }

  // Проверка успеха анализа после окончания цикла
  if (stack.length === 1 && stack[0].symbol === "S" && !stack[0].isTerminal) {
    return "Входная строка успешно разобрана";
  } else {
    if (stack.length > 0) {
      const lastToken = stack[stack.length - 1];
      return `Ошибка: Входная строка не может быть разобрана. Оставшийся символ в стеке: '${lastToken.symbol}'`;
    } else {
      return "Ошибка: Входная строка не может быть разобрана и стек пуст.";
    }
  }
};
