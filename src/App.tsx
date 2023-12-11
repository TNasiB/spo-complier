import React, { useState } from "react";

const LoopOperatorAnalyzer: React.FC = () => {
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
    const operators = ["for", ";", "<", ">", "=", "do", "(", ")", ":="];
    const constants = ["I", "II", "III", "IV", "V"];
    const identifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

    const lines = input.split(";");

    let tokenNumber = 1;

    lines.forEach((line, lineIndex) => {
      const withoutComments = line.split("{")[0].trim(); // Убираем комментарии

      const words = withoutComments.trim().split(/\s+/).filter(Boolean);

      words.forEach((word) => {
        if (operators.includes(word.toLowerCase())) {
          tokens.push({
            number: tokenNumber++,
            lexeme: "Оператор цикла",
            value: word,
          });
        } else if (constants.includes(word.toUpperCase())) {
          tokens.push({
            number: tokenNumber++,
            lexeme: "Римское число",
            value: word,
          });
        } else if (identifierRegex.test(word)) {
          tokens.push({
            number: tokenNumber++,
            lexeme: "Идентификатор",
            value: word,
          });
        } else {
          tokens.push({
            number: tokenNumber++,
            lexeme: `Ошибка в строке ${lineIndex + 1}: ${word}`,
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

export default LoopOperatorAnalyzer;
