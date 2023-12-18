import { StackElement, GrammarRules } from "../types";

export function findRuleForReduction(
  stack: StackElement[],
  grammarRules: GrammarRules
): string | null {
  // Обратный проход по стеку
  for (let i = stack.length - 1; i >= 0; i--) {
    const sequence = stack.slice(i).map((element) => element.symbol);

    for (const [leftSide, rightSides] of Object.entries(grammarRules)) {
      if (!rightSides) {
        console.error("Grammar rules are not defined");
      }

      for (const rightSide of rightSides!) {
        // Проверяем, соответствует ли последовательность в стеке какой-либо правой части правила
        if (arraysEqual(sequence, rightSide)) {
          // Если нашли соответствие, возвращаем левую часть правила
          return leftSide;
        }
      }
    }
  }

  // Если соответствие не найдено
  return null;
}

// Вспомогательная функция для сравнения массивов
function arraysEqual(a: unknown[], b: unknown[]) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
