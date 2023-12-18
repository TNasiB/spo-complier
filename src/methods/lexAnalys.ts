import { Lexem } from "../types";

export function lexicalAnalysis(input: string): Lexem[] {
  const tokens: Lexem[] = [];
  const operators = ["or", "and", "xor", "not", "+", "*", ":=", "(", ")"];
  const constants = ["0", "1"];

  // Разбиваем входную строку на строки, разделенные точкой с запятой
  const lines = input.split(";");

  let tokenNumber = 1;
  let braceCount = 0;

  lines.forEach((line, lineIndex) => {
    // Удаляем комментарии и лишние пробелы
    const withoutComments = line.split("{")[0].trim();

    // Разделяем строку на слова
    const words = withoutComments.trim().split(/\s+/).filter(Boolean);

    // Считаем открывающие и закрывающие скобки для комментариев
    braceCount += (line.match(/{/g) || []).length;
    braceCount -= (line.match(/}/g) || []).length;

    // Проверяем корректность комментариев
    if (braceCount < 0 || (braceCount > 0 && lineIndex === lines.length - 1)) {
      tokens.push({
        number: tokenNumber++,
        type: "Error",
        value: `Unmatched comment at line ${lineIndex + 1}`,
      });
      braceCount = Math.max(0, braceCount); // Сбрасываем счетчик скобок
    }

    // Анализируем каждое слово в строке
    words.forEach((word) => {
      if (operators.includes(word)) {
        tokens.push({
          number: tokenNumber++,
          type: "Operator",
          value: word,
        });
      } else if (constants.includes(word)) {
        tokens.push({
          number: tokenNumber++,
          type: "Constant",
          value: word,
        });
      } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(word)) {
        // Проверка на идентификатор
        tokens.push({
          number: tokenNumber++,
          type: "Identifier",
          value: word,
        });
      } else {
        // Если слово не удовлетворяет ни одному из шаблонов, считаем его ошибкой
        tokens.push({
          number: tokenNumber++,
          type: "Error",
          value: `Invalid token '${word}' at line ${lineIndex + 1}`,
        });
      }
    });
  });

  if (braceCount > 0) {
    // Если после анализа всех строк остались незакрытые комментарии
    tokens.push({
      number: tokenNumber++,
      type: "Error",
      value: "Unmatched comment at end of input",
    });
  }

  return tokens;
}
