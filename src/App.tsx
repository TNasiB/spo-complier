import React, { useState } from "react";

const ConditionalOperatorAnalyzer: React.FC = () => {
  const [tokens, setTokens] = useState<
    { number: number; type: string; lexeme: string; value: string }[]
  >([]);
  const [error, setError] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const content = e.target.result as string;
          const lexemes = lexicalAnalysis(content);
          setTokens(lexemes);
        }
      };
      reader.readAsText(file);
    }
  };

  function lexicalAnalysis(
    input: string
  ): { number: number; type: string; lexeme: string; value: string }[] {
    const tokens: { number: number; type: string; lexeme: string; value: string }[] = [];
    const operators = ["+", "-", "*", "/", "(", ")", ":="];
    const keywords = ["if", "then", "else"]; // Добавлены ключевые слова
    const comparisonOperators = ["<", ">", "="]; // Добавлены операторы сравнения

    const lines = input.split(";");

    let tokenNumber = 1;

    lines.forEach((line, lineIndex) => {
      const withoutComments = line.split("{")[0].trim(); // Убираем комментарии
      const words = withoutComments.trim().split(/\s+/);

      words.forEach((word, wordIndex) => {
        if (operators.includes(word)) {
          tokens.push({
            number: tokenNumber++,
            type: "Operator",
            lexeme: "Знак операции",
            value: word,
          });
        } else if (keywords.includes(word)) {
          tokens.push({
            number: tokenNumber++,
            type: "Keyword",
            lexeme: "Ключевое слово",
            value: word,
          });
        } else if (comparisonOperators.includes(word)) {
          tokens.push({
            number: tokenNumber++,
            type: "Comparison Operator",
            lexeme: "Оператор сравнения",
            value: word,
          });
        } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(word)) {
          tokens.push({
            number: tokenNumber++,
            type: "Identifier",
            lexeme: "Идентификатор",
            value: word,
          });
        } else if (/^\d+$/.test(word)) {
          tokens.push({
            number: tokenNumber++,
            type: "Number",
            lexeme: "Число",
            value: word,
          });
        } else if (word === "") {
          // Пустая строка
        } else {
          tokens.push({
            number: tokenNumber++,
            type: "Error",
            lexeme: `Ошибка в строке ${lineIndex + 1}, слово ${wordIndex + 1}`,
            value: word,
          });
        }
      });
    });

    return tokens;
  }

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>№ лексемы</th>
            <th>Лексема</th>
            <th>Значение</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr
              style={{ background: token.type === "Error" ? "red" : "transparent" }}
              key={token.number}
            >
              <td>{token.number}</td>
              <td>{token.lexeme}</td>
              <td>{token.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConditionalOperatorAnalyzer;
