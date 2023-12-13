import React, { useRef, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import { Message } from "primereact/message";

const LoopOperatorAnalyzer: React.FC = () => {
  const [tokens, setTokens] = useState<
    { number: number; lexeme: string; value: string }[]
  >([]);
  const [error, setError] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [code, setCode] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
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
  ): { number: number; lexeme: string; value: string }[] {
    const tokens: { number: number; lexeme: string; value: string }[] = [];
    const operators = ["for", ";", "<", ">", "=", "do", "(", ")", ":="];
    const constants = ["|", "||", "|||", "|V", "V"];
    const identifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

    const lines = input.split(";");

    let tokenNumber = 1;

    lines.forEach((line, lineIndex) => {
      const withoutComments = line.split("{")[0].trim(); // Убираем комментарии

      const words = withoutComments.trim().split(/\s+/).filter(Boolean);

      words.forEach((word) => {
        const isRomanNumeral =
          /^(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(
            word.toUpperCase()
          );
        const isIdentifier = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(word);

        if (isRomanNumeral) {
          tokens.push({
            number: tokenNumber++,
            lexeme: "Римское число",
            value: word,
          });
        } else if (isIdentifier) {
          tokens.push({
            number: tokenNumber++,
            lexeme: "Идентификатор",
            value: word,
          });
        } else if (word === ">" || word === "<") {
          tokens.push({
            number: tokenNumber++,
            lexeme: "Знак сравнения",
            value: word,
          });
        } else if (word === ":=") {
          tokens.push({
            number: tokenNumber++,
            lexeme: "Знак присваивания",
            value: word,
          });
        } else if (operators.includes(word.toLowerCase())) {
          if (word === "(" || word === ")") {
            tokens.push({
              number: tokenNumber++,
              lexeme: "Разделитель",
              value: word,
            });
          } else {
            tokens.push({
              number: tokenNumber++,
              lexeme: "Оператор цикла",
              value: word,
            });
          }
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
            lexeme: "Ошибка",
            value: word,
          });
          setError((prev) => [...prev, `Ошибка в строке ${lineIndex + 1}: ${word}`]);
        }
        const index = input.indexOf(word);
        if (index !== -1 && index + word.length < input.length) {
          const nextCharacter = input[index + word.length];
          if (nextCharacter === ";") {
            tokens.push({
              number: tokenNumber++,
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
    <div>
      <center>
        <h1> Файзуллин А.И ИВТ-424</h1>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "5px", width: "400px" }}
        >
          {error &&
            error.map((elem) => {
              return <Message key={elem} severity="error" text={elem} />;
            })}
          {error.length === 0 && code !== "" && <Message severity="success" />}
        </div>
      </center>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Button
            size="small"
            label="Загрузить файл"
            severity="warning"
            onClick={() => {
              if (inputRef.current !== null) {
                inputRef.current.click();
              }
            }}
          />
          <input
            ref={inputRef}
            style={{ display: "none" }}
            type="file"
            onChange={handleFileUpload}
          />
          <InputTextarea value={code} rows={10} cols={30} placeholder="Здесь будет код" />
        </div>

        <DataTable value={tokens} tableStyle={{ minWidth: "50rem" }} emptyMessage="Пусто">
          <Column field="number" header="Индекс"></Column>
          <Column field="lexeme" header="Тип"></Column>
          <Column field="value" header="Значение"></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default LoopOperatorAnalyzer;
