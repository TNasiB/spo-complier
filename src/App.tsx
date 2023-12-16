import React, { useState } from "react";

const LogicalExpressionAnalyzer: React.FC = () => {
  const [tokens, setTokens] = useState<
    { number: number; type: string; lexeme: string; value: string }[]
  >([]);

  const [content, setContent] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const content = e.target.result as string;
          const lexemes = lexicalAnalysis(content);
          const result = performSyntaxAnalysis(lexemes);
          console.log({ result });
          setContent(content);
          setTokens(lexemes);
        }
      };
      reader.readAsText(file);
    }
  };

  function lexicalAnalysis(
    input: string
  ): { number: number; type: string; lexeme: string; value: string }[] {
    const tokens: {
      number: number;
      type: string;
      lexeme: string;
      value: string;
      position?: number;
    }[] = [];
    const operators = ["or", "and", "xor", "not", "(", ")", ":="];
    const constants = ["0", "1"];

    const lines = input.split(";");

    let tokenNumber = 1;
    let braceCount = 0;

    lines.forEach((line, lineIndex) => {
      const withoutComments = line.split("{")[0].trim();

      const words = withoutComments.trim().split(/\s+/).filter(Boolean);

      braceCount += line.split("{").length - 1;
      braceCount -= line.split("}").length - 1;

      if (braceCount < 0 || braceCount % 2 === 1) {
        tokens.push({
          number: tokenNumber++,
          type: "Error",
          lexeme: `Ошибка! Незакрытый комментарий в строке ${lineIndex + 1}`,
          value: "Коммент",
        });
        braceCount = 0;
      }

      words.forEach((word) => {
        if (word === ":=") {
          tokens.push({
            number: tokenNumber++,
            lexeme: "Знак присваивания",
            type: "Assignment sign",
            value: word,
          });
        }
        if (operators.includes(word.toLowerCase())) {
          if (word === "(" || word === ")") {
            tokens.push({
              number: tokenNumber++,
              type: "Splitter",
              lexeme: "Разделитель",
              value: word,
            });
          } else {
            tokens.push({
              number: tokenNumber++,
              type: "Operator",
              lexeme: "Знак операции",
              value: word,
            });
          }
        } else if (constants.includes(word)) {
          tokens.push({
            number: tokenNumber++,
            type: "Constant",
            lexeme: "Константа",
            value: word,
          });
        } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(word)) {
          tokens.push({
            number: tokenNumber++,
            type: "Identifier",
            lexeme: "Идентификатор",
            value: word,
          });
        } else if (word === ":=") {
          tokens.push({
            number: tokenNumber++,
            type: "Assignment Operator",
            lexeme: "Знак присваивания",
            value: word,
          });
        } else if (word === "(" || word === ")") {
          tokens.push({
            number: tokenNumber++,
            type: "Parenthesis",
            lexeme: "Круглая скобка",
            value: word,
          });
        } else {
          const wordPosition = line.indexOf(word) + 1;
          tokens.push({
            number: tokenNumber++,
            type: "Error",
            lexeme: `Ошибка в строке ${
              lineIndex + 1
            }, слово: ${word}  в позиции ${wordPosition}`,
            value: word,
          });
        }
        const index = input.indexOf(word);
        if (index !== -1 && index + word.length < input.length) {
          const nextCharacter = input[index + word.length];
          if (nextCharacter === ";") {
            tokens.push({
              number: tokenNumber++,
              type: "Splitter",
              lexeme: "Разделитель",
              value: nextCharacter,
            });
          }
        }
      });
    });

    return tokens;
  }

  type GrammarRules = { [key: string]: string[][] };

  function performSyntaxAnalysis(grammarRules: GrammarRules, tokens: string[]): string {
    const shiftReduce = (grammarRules: GrammarRules, inputTokens: string[]): string => {
      const stack: { symbol: string; isTerminal: boolean }[] = [];
      const input = [...inputTokens]; // Копируем входной массив токенов

      const isTerminal = (symbol: string): boolean => {
        return !Object.keys(grammarRules).includes(symbol);
      };

      while (input.length > 0 || stack.length > 1) {
        const currentSymbol = input[0];
        const topStack = stack[stack.length - 1];

        if (!topStack || topStack.isTerminal || !grammarRules[topStack.symbol]) {
          // Сдвиг, если на вершине стека терминал или нет правил для текущего символа
          stack.push({ symbol: currentSymbol, isTerminal: isTerminal(currentSymbol) });
          input.shift(); // Сдвигаем входной массив токенов
        } else {
          const rule = grammarRules[topStack.symbol].find((r) => {
            const rightSymbols = r.split(" ");
            return (
              rightSymbols.join("") ===
              stack
                .slice(-rightSymbols.length)
                .map((item) => item.symbol)
                .join("")
            );
          });

          if (rule) {
            // Свертка
            const rightSymbols = rule.split(" ");
            stack.splice(-rightSymbols.length);
            stack.push({
              symbol: rule.split(" ")[0],
              isTerminal: isTerminal(rule.split(" ")[0]),
            });
          } else {
            // Не найдено правило для свертки
            return "Ошибка: Не найдено правило для свертки";
          }
        }
      }

      return "Входная строка успешно разобрана";
    };

    return shiftReduce(grammarRules, tokens);
  }

  // const isTerminal = (symbol) => {
  //   return !Object.keys(grammarRules).includes(symbol);
  // };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "pink",
      }}
    >
      <input type="file" onChange={handleFileUpload} style={{ marginBottom: "20px" }} />

      <div style={{ display: "flex", gap: 20 }}>
        <table
          style={{
            borderCollapse: "collapse",
            backgroundColor: "white",
            padding: "10px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>№ лексемы</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Лексема</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Значение</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr
                key={token.number}
                style={{ background: token.type === "Error" ? "red" : "transparent" }}
              >
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {token.number}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {token.lexeme}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {token.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <textarea
          value={content}
          cols={30}
          rows={10}
          style={{ resize: "none", border: "1px solid black", padding: "8px" }}
        />
      </div>
    </div>
  );
};

export default LogicalExpressionAnalyzer;
