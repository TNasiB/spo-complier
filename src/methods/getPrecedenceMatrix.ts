import { Precedence, PrecedenceEnum } from "../types";

export function getPrecedenceMatrix(): { [key: string]: { [key: string]: Precedence } } {
  // Инициализация матрицы предшествования

  // Возвращаем инициализированную матрицу предшествования
  return precedenceMatrix;
}
