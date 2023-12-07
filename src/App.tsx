import React, { useState } from "react";

const LogicalExpressionAnalyzer: React.FC = () => {
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
    const operators = ["or", "and", "xor", "not", "(", ")", ":="];
    const constants = ["0", "1"];

    const lines = input.split(";");

    let tokenNumber = 1;

    lines.forEach((line, lineIndex) => {
      const words = line.trim().split(/\s+/).filter(Boolean); // Фильтр пустых значений

      words.forEach((word) => {
        if (operators.includes(word.toLowerCase())) {
          tokens.push({
            number: tokenNumber++,
            type: "Operator",
            lexeme: "Знак операции",
            value: word,
          });
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
          setError(`Ошибка в строке ${lineIndex + 1}, слово: ${word}`);
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
            <tr key={token.number}>
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

export default LogicalExpressionAnalyzer;
