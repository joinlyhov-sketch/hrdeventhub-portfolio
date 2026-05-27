import React from "react";
import { X, Plus } from "lucide-react";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Question } from "../../../../data/Question";

interface MatrixQuestionProps {
  question: Question;
  onUpdateItem: (
    key: "matrixRows" | "matrixCols",
    idx: number,
    value: string,
  ) => void;
  onAddItem: (key: "matrixRows" | "matrixCols", placeholder: string) => void;
  onRemoveItem: (key: "matrixRows" | "matrixCols", idx: number) => void;
  onAnswer: (rowLabel: string, colLabel: string) => void;
}

export default function MatrixQuestion({
  question,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
  onAnswer,
}: MatrixQuestionProps) {
  if (!question.matrixRows || !question.matrixCols) return null;

  return (
    <div className="space-y-6 w-full">
      <div className="w-full border border-border rounded-xl overflow-x-auto scrollbar-thin bg-muted/10 shadow-sm">
        <Table className="w-full min-w-[800px] table-fixed">
          <TableHeader>
            <TableRow className="bg-white hover:bg-slate-50 transition-colors">
              <TableHead className="p-3 text-xs font-bold w-[250px] min-w-[200px]">
                Rows (Questions)
              </TableHead>
              {question.matrixCols.map((col, cIdx) => (
                <TableHead
                  key={cIdx}
                  className="p-3 text-center min-w-[120px] w-[150px]"
                >
                  <div className="flex items-center justify-center gap-1 group/col">
                    <Input
                      type="text"
                      value={col}
                      onChange={(e) =>
                        onUpdateItem("matrixCols", cIdx, e.target.value)
                      }
                      className="text-center font-bold text-xs p-1 h-auto border-0 rounded-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-primary w-full"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem("matrixCols", cIdx)}
                      className="text-muted-foreground hover:text-destructive h-5 w-5 opacity-0 group-hover/col:opacity-100 transition-opacity shrink-0"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                </TableHead>
              ))}
              <TableHead className="p-3 text-center w-16 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onAddItem("matrixCols", "Column")}
                  className="text-primary hover:scale-110 transition-transform h-6 w-6"
                >
                  <Plus size={14} />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {question.matrixRows.map((row, rIdx) => (
              <TableRow
                key={rIdx}
                className="bg-background hover:bg-muted/20 transition-colors"
              >
                <TableCell className="p-3 w-[250px] min-w-[200px]">
                  <div className="flex items-center gap-2 group/row">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem("matrixRows", rIdx)}
                      className="text-muted-foreground hover:text-destructive h-6 w-6 opacity-0 group-hover/row:opacity-100 transition-opacity shrink-0"
                    >
                      <X size={14} />
                    </Button>
                    <Input
                      type="text"
                      value={row}
                      onChange={(e) =>
                        onUpdateItem("matrixRows", rIdx, e.target.value)
                      }
                      className="w-full bg-transparent p-1 h-auto border-0 border-b rounded-none shadow-none focus-visible:ring-0 focus-visible:border-primary text-sm"
                    />
                  </div>
                </TableCell>
                {question.matrixCols?.map((col, cIdx) => {
                  const isChecked = question.matrixAnswers?.[row] === col;
                  return (
                    <TableCell
                      key={cIdx}
                      className="p-3 text-center min-w-[120px] w-[150px]"
                    >
                      <button
                        type="button"
                        onClick={() => onAnswer(row, col)}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mx-auto transition-all ${
                          isChecked
                            ? "border-primary bg-transparent scale-105"
                            : "border-gray-300 bg-white hover:border-gray-400"
                        }`}
                      >
                        {isChecked && (
                          <div className="w-3 h-3 rounded-full bg-primary transition-transform duration-150" />
                        )}
                      </button>
                    </TableCell>
                  );
                })}
                <TableCell className="w-16" />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onAddItem("matrixRows", "Row Statement")}
        className="flex items-center gap-2 text-xs font-semibold"
      >
        <Plus size={16} /> Add Row Statement
      </Button>
    </div>
  );
}
