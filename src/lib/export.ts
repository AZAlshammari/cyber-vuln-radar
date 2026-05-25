export function exportJson(filename: string, data: unknown) {
  download(filename, JSON.stringify(data, null, 2), "application/json");
}

export function exportCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return download(filename, "", "text/csv");
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map((row) =>
      keys
        .map((key) => `"${String(row[key] ?? "").replaceAll('"', '""').replace(/\s+/g, " ")}"`)
        .join(","),
    ),
  ].join("\n");
  download(filename, csv, "text/csv");
}

function download(filename: string, text: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
