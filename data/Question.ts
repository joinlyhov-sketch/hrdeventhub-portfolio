export interface Question {
  id: string;
  type:
    | "rating"
    | "linear"
    | "choice"
    | "short-text"
    | "long-text"
    | "dropdown"
    | "matrix"
    | "yes-no";
  text: string;
  options?: string[];
  matrixRows?: string[];
  matrixCols?: string[];
  maxScale?: number;
  linearStart?: number;
  linearEnd?: number;
  minLabel?: string;
  maxLabel?: string;
  textAnswer?: string;
  ratingValue?: number;
  toggleValue?: boolean;
  selectedChoice?: string;
  matrixAnswers?: Record<string, string>;
}
