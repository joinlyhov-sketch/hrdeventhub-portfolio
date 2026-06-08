export function generateBillNo(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const initials = parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  const counter = String(Date.now()).slice(-7).padStart(7, "0");
  return `${initials}${counter}`;
}