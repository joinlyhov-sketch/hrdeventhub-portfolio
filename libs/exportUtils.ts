import { surveyService } from "@/service/survey.service";

interface SurveySubmissionResponse {
  responseId: string;
  surveyId: string;
  appUserId: string;
  username: string | null;
  content: Record<string, unknown>;
  submittedAt: string;
}

interface SurveyElement {
  name: string;
  title: string;
}

interface PollOption {
  id: string;
  text: string;
  voteCount?: number;
  votes?: number;
}

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = typeof value === "object" ? JSON.stringify(value) : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const headerRow = headers.map(escapeCell).join(",");
  const dataRows = rows.map((row) =>
    headers.map((h) => escapeCell(row[h])).join(",")
  );
  return [headerRow, ...dataRows].join("\n");
}

function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function fetchQuestionMap(surveyId: string): Promise<{
  surveyTitle: string;
  questions: SurveyElement[];
}> {
  try {
    const survey = await surveyService.getSurveyById(surveyId);
    const surveyTitle = survey.title ?? "";
    const questions: SurveyElement[] = (survey.content?.pages ?? []).flatMap(
      (page) =>
        (page.elements ?? []).map((el) => ({
          name: el.name ?? "",
          title: el.title ?? el.name ?? "",
        }))
    );
    return { surveyTitle, questions };
  } catch {
    return { surveyTitle: "", questions: [] };
  }
}

export async function generateSurveyCsv(
  allResponses: SurveySubmissionResponse[],
  surveyTitle: string
): Promise<void> {
  if (!allResponses || allResponses.length === 0) {
    throw new Error("No responses found for this survey.");
  }

  const surveyId = allResponses[0].surveyId;

  const { surveyTitle: fetchedTitle, questions } = await fetchQuestionMap(surveyId);
  const resolvedTitle = fetchedTitle || surveyTitle;

  const keyToTitle = new Map<string, string>();
  for (const q of questions) {
    if (q.name) keyToTitle.set(q.name, q.title || q.name);
  }

  const allKeys = new Set<string>();
  for (const r of allResponses) {
    if (r.content && typeof r.content === "object") {
      Object.keys(r.content).forEach((k) => allKeys.add(k));
    }
  }

  const orderedKeys: string[] = [
    ...questions.map((q) => q.name).filter((name) => allKeys.has(name)),
    ...[...allKeys].filter((k) => !questions.some((q) => q.name === k)),
  ];

  const rows: Record<string, unknown>[] = allResponses.map((r) => {
    const row: Record<string, unknown> = {
      surveyId: r.surveyId,
      surveyTitle: resolvedTitle,
      responseId: r.responseId,
      responderName: r.username || r.appUserId,
      submittedAt: r.submittedAt
        ? new Date(r.submittedAt).toLocaleString()
        : "",
    };

    for (const key of orderedKeys) {
      const header = keyToTitle.get(key) || key;
      const val = r.content?.[key];
      row[header] =
        val !== null && val !== undefined && typeof val === "object"
          ? JSON.stringify(val)
          : val ?? "";
    }

    return row;
  });

  const csv = toCsv(rows);
  const safeTitle = resolvedTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  downloadCsv(csv, `survey_${safeTitle}_responses.csv`);
}

export function generatePollCsv(options: PollOption[], pollTitle: string): void {
  if (!options || options.length === 0) {
    throw new Error("No options found for this poll.");
  }

  const rows: Record<string, unknown>[] = options.map((opt) => ({
    optionId: opt.id,
    optionText: opt.text,
    voteCount: opt.voteCount ?? opt.votes ?? 0,
  }));

  const csv = toCsv(rows);
  const safeTitle = pollTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  downloadCsv(csv, `poll_${safeTitle}_results.csv`);
}