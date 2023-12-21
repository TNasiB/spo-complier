// import { grammarRules } from "../grammarRules";
// import { Lexem } from "../types";
// import { getPrecedenceMatrix } from "./getPrecedenceMatrix";

// export const shiftReduce = (inputTokens: Lexem[]): string => {
//   debugger;
//   const lineStack: Lexem[][] = [];
//   let lineTemp: Lexem[] = [];

//   // Разделение входных токенов на строки
//   inputTokens.forEach((token) => {
//     lineTemp.push(token);
//     if (token.value === ";") {
//       lineStack.push(lineTemp);
//       lineTemp = [];
//     }
//   });

//   if (lineTemp.length > 0) {
//     lineStack.push(lineTemp);
//   }

//   // Обработка каждой строки отдельно
//   for (const line of lineStack) {
//     const result = processLine(line);
//     if (result !== "Входная строка успешно разобрана") {
//       return result; // Возвращаем ошибку, если она возникла
//     }
//   }

//   return "Входная строка успешно разобрана";
// };

// function processLine(line: Lexem[]): string {
//   debugger;
//   const stack: Lexem[] = [];
//   const input = [...line];

//   while (input.length > 0) {
//     const currentToken = input[0];
//     const topStack = stack.length > 0 ? stack[stack.length - 1] : null;

//     const precedence = topStack ? getPrecedence(topStack, currentToken) : "shift";

//     if (precedence === "shift") {
//       stack.push(input.shift() as Lexem);
//     } else if (
//       precedence === "reduce" &&
//       canReduce(
//         [...stack, currentToken].map((stackItem) => ({
//           ...stackItem,
//           value: convertToMatrixSymbol(stackItem),
//         })),
//         grammarRules
//       )
//     ) {
//       // Выполнение свертки

//       console.log("asd");
//       const rule = findMatchingRule(stack, grammarRules);
//       if (rule) {
//         stack.splice(stack.length - rule.length, rule.length); // Удаляем токены, соответствующие правилу
//         stack.push({ number: -1, type: "NonTerminal", value: "E" }); // Добавляем свернутый токен 'E'
//         continue;
//       }
//     } else {
//       return "Ошибка: Входная строка не может быть разобрана";
//     }
//   }

//   if (stack.length === 1 && stack[0].value === "E") {
//     return "Входная строка успешно разобрана";
//   } else {
//     return "Ошибка: Входная строка не может быть разобрана";
//   }
// }

// export function canReduce(stack: Lexem[], grammarRules: string[][]): boolean {
//   debugger;
//   for (const rule of grammarRules) {
//     if (stack.length >= rule.length) {
//       const stackEnd = stack.slice(stack.length - rule.length);
//       const stackEndValues = stackEnd.map((lexem) => lexem.value);

//       console.log(stackEndValues, rule);
//       const isEquals = arraysEqual(stackEndValues, rule);

//       if (isEquals) {
//         return true; // Можно выполнить свертку
//       }
//     }
//   }
//   return false; // Свертка невозможна
// }

// function arraysEqual(a: string[], b: string[]): boolean {
//   debugger;
//   if (a.length !== b.length) {
//     return false;
//   }
//   for (let i = 0; i < a.length; i++) {
//     if (a[i] !== b[i]) {
//       return false;
//     }
//   }
//   return true;
// }

// function findMatchingRule(
//   stack: Lexem[],
//   grammarRules: string[][]
// ): string[] | undefined {
//   debugger;
//   for (const rule of grammarRules) {
//     if (stack.length >= rule.length) {
//       const stackEnd = stack.slice(stack.length - rule.length);
//       const stackEndValues = stackEnd.map((lexem) => convertToRuleSymbol(lexem.value));

//       if (arraysEqual(stackEndValues, rule)) {
//         return rule; // Найдено соответствующее правило
//       }
//     }
//   }
//   return undefined; // Соответствующее правило не найдено
// }

// export function convertToMatrixSymbol(lexem: Lexem): string {
//   // Преобразуем идентификаторы и константы в 'a'
//   if (lexem.type === "Identifier" || lexem.type === "Constant") {
//     return "a";
//   }
//   return lexem.value;
// }

// function matchesRule(segment: Lexem[], rule: string[]): boolean {
//   debugger;
//   if (segment.length !== rule.length) return false;
//   for (let i = 0; i < segment.length; i++) {
//     if (segment[i].value !== rule[i]) return false;
//   }
//   return true;
// }

// export function reduceStack(stack: Lexem[]): Lexem[] {
//   debugger;
//   const reducedStack = [...stack]; // Создаем копию стека для обработки

