export function formatNumberAr(num: number): string {
  return num.toLocaleString("ar-SA");
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("ar-SA", { hour12: false });
}

export function formatDateAr(date: Date): string {
  return date.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
}

export function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function randomInRange(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min));
}

export function randomDecimal(min: number, max: number, decimals: number): number {
  return parseFloat((min + Math.random() * (max - min)).toFixed(decimals));
}
