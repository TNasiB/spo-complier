import React, { useState } from "react";

const ArithmeticExpressionAnalyzer: React.FC = () => {
  const [tokens, setTokens] = useState<
    { number: number; lexeme: string; value: string }[]
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
  ): { number: number; lexeme: string; value: string }[] {
    const tokens: { number: number; lexeme: string; value: string }[] = [];
    const operators = ["+", "-", "*", "/", "(", ")", ":="];
    const hexRegex = /0x[0-9a-fA-F]+/;
    const identifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

    const expressions = input.split(";");

    let tokenNumber = 1;

    expressions.forEach((expression, expressionIndex) => {
      const elements = expression.trim().split(/\s+/).filter(Boolean);

      elements.forEach((element) => {
        if (operators.includes(element)) {
          tokens.push({
            number: tokenNumber++,
            lexeme: "Оператор",
            value: element,
          });
        } else if (hexRegex.test(element)) {
          tokens.push({
            number: tokenNumber++,
            lexeme: "Шестнадцатеричное число",
            value: element,
          });
        } else if (identifierRegex.test(element)) {
          tokens.push({
            number: tokenNumber++,
            lexeme: "Идентификатор",
            value: element,
          });
        } else {
          setError(`Ошибка в строке ${expressionIndex + 1}: ${element}`);
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

export default ArithmeticExpressionAnalyzer;