//   // Проверяем каждое правило
//   for (const rule of grammarRules) {
//     let i = 0;
//     while (i <= reducedStack.length - rule.length) {
//       // Сравниваем сегмент стека с текущим правилом
//       const segment = reducedStack.slice(i, i + rule.length);
//       if (matchesRule(segment, rule)) {
//         // Если сегмент соответствует правилу, выполняем свертку
//         reducedStack.splice(i, rule.length, {
//           number: i,
//           type: "NonTerminal",
//           value: "E",
//         });
//         i += 1; // Продвигаемся вперед после свертки
//       } else {
//         i += 1; // Продвигаемся вперед, если свертка невозможна
//       }
//     }
//   }

//   return reducedStack;
// }

// export function convertToRuleSymbol(tokenValue: string): string {
//   debugger;
//   // Преобразует токены в стеке для сравнения с грамматическими правилами
//   if (tokenValue === "a") {
//     return "E"; // Преобразует 'a' в 'E' для целей сравнения
//   }
//   return tokenValue;
// }

// export function getPrecedence(topSymbol: Lexem, currentSymbol: Lexem): string {
//   debugger;
//   const topValue = convertToMatrixSymbol(topSymbol);
//   const currentValue = convertToMatrixSymbol(currentSymbol);

//   const precedence = getPrecedenceMatrix()[topValue][currentValue];

//   if (precedence === "<" || precedence === "=") {
//     return "shift";
//   } else if (precedence === ">") {
//     return "reduce";
//   } else {
//     return "error";
//   }
// }

import { grammarRules } from "../grammarRules";
import { Lexem } from "../types";
import { getPrecedenceMatrix } from "./getPrecedenceMatrix";

export const shiftReduce = (inputTokens: Lexem[]): string => {
  const lineStack: Lexem[][] = [];
  let lineTemp: Lexem[] = [];

  inputTokens.forEach((token) => {
    lineTemp.push(token);
    if (token.value === ";") {
      lineStack.push(lineTemp);
      lineTemp = [];
    }
  });
  if (lineTemp.length > 0) lineStack.push(lineTemp);

  for (const line of lineStack) {
    const result = processLine(line);

    console.log({ result });
    if (result !== "Входная строка успешно разобрана") return result;
  }

  return "Входная строка успешно разобрана";
};

function processLine(line: Lexem[]): string {
  const stack: Lexem[] = [];
  const input = [...line];

  while (input.length > 0) {
    debugger;
    const currentToken = input[0];
    const topStack = stack.length > 0 ? stack[stack.length - 1] : null;
    const precedence = topStack ? getPrecedence(topStack, currentToken) : "shift";

    console.log({ precedence, topStack, currentToken });

    if (precedence === "shift") {
      const token = input.shift();
      if (token) {
        stack.push(token);
      }
    } else if (precedence === "reduce") {
      if (checkReduce(stack)) {
        const stack2 = performReduction(stack);
        console.log({ stack2, stack });

        break;
      } else {
        return "Ошибка: Входная строка не может быть разобрана";
      }
    }
  }

  return stack.length === 1 && stack[0].value === "E"
    ? "Входная строка успешно разобрана"
    : "Ошибка: Входная строка не может быть разобрана";
}

function checkReduce(stack: Lexem[]): boolean {
  for (const rule of grammarRules) {
    if (stack.length >= rule.length) {
      const stackEndValues = stack
        .slice(-rule.length)
        .map((lexem) => convertToMatrixSymbol(lexem));
      if (arraysEqual(stackEndValues, rule)) return true;
    }
  }
  return false;
}

function performReduction(stack: Lexem[]) {
  const rule = findMatchingRule(stack);
  if (rule) {
    stack.splice(stack.length - rule.length, rule.length);

    stack.push({ number: -1, type: "NonTerminal", value: "E" });

    return stack;
  } else {
    throw new Error("Ошибка: Входная строка не может быть разобрана");
  }
}

function findMatchingRule(stack: Lexem[]): string[] | undefined {
  for (const rule of grammarRules) {
    if (stack.length >= rule.length) {
      const stackEndValues = stack
        .slice(-rule.length)
        .map((lexem) => convertToMatrixSymbol(lexem));
      if (arraysEqual(stackEndValues, rule)) return rule;
    }
  }
  return undefined;
}

function convertToMatrixSymbol(lexem: Lexem): string {
  return lexem.type === "Identifier" || lexem.type === "Constant" ? "a" : lexem.value;
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function getPrecedence(topSymbol: Lexem, currentSymbol: Lexem): string {
  const topValue = convertToMatrixSymbol(topSymbol);
  const currentValue = convertToMatrixSymbol(currentSymbol);

  console.log({
    topValue,
    currentValue,
    getPrecedenceMatrix: getPrecedenceMatrix()[topValue],
  });

  const precedence = getPrecedenceMatrix()[topValue][currentValue];

  return precedence === "<" || precedence === "="
    ? "shift"
    : precedence === ">"
    ? "reduce"
    : "error";
}
