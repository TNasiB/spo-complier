import { Lexem } from "../types";

// export function lexicalAnalysis(input: string): Lexem[] {
//   const tokens: Lexem[] = [];
//   const operators = ["or", "and", "xor", "not", "+", "*", ":=", "(", ")"];
//   const constants = ["0", "1"];

//   // Разбиваем входную строку на строки, разделенные точкой с запятой
//   const lines = input.split(";");

//   let tokenNumber = 1;
//   let braceCount = 0;

//   lines.forEach((line, lineIndex) => {
//     // Удаляем комментарии и лишние пробелы
//     const withoutComments = line.split("{")[0].trim();

//     // Разделяем строку на слова
//     const words = withoutComments.trim().split(/\s+/).filter(Boolean);

//     // Считаем открывающие и закрывающие скобки для комментариев
//     braceCount += (line.match(/{/g) || []).length;
//     braceCount -= (line.match(/}/g) || []).length;

//     // Проверяем корректность комментариев
//     if (braceCount < 0 || (braceCount > 0 && lineIndex === lines.length - 1)) {
//       tokens.push({
//         number: tokenNumber++,
//         type: "Error",
//         value: `Unmatched comment at line ${lineIndex + 1}`,
//       });
//       braceCount = Math.max(0, braceCount); // Сбрасываем счетчик скобок
//     }

//     // Анализируем каждое слово в строке
//     words.forEach((word) => {
//       if (operators.includes(word)) {
//         tokens.push({
//           number: tokenNumber++,
//           type: "Operator",
//           value: word,
//         });
//       } else if (constants.includes(word)) {
//         tokens.push({
//           number: tokenNumber++,
//           type: "Constant",
//           value: word,
//         });
//       } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(word)) {
//         // Проверка на идентификатор
//         tokens.push({
//           number: tokenNumber++,
//           type: "Identifier",
//           value: word,
//         });
//       } else {
//         // Если слово не удовлетворяет ни одному из шаблонов, считаем его ошибкой
//         tokens.push({
//           number: tokenNumber++,
//           type: "Error",
//           value: `Invalid token '${word}' at line ${lineIndex + 1}`,
//         });
//       }
//     });

//     if (words.length !== 0) {
//       tokens.push({
//         number: tokenNumber++,
//         type: "Delimiter",
//         value: ";",
//       });
//     }
//   });

//   if (braceCount > 0) {
//     // Если после анализа всех строк остались незакрытые комментарии
//     tokens.push({
//       number: tokenNumber++,
//       type: "Error",
//       value: "Unmatched comment at end of input",
//     });
//   }

//   return tokens;
// }

export function lexicalAnalysis(input: string): Lexem[] {
  const tokens: Lexem[] = [];
  const operators = ["+", "-", "*", "/", "(", ")", ":="];
  const keywords = ["if", "then", "else"]; // Добавлены ключевые слова
  const comparisonOperators = ["<", ">", "="]; // Добавлены операторы сравнения

  const lines = input.split(";");

  let tokenNumber = 1;
  let braceCount = 0;

  lines.forEach((line) => {
    const withoutComments = line.split("{")[0].trim(); // Убираем комментарии
    const words = withoutComments.trim().split(/\s+/);

    braceCount += line.split("{").length - 1;
    braceCount -= line.split("}").length - 1;

    if (braceCount < 0 || braceCount % 2 === 1) {
      braceCount = 0; // Сбрасываем счетчик при обнаружении ошибки
    }

    words.forEach((word) => {
      if (!Number.isNaN(Number(word))) {
        tokens.push({
          number: tokenNumber++,
          type: "Error",
          value: word,
        });
      } else if (
        /^\d+$/.test(word) ||
        /^(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})|I{1,3}|IV|IX|V|VI{0,3}|X{1,3})$/.test(
          word
        )
      ) {
        tokens.push({
          number: tokenNumber++,
          type: "Roman numeral",
          value: word,
        });
      } else if (word === ":=") {
        tokens.push({
          number: tokenNumber++,
          type: "Assignment sign",
          value: word,
        });
      } else if (operators.includes(word)) {
        if (word === "(" || word === ")") {
          tokens.push({
            number: tokenNumber++,
            type: "Splitter",
            value: word,
          });
        } else {
          tokens.push({
            number: tokenNumber++,
            type: "Operator",
            value: word,
          });
        }
      } else if (keywords.includes(word)) {
        tokens.push({
          number: tokenNumber++,
          type: "Keyword",
          value: word,
        });
      } else if (comparisonOperators.includes(word)) {
        tokens.push({
          number: tokenNumber++,
          type: "Comparison Operator",
          value: word,
        });
      } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(word)) {
        tokens.push({
          number: tokenNumber++,
          type: "Identifier",
          value: word,
        });
        // eslint-disable-next-line no-dupe-else-if
      } else if (/^\d+$/.test(word)) {
        tokens.push({
          number: tokenNumber++,
          type: "Number",
          value: word,
        });
      } else if (word === "") {
        // Пустая строка
      } else {
        tokens.push({
          number: tokenNumber++,
          type: "Error",
          value: word,
        });
      }
      const index = input.indexOf(word);
      const inputWithout = input.replace(/ ?\{[^}]*\}/g, "");
      if (index !== -1 && index + word.length < inputWithout.length) {
        const nextCharacter = inputWithout[index + word.length];

        if (nextCharacter === ";") {
          tokens.push({
            type: "Splitter",
            number: tokenNumber++,
            value: nextCharacter,
          });
        }
      }
    });
  });

  return tokens;
}
