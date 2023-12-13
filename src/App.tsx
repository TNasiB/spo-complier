import React, { useState } from "react";

const LogicalExpressionAnalyzer: React.FC = () => {
  const [tokens, setTokens] = useState<
    { number: number; type: string; lexeme: string; value: string }[]
  >([]);
  const [error, setError] = useState<string>("");
  const [content, setContent] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const content = e.target.result as string;
          const lexemes = lexicalAnalysis(content);
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
    const tokens: { number: number; type: string; lexeme: string; value: string }[] = [];
    const operators = ["or", "and", "xor", "not", "(", ")", ":="];
    const constants = ["0", "1"];

    const lines = input.split(";");

    let tokenNumber = 1;

    lines.forEach((line, lineIndex) => {
      const withoutComments = line.split("{")[0].trim();

      const words = withoutComments.trim().split(/\s+/).filter(Boolean);

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
          tokens.push({
            number: tokenNumber++,
            type: "Error",
            lexeme: `Ошибка в строке ${lineIndex + 1}, слово: ${word}`,
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

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "pink",
      }}
    >
      <input type="file" onChange={handleFileUpload} style={{ marginBottom: "20px" }} />
      {error && <p style={{ color: "red" }}>{error}</p>}
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
              <tr key={token.number}>
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
      <div className="unicorn"></div>
    </div>
  );
};

export default LogicalExpressionAnalyzer;
