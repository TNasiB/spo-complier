import React, { useState } from "react";
import { Input, Table } from "antd";
import Column from "antd/es/table/Column";
import "./global.scss";
import { Alert } from "antd";

const { TextArea } = Input;

const ArithmeticExpressionAnalyzer: React.FC = () => {
  const [tokens, setTokens] = useState<
    { number: number; lexeme: string; value: string }[]
  >([]);
  const [error, setError] = useState<string[]>([]);
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
    const operators = ["+", "-", "*", "/", "(", ")", ":="];
    const hexRegex = /^0x([0-9a-fA-F]+)$/;
    const identifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    const expressions = input.split(";");

    let tokenNumber = 1;

    expressions.forEach((expression, expressionIndex) => {
      const withoutComments = expression.split("{")[0].trim(); // Убираем комментарии
      const elements = withoutComments.trim().split(/\s+/).filter(Boolean);
      elements.forEach((element) => {
        if (element === ":=") {
          tokens.push({
            number: tokenNumber++,
            lexeme: "Знак присваивания",
            value: element,
          });
        } else if (operators.includes(element)) {
          if (element === "(" || element === ")") {
            tokens.push({
              number: tokenNumber++,
              lexeme: "Разделитель",
              value: element,
            });
          } else {
            tokens.push({
              number: tokenNumber++,
              lexeme: "Оператор",
              value: element,
            });
          }
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
          setError((prev) => [
            ...prev,
            `Ошибка в строке ${expressionIndex + 1}: ${element}`,
          ]);
          tokens.push({
            number: tokenNumber++,
            lexeme: `Ошибка в строке ${expressionIndex + 1}: ${element}`,
            value: element,
          });
        }
        const index = input.indexOf(element);
        if (index !== -1 && index + element.length < input.length) {
          const nextCharacter = input[index + element.length];
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
        <h2>Штурмина В.А. ИВТ-424 ЛБ2</h2>
      </center>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <Input type="file" onChange={handleFileUpload} />

          <TextArea
            placeholder="Код "
            name=""
            id=""
            cols={30}
            rows={10}
            value={code}
          ></TextArea>

          {error &&
            error.map((elem) => {
              return <Alert key={elem} message={elem} type="error" showIcon />;
            })}
          {code !== "" && error.length === 0 && (
            <Alert message={"Успешно"} type="success" showIcon />
          )}
        </div>
        <Table dataSource={tokens} style={{ width: "50%" }} pagination={false}>
          <Column title="Индекс" dataIndex="number" key="address" />
          <Column title="Тип" dataIndex="lexeme" key="address" />
          <Column title="Значение" dataIndex="value" key="address" />
        </Table>
      </div>
    </div>
  );
};

export default ArithmeticExpressionAnalyzer;
