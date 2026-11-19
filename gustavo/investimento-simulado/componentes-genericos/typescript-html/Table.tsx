import type { ReactNode } from "react";

interface TableProps {
  headers: string[];
  rows: ReactNode[][];
  caption?: string;
  emptyMessage?: string;
}

export function Table({ headers, rows, caption, emptyMessage = "Nenhum registro encontrado." }: TableProps) {
  return (
    <div className="ui-table-wrapper">
      <table className="ui-table">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>{headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length}>{emptyMessage}</td></tr>
          ) : rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
