import React, { useRef, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { Message } from "primereact/message";

const ConditionalOperatorAnalyzer: React.FC = () => {
  const [tokens, setTokens] = useState<
    { number: number; type: string; lexeme: string; value: string }[]
  >([]);
  const [error, setError] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setError([]);
          setCode("");
          setTokens([]);
          const content = e.target.result as string;
          setCode(content);
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
          setError((prev) => [
            ...prev,
            `Ошибка в строке ${lineIndex + 1}, слово ${wordIndex + 1}`,
          ]);
          tokens.push({
            number: tokenNumber++,
            type: "Error",
            lexeme: `Ошибка в строке ${lineIndex + 1}, слово ${wordIndex + 1}`,
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
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <Card
          title="Загрузка файла"
          style={{ width: "100%" }}
          className={tokens.length === 0 ? "empty" : "default"}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <Button
              label="Загрузить файл"
              onClick={() => {
                inputRef.current?.click();
              }}
            />
            <input
              style={{ display: "none" }}
              ref={inputRef}
              type="file"
              onChange={handleFileUpload}
            />

            {code && <InputTextarea value={code} rows={20} cols={40} />}
          </div>
        </Card>
        {error.length !== 0 && (
          <Card title="Статус" style={{ display: "flex", justifyContent: "center" }}>
            {error.map((elem) => {
              return <Message key={elem} severity="error" text={error} />;
            })}
          </Card>
        )}
        {error.length === 0 && code !== "" && (
          <Card title="Статус" style={{ display: "flex", justifyContent: "center" }}>
            <Message severity="success" text="Ошибок нет" />
          </Card>
        )}
      </div>
      {tokens.length !== 0 && (
        <DataTable value={tokens} tableStyle={{ minWidth: "50rem" }}>
          <Column
            field="number"
            header="Индекс"
            bodyClassName={(rowData) =>
              rowData.lexeme.includes("Ошибка") ? "red" : "none"
            }
          ></Column>
          <Column
            field="lexeme"
            header="Тип"
            bodyClassName={(rowData) =>
              rowData.lexeme.includes("Ошибка") ? "red" : "none"
            }
          ></Column>
          <Column
            field="value"
            header="Значение"
            bodyClassName={(rowData) =>
              rowData.lexeme.includes("Ошибка") ? "red" : "none"
            }
          ></Column>
        </DataTable>
      )}
    </div>
  );
};

export default ConditionalOperatorAnalyzer;
