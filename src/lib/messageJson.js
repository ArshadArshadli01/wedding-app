/** Normalize DB rows to plain JSON-safe message objects (handles bigint id, drivers quirks). */
export function formatCreatedAt(value) {
  if (value instanceof Date) {
    return value.toISOString().replace("T", " ").slice(0, 19);
  }
  return value;
}

export function messageFromRow(row) {
  if (!row) return null;
  const name = row.name ?? row.Name;
  const body = row.message ?? row.Message ?? row.msg ?? row.body;
  return {
    id: Number(row.id),
    name: name != null ? String(name) : "",
    message: body != null ? String(body) : "",
    created_at: formatCreatedAt(row.created_at ?? row.createdAt),
  };
}
