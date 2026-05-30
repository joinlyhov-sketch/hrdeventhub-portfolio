import React from "react";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { Question } from "../../../../data/Question";

interface TextQuestionProps {
  question: Question;
  onChange: (textAnswer: string) => void;
}

export default function TextQuestion({ question, onChange }: TextQuestionProps) {
  if (question.type === "short-text") {
    return (
      <Input
        type="text"
        value={question.textAnswer || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your short text answer here..."
        className="max-w-md border-0 border-b rounded-none px-0 shadow-none bg-transparent focus-visible:ring-0 focus-visible:border-primary"
      />
    );
  }

  return (
    <Textarea
      value={question.textAnswer || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your long detailed text answer here..."
      rows={3}
      className="max-w-4xl bg-muted/30 focus-visible:ring-1 resize-none rounded-xl"
    />
  );
}