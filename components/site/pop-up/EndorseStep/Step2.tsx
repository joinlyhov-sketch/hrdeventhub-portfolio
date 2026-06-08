import { CheckCircle2 } from "lucide-react";
interface Step2Props {
  studentName: string;
  selectedSkill: string | null;
  commentText: string;
  setCommentText: (v: string) => void;
}
 
export default function StepTwo({ studentName, selectedSkill, commentText, setCommentText }: Step2Props) {
  const firstName = studentName.split(" ")[0];
  const MAX = 500;
  const remaining = MAX - commentText.length;
 
  return (
    <div className="flex flex-col gap-4">
      {selectedSkill && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 bg-primary/5 border border-primary/20 rounded-xl">
          <CheckCircle2 size={15} className="text-primary shrink-0" />
          <p className="text-sm font-medium text-primary">
            Endorsing <span className="font-semibold">{firstName}</span> for{" "}
            <span className="font-semibold">{selectedSkill}</span>
          </p>
        </div>
      )}
 
      <p className="text-sm text-grey-500 leading-relaxed">
        Share a specific observation about how{" "}
        <span className="font-semibold text-secondary">{firstName}</span>{" "}
        demonstrated this skill. Concrete examples make endorsements more credible.
      </p>
 
      <div className="relative">
        <textarea
          value={commentText}
          onChange={(e) => {
            if (e.target.value.length <= MAX) setCommentText(e.target.value);
          }}
          rows={5}
          placeholder={`Describe how ${firstName} demonstrated ${selectedSkill ?? "this skill"}…`}
          className="w-full p-4 bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors text-sm text-secondary placeholder:text-grey-400 resize-none leading-relaxed"
        />
        <span
          className={`absolute bottom-3 right-3 text-xs font-medium ${
            remaining < 50 ? "text-amber-500" : "text-grey-400"
          }`}
        >
          {remaining} left
        </span>
      </div>
    </div>
  );
}