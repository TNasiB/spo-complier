import React, { useEffect, useState } from "react";
import { lexicalAnalysis } from "./methods/lexAnalys";
import { Lexem } from "./types";
import { ShiftReduce3 } from "./methods/shiftReduce3";

const LogicalExpressionAnalyzer: React.FC = () => {
  const [tokens, setTokens] = useState<Lexem[]>([]);
  const [content, setContent] = useState("");
  const [syntaxRes, setSyntaxRes] = useState<unknown>(null);

  useEffect(() => {
    if (content) {
      const lexems = lexicalAnalysis(content);
      setTokens(lexems);
    }
  }, [content]);

  useEffect(() => {
    if (tokens.length === 0) return;
    new ShiftReduce3(tokens);
  }, [tokens]);

  useEffect(() => {
    // console.log({ syntaxRes });
  }, [syntaxRes]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const content = e.target.result as string;
          setContent(content);
        }
      };
      reader.readAsText(file);
    }
  };

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
                  {token.type}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {token.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <textarea
          readOnly
          value={content}
          cols={40}
          rows={11}
          style={{
            resize: "none",
            border: "1px solid black",
            padding: "8px",
            alignSelf: "flex-start",
          }}
        />
      </div>
    </div>
  );
};

export default LogicalExpressionAnalyzer;
