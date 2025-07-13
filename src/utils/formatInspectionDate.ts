export function formatInspectionDate(dateOnly: string): string {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const localDateTimeString = `${dateOnly}T${hours}:${minutes}:${seconds}`;

  const localDateTime = new Date(localDateTimeString);

  return localDateTime.toISOString();
}
