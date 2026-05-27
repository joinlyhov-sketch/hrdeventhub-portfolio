import React from "react";
import { Switch } from "../../../ui/switch";
import { Label } from "../../../ui/label";
import { Question } from "../../../../data/Question";

interface YesNoQuestionProps {
  question: Question;
  onChange: (value: boolean) => void;
}

export default function YesNoQuestion({ question, onChange }: YesNoQuestionProps) {
  return (
    <div className="flex items-center gap-4 mt-2">
      <Switch
        id={`switch-${question.id}`}
        checked={!!question.toggleValue}
        onCheckedChange={onChange}
      />
      <Label htmlFor={`switch-${question.id}`} className="text-sm font-semibold text-muted-foreground">
        {question.toggleValue ? "Yes" : "No"}
      </Label>
    </div>
  );
}